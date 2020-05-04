module.exports = {
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'invasionflag';
        }
        
        if (creep.memory.state === 'invasionflag') {
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.memory.state = 'reservecontroller';
            }
            else if (creep.pos.getRangeTo(Game.flags.InvasionFlag) > 0) {
                creep.moveTo(Game.flags.InvasionFlag);
            }
        }

        if (creep.memory.state === 'reservecontroller') {
            let status = creep.reserveController(creep.room.controller);    
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            return 'empire.under.attack';
        }
        else {
            return 'all.is.calm';
        }
    }
};