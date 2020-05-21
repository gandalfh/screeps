module.exports = {
    run: function(creep, roomData, room) {
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
        let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
        });

        if (targets.length > 0) {
            if(creep.store.getFreeCapacity() > 0) {
                
                if (sources.length > 0) {
                    let source = sources[0];
                    
                    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
            else {
                let target = targets[0];
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            creep.moveTo(Game.flags[roomData.roomName + '.Harvesters']);
        }
        
        
    }
};