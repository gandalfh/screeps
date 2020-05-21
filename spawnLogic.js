module.exports = {
    spawnCreep: function(room, roomData, name, role, minCount, parts) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.birthRoom === roomData.roomName);
        
        if (roomData.debug) console.log(roomData.roomName + ': ' + role + ' has ' + creeps.length + ' needs ' + minCount);
        if(creeps.length < minCount) {
            if (roomData.debug) console.log(roomData.roomName + ': gonna spawn with ' + parts.length + ' parts');
            let spawn = Game.spawns[roomData.spawns[0].name];
            let newName = name + Game.time;
            
            let result = spawn.spawnCreep(parts, newName, {
                memory: {role: role, birthRoom: roomData.roomName }});
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
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room === room);
        
        
        let extensions = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        });        
        
        let fullExtensions = 0;
        for(let i = 0; i < extensions.length; i++) {
            if (extensions[i].store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                fullExtensions++;
            }
        }        

   

        let minHarvesters = roomData.minHarvesters;

        let parts = [WORK, WORK, WORK, CARRY, CARRY, WORK, MOVE];
        if (extensions.length === 0 || fullExtensions < 5) {
            parts = [WORK, CARRY, CARRY, MOVE];
        }
        let harvesterResult = this.spawnCreep(room, roomData, 'Harvester', 'harvester', roomData.maxHarvesters, parts);
        
        let harvesters = harvesterResult.creeps;
        
        if (roomData.hasStorage) {
            this.spawnCreep(room, roomData, 'Transferer', 'storage.transfer', roomData.maxStorageTransferers, [WORK,CARRY,CARRY,MOVE]);
        }
        

        if (harvesters.length >= minHarvesters) {
            let minHealers = 1;
            
            if (atWar) {
                let fighterResult = this.spawnCreep(room, roomData, 'Fighter', 'fighter', 5, [ATTACK,ATTACK,ATTACK,MOVE,MOVE]);
                if (fighterResult.creeps.length === 0) {
                    this.spawnCreep(room, roomData, 'Fighter', 'fighter', 1, [ATTACK,ATTACK,MOVE]);
                    return;
                }
                minHealers = 3;
                this.spawnCreep(room, roomData, 'Healer', 'healer', minHealers, [HEAL,MOVE,MOVE]);
            }            
            
            let upgraderParts = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE];
                        
            if (extensions.length < 10) {
                upgraderParts = [WORK, WORK, CARRY, MOVE];
            }

            if (upgraders.length < 1) {
                this.spawnCreep(room, roomData, 'Upgrader', 'upgrader', roomData.maxUpgraders, upgraderParts);
            }
            if (extensions.length > 0) {
                
                let minExtensionHarvesters = Math.min(roomData.maxExtensionHarvesters, parseInt(extensions.length/2));
                
                if (extensions.length > 5) {
                    if (fullExtensions > parseInt(extensions.length*0.5)) {
                        minExtensionHarvesters = Math.min(roomData.maxExtensionHarvesters, 2);
                    }
                }
                
                parts = [WORK,CARRY,CARRY,MOVE];
                if (extensions.length > 5 && extensionHarvesters.length > 2 && fullExtensions > 3) {
                    parts = [WORK,WORK, CARRY,CARRY,CARRY,CARRY,MOVE];
                }
                
                this.spawnCreep(room, roomData, 'ExtensionHarvester', 'harvester.extension', minExtensionHarvesters, parts);
                
                this.spawnCreep(room, roomData, 'StorageExtensionTransferer', 'storage.extension', roomData.maxStorageExtensions, [WORK,CARRY,CARRY,MOVE]);
            }            
            
            if (roomData.invasion) {
                if(empireUnderAttack || invaderCoreDetected) {
                    this.spawnCreep(room, roomData, 'InvaderDefender', 'invader.defender', 4, [ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,MOVE]);
                }
                
                this.spawnCreep(room, roomData, 'InvaderBuilder', 'builder.invader', 1, [WORK,WORK,WORK,CARRY,CARRY,MOVE]);

                if (!empireUnderAttack && !invaderCoreDetected) {
                    this.spawnCreep(room, roomData, 'InvaderHarvester', 'harvester.invader', 8, [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]);
                }
                
                this.spawnCreep(room, roomData, 'InvaderRepairer', 'invader.repair', 1, [WORK,WORK,CARRY,CARRY,MOVE]);
            }

            
            

            
            invaders = [];
            if (roomData.invasion) {
                let invaderResult = this.spawnCreep(room, roomData, 'Invader', 'invader', 2, [CLAIM,MOVE]);
                invaders = invaderResult.creeps;
            }

            if (harvesters.length >= roomData.minHarvesters && (!roomData.invasion || invaders.length > 0)) {

                if (!atWar && !empireUnderAttack) {
                    
                    let sites = room.find(FIND_CONSTRUCTION_SITES);
                    if (sites.length > 0) {
                        let minBuilders = Math.min(sites.length , 5);
                        
                        let parts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
                        
                        if (extensions.length < 5) {
                            parts = [WORK, WORK, CARRY, MOVE];
                        }

                        this.spawnCreep(room, roomData, 'Builder', 'builder', minBuilders, parts);
                    }
                    
                    this.spawnCreep(room, roomData, 'Upgrader', 'upgrader', roomData.maxUpgraders, upgraderParts);

                    this.spawnCreep(room, roomData, 'UpgraderStorage', 'upgrader.storage', roomData.maxUpgraderStorage, upgraderParts);
                }
                
                if (atWar) {
                    let ramparts = room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_RAMPART;
                            }
                    });
                    
                    let parts = [RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE];
                    
                    if (extensions.length < 5) {
                        parts = [RANGED_ATTACK,RANGED_ATTACK,MOVE];
                    }
                    
                    this.spawnCreep(room, roomData, 'Archer', 'archer', ramparts.length, parts);
                }                
                
                
                let parts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
                    
                if (extensions.length < 5) {
                    parts = [WORK, WORK, CARRY, MOVE];
                }
                
                this.spawnCreep(room, roomData, 'Repairer', 'repairer', roomData.maxRepairers, parts);


            }
        }
    }
};