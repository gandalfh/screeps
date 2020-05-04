var roleHarvesterExtension = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.state = 'harvesting';
        }
        if (creep.store.getFreeCapacity() === 0) {
            creep.memory.state = 'depositing';
        }
        
	    if(creep.memory.state === 'harvesting') {
            var sources = creep.room.find(FIND_SOURCES);
            //var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER
                                    ) && 
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                
                if (!target) {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION) && 
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });
                }

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                creep.moveTo(Game.flags.ExtensionHarvesters,  {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleHarvesterExtension;