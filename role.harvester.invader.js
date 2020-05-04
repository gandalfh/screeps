var roleHarvesterInvader = {

    /** @param {Creep} creep **/
    run: function(creep, empireUnderAttack) {
        if (creep.ticksToLive <= 90) {
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.moveTo(Game.flags.EnergyStealerFlag);
            }
            else {
                creep.moveTo(Game.flags.Graveyard, {visualizePathStyle: {stroke: '#ff0000'}});
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                
                if (targets.length > 0) {
                    creep.transfer(targets[0], RESOURCE_ENERGY)
                }
            }
            return;
        }
        
        if (empireUnderAttack) {
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.moveTo(Game.flags.EnergyStealerFlag);
            }
            else {
                creep.moveTo(Game.flags.ArcherRally)
            }
            return;
        }
        
        
        
        if (!creep.memory.state) {
            creep.memory.state = 'invasionflag';
        }
        
        if (creep.memory.state === 'invasionflag') {
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.memory.state = 'steal';
            }
            else if (creep.pos.getRangeTo(Game.flags.InvasionFlag) > 0) {
                creep.moveTo(Game.flags.InvasionFlag);
            }
        }
        
        
        if (creep.memory.state === 'steal') {
            if (creep.room === Game.spawns.FraggsHouse.room) {
                creep.memory.state = 'deposit';
                return;
            }
            if(creep.store.getFreeCapacity() === 0) {
                creep.memory.state = 'energystealerflag';
            }
            else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        
        if (creep.memory.state === 'energystealerflag') {
            if (creep.room === Game.spawns.FraggsHouse.room) {
                creep.memory.state = 'deposit';
            }

            if (creep.pos.getRangeTo(Game.flags.EnergyStealerFlag) > 0) {
                creep.moveTo(Game.flags.EnergyStealerFlag);
            }
        }
        
        if (creep.memory.state === 'deposit') {
            var target;
            
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.memory.state = 'energystealerflag';
                return;
            }
            
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = 'invasionflag';
            }

            if (!target) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_STORAGE ||
                                    structure.structureType == STRUCTURE_TOWER) && 
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                
                if(targets.length > 0) {
                    target = targets[0];
                }
            }
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                creep.moveTo(Game.flags.Harvesters);
            }
        }
        
        if (creep.room !== Game.spawns.FraggsHouse.room) {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                return 'empire.under.attack';
            }
            else {
                return 'all.is.calm';
            }
        }
        else {
            return 'all.is.calm';
        }
	}
};

module.exports = roleHarvesterInvader;