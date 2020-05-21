var roleHarvesterExtension = {

    /** @param {Creep} creep **/
    run: function(creep, roomData, room) {
        if (!creep.memory.state) {
            creep.memory.state = 'staging';
        }
        
        if (creep.memory.state === 'staging') {
            creep.moveTo(Game.flags[roomData.roomName + '.ExtensionHarvesters'],  {visualizePathStyle: {stroke: '#ffffff'}});
            if (creep.pos.getRangeTo(Game.flags[roomData.roomName + '.ExtensionHarvesters']) < 2) {
                creep.memory.state = 'harvesting';
            }
        }

        
	    if(creep.memory.state === 'harvesting') {
	        if (creep.store.getFreeCapacity() === 0) {
                creep.memory.state = 'depositing';
            }
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        if (creep.memory.state === 'depositing') {
                if (creep.store[RESOURCE_ENERGY] === 0) {
                    creep.memory.state = 'harvesting';
                }
            
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
                creep.moveTo(Game.flags[roomData.roomName + '.ExtensionHarvesters'],  {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleHarvesterExtension;