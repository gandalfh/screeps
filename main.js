var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

var roleBuilder = require('role.builder');

var roleRepair = require('role.repair');

var roleArcher = require('role.archer');

var spawnLogic = require('spawnLogic');
let roleMainAll = require('role.mainall');

var roleHealer = require('role.healer');
var roleFighter = require('role.fighter');
var roleInvader = require('role.invader');
var roleBuilderInvader = require('role.builder.invader');

var safeModeLogic = require('safeModeLogic');

var roleHarvesterInvader = require('role.harvester.invader');
var roleFighterInvader = require('role.fighter.invader');

var roleHarvesterExtension = require('role.harvester.extension');

var roleStorageTransfer = require('role.storage.transfer');

let roleInvaderDefender = require('role.invader.defender');

let roleUpgraderStorage = require('role.upgrader.storage');

let roleInvaderRepair = require('role.invader.repair');

let roleStorageExtensions = require('role.storage.extensions');

var loopIndex = 0;


let myUserName = "FraggDoubt";

let context;

let roomStrategies = {
    rooms: { 
        'E45S13': { strategy: 'owned', invasion: true, },
        'E44S13': { strategy: 'invade', invasion: false, },
    },
};


module.exports.loop = function () {
    if (!context) {
        context = {
            myUserName: myUserName,
            rooms: [],
        };

        for(let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            if (roomStrategies.rooms[room.name]) {
                let storageUnits = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER;
                    }
                });
                let roomData = {
                    roomName: room.name,
                    atWar: false,
                    empireUnderAttack: false,
                    invaderCoreDetected: false,
                    strategy: roomStrategies.rooms[room.name].strategy,
                    spawns: [],
                    hasStorage: storageUnits.length > 0,
                };
                for(let spawnName in Game.spawns) {
                    let spawn = Game.spawns[spawnName];
                    if (spawn.room === room) {
                        roomData.spawns.push({name: spawnName})
                    }
                }
                context.rooms.push(roomData);
            }
        }
    }


    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
            loopIndex = 0;
        }
    }

    for(let roomIndex = 0; roomIndex < context.rooms.length; roomIndex++) {
        let roomData = context.rooms[roomIndex];
        let atWar = roomData.atWar;
        let empireUnderAttack = roomData.empireUnderAttack;
        let invaderCoreDetected = roomData.invaderCoreDetected;
        let room = Game.rooms[roomData.roomName];
        var enemies = room.find(FIND_HOSTILE_CREEPS);
            
        if (enemies.length > 0) {
            if (!atWar) {
                console.log('Alert, we are at war!');
                atWar = true;
                loopIndex = 0;
            }
            
            let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            for(let i = 0; i < towers.length; i++) {
                towers[i].attack(enemies[0]);
            }
        }
        else {
            if (atWar) {
                console.log('Alert, we are no longer at war!');
                atWar = false;
            }
        }

        if (loopIndex % 10 === 0) {
            for(let i = 0; i < context.rooms.length; i++) {
                spawnLogic.run(context, room, roomData, atWar, empireUnderAttack, invaderCoreDetected);
            }
        }

        loopIndex++;        
        
        safeModeLogic.run(context, room, atWar);

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            
            if(creep.memory.role == 'harvester') {
                if (roleMainAll.run(creep)) {
                    roleHarvester.run(creep);
                }
            }
            if(creep.memory.role == 'upgrader') {
                if (roleMainAll.run(creep)) {
                    roleUpgrader.run(creep);
                }
            }
            if(creep.memory.role == 'builder') {
                if (roleMainAll.run(creep)) {
                    roleBuilder.run(creep);
                }
            }
            if(creep.memory.role == 'repairer') {
                if (roleMainAll.run(creep)) {
                    roleRepair.run(creep);
                }
            }
            if(creep.memory.role == 'archer') {
                roleArcher.run(creep);
            }
            if (creep.memory.role === 'invader') {
                if (roleInvader.run(creep) === 'empire.under.attack') {
                    empireUnderAttack = true;
                }
            }
            if (creep.memory.role === 'fighter.invader') {
                roleFighterInvader.run(creep);
            }
            
            if (creep.memory.role === 'harvester.extension') {
                if (roleMainAll.run(creep)) {
                    roleHarvesterExtension.run(creep);
                }
            }
            
            if (creep.memory.role === 'storage.extension') {
                if (roleMainAll.run(creep)) {
                    roleStorageExtensions.run(creep);
                }
            }
            
            if (creep.memory.role === 'storage.transfer') {
                if (roleMainAll.run(creep)) {
                    roleStorageTransfer.run(creep);
                }
            }
            
            if (creep.memory.role === 'upgrader.storage') {
                if (roleMainAll.run(creep)) {
                    roleUpgraderStorage.run(creep);
                }
            }
            
            if (creep.memory.role === 'invader.defender') {
                if (roleInvaderDefender.run(creep) === 'all.is.calm')
                {
                    empireUnderAttack = false;
                }
            }
            
            if (creep.memory.role === 'builder.invader') {
                roleBuilderInvader.run(creep);
            }

            if (creep.memory.role === 'harvester.invader') {
                let status = roleHarvesterInvader.run(creep, empireUnderAttack);

                if (status === 'invader.core.detected') {
                    invaderCoreDetected = true;
                }
                if (status === 'empire.under.attack') {
                    empireUnderAttack = true;
                }

            }        
            
            if (creep.memory.role === 'healer') {
                roleHealer.run(creep, empireUnderAttack);
            }
            
            if (creep.memory.role === 'fighter') {
                roleFighter.run(creep);
            }
            
            if (creep.memory.role === 'invader.repair') {
                roleInvaderRepair.run(creep);
            }
        }
    }
    
}