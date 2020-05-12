module.exports = {
    spawnCreep: function(room, roomData, name, role, minCount, parts) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room === room);
        if(creeps.length < minCount) {
            let spawn = Game.spawns[roomData.spawns[0].name];
            let newName = name + Game.time;
            
            let result = spawn.spawnCreep(parts, newName, {
                memory: {role: role, birthRoom: Game.spawns['FraggsHouse'].room.name }});
            if (result === 0) {
                console.log('Spawned new ' + name + ': ' + newName);
                return {creeps: creeps, success: true};
            }
            else {
                if (result !== -4 && result !== -6) {
                    console.log('Error spawning new ' + name + ': ' + result);
                }
            }
        }
        return {creeps: creeps, success: false};
    },
    run: function(context, room, roomData, atWar, empireUnderAttack, invaderCoreDetected) {
        let extensionHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester.extension' && creep.room === room);

        let minHarvesters = 5;

        let parts = [WORK, WORK, WORK, CARRY, CARRY, WORK, MOVE];
        if (extensionHarvesters.length === 0) {
            parts = [WORK, CARRY, CARRY, MOVE];
        }
        let harvesterResult = this.spawnCreep(room, roomData, 'Harvester', 'harvester', 6, parts);
        
        let harvesters = harvesterResult.creeps;
        
        if (roomData.hasStorage) {
            this.spawnCreep(room, roomData, 'Transferer', 'storage.transfer', 1, [WORK,CARRY,CARRY,MOVE]);
        }

        if (harvesters.length > minHarvesters) {
            
            if (roomData.invader) {
                this.spawnCreep(room, roomData, 'InvaderBuilder', 'builder.invader', 1, [WORK,WORK,WORK,CARRY,CARRY,MOVE]);

                if(empireUnderAttack || invaderCoreDetected) {
                    this.spawnCreep(room, roomData, 'InvaderDefender', 'invader.defender', 4, [ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,MOVE]);
                }
                
                this.spawnCreep(room, roomData, 'InvaderFighter', 'fighter.invader', 0, [RANGED_ATTACK,RANGED_ATTACK,TOUGH,WORK,MOVE]);


                if (!empireUnderAttack) {
                    this.spawnCreep(room, roomData, 'InvaderHarvester', 'harvester.invader', 8, [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]);
                }
                
                this.spawnCreep(room, roomData, 'InvaderRepairer', 'invader.repair', 1, [WORK,WORK,CARRY,CARRY,MOVE]);
            }

            if (extensions.length > 0) {

                let extensions = room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_EXTENSION;
                        }
                });
                
                let minExtensionHarvesters = Math.min(5, parseInt(extensions.length/2));
                let fullExtensions = 0;
                
                if (extensions.length > 5) {
                    for(let i = 0; i < extensions.length; i++) {
                        if (extensions[i].store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                            fullExtensions++;
                        }
                    }
                    
                    if (fullExtensions > parseInt(extensions.length*0.5)) {
                        minExtensionHarvesters = 2;
                    }
                }
                
                parts = [WORK,CARRY,CARRY,MOVE];
                if (extensions.length > 5 && extensionHarvesters.length > 2) {
                    parts = [WORK,WORK, CARRY,CARRY,CARRY,CARRY,MOVE];
                }
                
                this.spawnCreep(room, roomData, 'ExtensionHarvester', 'harvester.extension', minExtensionHarvesters, parts);
                
                this.spawnCreep(room, roomData, 'StorageExtensionTransferer', 'storage.extension', 5, [WORK,CARRY,CARRY,CARRY,MOVE]);
            }
            
            let minHealers = 1;
            
            if (atWar) {
                this.spawnCreep(room, roomData, 'Fighter', 'fighter', 5, [ATTACK,ATTACK,ATTACK,MOVE,MOVE]);
                minHealers = 3;
            }
            
            invaders = [];
            if (roomData.invader) {
                let invaderResult = this.spawnCreep(room, roomData, 'Invader', 'invader', 2, [CLAIM,MOVE]);
                invaders = invaderResult.creeps;
            }

            if (harvesters.length >= minHarvesters && (!roomData.invaders || invaders.length > 0)) {
                this.spawnCreep(room, roomData, 'Healer', 'healer', minHealers, [HEAL,MOVE,MOVE]);

                if (!atWar && !empireUnderAttack) {
                    
                    let sites = room.find(FIND_CONSTRUCTION_SITES);
                    if (sites.length > 0) {
                        let minBuilders = Math.min(sites.length , 5);
                        
                        this.spawnCreep(room, roomData, 'Builder', 'builder', minBuilders, [WORK,WORK,CARRY,CARRY,MOVE,MOVE]);
                    }
                    
                    this.spawnCreep(room, roomData, 'Upgrader', 'upgrader', 4, [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE]);

                    this.spawnCreep(room, roomData, 'UpgraderStorage', 'upgrader.storage', 4, [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE]);
                }
                
                this.spawnCreep(room, roomData, 'Repairer', 'repairer', 4, [WORK,WORK,CARRY,CARRY,MOVE,MOVE]);

                if (atWar) {
                    let ramparts = room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_RAMPART;
                            }
                    });
                    
                    this.spawnCreep(room, roomData, 'Archer', 'archer', ramparts.length, [RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE]);
                }
            }
        }
    }
};