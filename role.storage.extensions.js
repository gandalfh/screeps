module.exports = {
    run: function(creep, roomData, room) {
        if (!creep.memory.state) {
            creep.memory.state = 'withdraw';
        }

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
        });        
        
        if (creep.memory.state === 'withdraw') {
            if (target) {
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
                if (sources.length > 0) {
                    let source = sources[0];
                    
                    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                    
                    if (creep.store.getFreeCapacity() === 0) {
                        creep.memory.state = 'deposit';
                    }
                }
            }
            else {
                creep.moveTo(Game.flags[roomData.roomName + '.Harvesters']);
            }
        }
            
        if (creep.memory.state === 'deposit' && target) {
            if(creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = 'withdraw';
            }
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            creep.moveTo(Game.flags[roomData.roomName + '.Harvesters']);
        }
    }
};