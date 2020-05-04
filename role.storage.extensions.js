module.exports = {
    run: function(creep) {
        let sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && 
                            structure.store[RESOURCE_ENERGY] > 0;
                }
        });
        
        if (sources.length === 0) {
            sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && 
                                structure.store[RESOURCE_ENERGY] > 0;
                    }
            });        
        }
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
        });

        if (target) {
            if(creep.store.getFreeCapacity() > 0) {
                if (sources.length > 0) {
                    let source = sources[0];
                    
                    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
            else {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            creep.moveTo(Game.flags.Harvesters);
        }
    }
};