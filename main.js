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

var atWar = false;
let empireUnderAttack = false;

let controllerMax;

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
            loopIndex = 0;
        }
    }
    
    
    let room = Game.spawns.FraggsHouse.room;
    
    if (!controllerMax) {
        controllerMax = room.controller.hits;
    }
    
    if (room.controller.hits > controllerMax) {
        controllerMax = room.controller.hits;
    }

    if (loopIndex % 10 === 0) {
        spawnLogic.run(atWar, empireUnderAttack);
    }
    loopIndex++;
    
    var enemies = Game.spawns.FraggsHouse.room.find(FIND_HOSTILE_CREEPS);
        
    if (enemies.length > 0) {
        if (!atWar) {
            console.log('Alert, we are at war!');
            atWar = true;
            loopIndex = 0;
        }
        
        let towers = Game.spawns.FraggsHouse.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
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
    
    safeModeLogic.run(atWar);

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
            if (roleHarvesterInvader.run(creep, empireUnderAttack) === 'empire.under.attack') {
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