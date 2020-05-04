var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'harvesting';
        }
        
        if (creep.memory.state === 'harvesting') {
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.state = 'depositing';
                creep.say('depositing');
            }
            let tombstones = creep.room.find(FIND_TOMBSTONES, {
                    filter: (t) => t.store[RESOURCE_ENERGY] > 0
                });
                
            if (tombstones.length > 0) {
                for(let i = 0; i < tombstones.length; i++) {
                    let tombstone = tombstones[i];
                    if (creep.pos.getRangeTo(tombstone) < 15) {
                        if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(tombstone);
                        }
                        return;
                    } 
                }
            }
            
            let resources = creep.room.find(FIND_DROPPED_RESOURCES);
                
            if (resources.length > 0) {
                for(let i = 0; i < resources.length; i++) {
                    if (creep.pos.getRangeTo(resources[i]) < 15) {
                        if (creep.pickup(resources[i]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(resources[i]);
                        }
                        return;
                    }
                }
            }
            
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        
        if(creep.memory.state === 'depositing') {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = 'harvesting';
                creep.say('harvesting');
                return;
            }
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN
                                ) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_STORAGE ||
                                    structure.structureType == STRUCTURE_TOWER) && 
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
            }
            
            var target;
            if(targets.length > 0) {
                target = targets[0];
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
	}
};

module.exports = roleHarvester;