module.exports = {
    spawnCreep: function(name, role, minCount, parts) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(creeps.length < minCount) {
            let newName = name + Game.time;
            let result = Game.spawns['FraggsHouse'].spawnCreep(parts, newName, {
                memory: {role: role}});
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
    run: function(atWar, empireUnderAttack, invaderCoreDetected) {
        let room = Game.spawns.FraggsHouse.room;
        
        let extensionHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester.extension');

        let minHarvesters = 5;

        let parts = [WORK, WORK, WORK, CARRY, CARRY, WORK, MOVE];
        if (extensionHarvesters.length === 0) {
            parts = [WORK, CARRY, CARRY, MOVE];
        }
        let harvesterResult = this.spawnCreep('Harvester', 'harvester', 6, parts);
        
        let harvesters = harvesterResult.creeps;
        
        this.spawnCreep('Transferer', 'storage.transfer', 1, [WORK,CARRY,CARRY,MOVE]);

        if (harvesters.length > minHarvesters) {
            
            this.spawnCreep('InvaderBuilder', 'builder.invader', 0, [WORK,WORK,WORK,CARRY,CARRY,MOVE]);

            if(empireUnderAttack || invaderCoreDetected) {
                this.spawnCreep('InvaderDefender', 'invader.defender', 4, [ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,MOVE]);
            }
            
            this.spawnCreep('InvaderFighter', 'fighter.invader', 0, [RANGED_ATTACK,RANGED_ATTACK,TOUGH,WORK,MOVE]);


            if (!empireUnderAttack) {
                this.spawnCreep('InvaderHarvester', 'harvester.invader', 8, [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]);
            }
            
            this.spawnCreep('InvaderRepairer', 'invader.repair', 1, [WORK,WORK,CARRY,CARRY,MOVE]);
            

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
            
            this.spawnCreep('ExtensionHarvester', 'harvester.extension', minExtensionHarvesters, parts);
            
            this.spawnCreep('StorageExtensionTransferer', 'storage.extension', 5, [WORK,CARRY,CARRY,CARRY,MOVE]);
            
            let minHealers = 1;
            
            if (atWar) {
                this.spawnCreep('Fighter', 'fighter', 5, [ATTACK,ATTACK,ATTACK,MOVE,MOVE]);
                minHealers = 3;
            }
            
            let invaderResult = this.spawnCreep('Invader', 'invader', 2, [CLAIM,MOVE]);
            let invaders = invaderResult.creeps;

            if (harvesters.length >= minHarvesters && invaders.length > 0) {
                this.spawnCreep('Healer', 'healer', minHealers, [HEAL,MOVE,MOVE]);

                if (!atWar && !empireUnderAttack) {
                    
                    let sites = room.find(FIND_CONSTRUCTION_SITES);
                    if (sites.length > 0) {
                        let minBuilders = Math.min(sites.length , 5);
                        
                        this.spawnCreep('Builder', 'builder', minBuilders, [WORK,WORK,CARRY,CARRY,MOVE,MOVE]);
                    }
                    
                    this.spawnCreep('Upgrader', 'upgrader', 4, [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE]);

                    this.spawnCreep('UpgraderStorage', 'upgrader.storage', 4, [WORK,WORK,CARRY,CARRY,CARRY,MOVE, MOVE]);
                }
                
                this.spawnCreep('Repairer', 'repairer', 4, [WORK,WORK,CARRY,CARRY,MOVE,MOVE]);

                if (atWar) {
                    let ramparts = room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_RAMPART;
                            }
                    });
                    
                    this.spawnCreep('Archer', 'archer', ramparts.length, [RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE]);
                }
            }
        }
    }
};