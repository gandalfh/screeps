var roleUpgraderStorage = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'harvesting';
        }
        
        if (creep.memory.state === 'harvesting') {
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.state = 'upgrading';
            }
	        sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && 
                                structure.store[RESOURCE_ENERGY] > 0;
                    }
            });
            
            if (sources.length > 0) {
                let source = sources[0];
                if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                creep.moveTo(Game.flags.Harvesters);
            }
        }
        
        if (creep.memory.state === 'upgrading') {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = 'harvesting';
            }
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgraderStorage;