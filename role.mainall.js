module.exports = {
    run: function(creep, roomData, room) {
        if (creep.ticksToLive < 60) {
            creep.moveTo(Game.flags[roomData.roomName + '.Graveyard'], {visualizePathStyle: {stroke: '#ff0000'}});
            let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE ||
                                structure.structureType == STRUCTURE_CONTAINER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            
            if (targets.length > 0) {
                creep.transfer(targets[0], RESOURCE_ENERGY)
            }
            return false;
        }
        return true;
    }
};