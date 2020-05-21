module.exports = {
    run: function(creep, roomData, room) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c) => !roomData.allies[c.owner.username]});

        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            creep.moveTo(Game.flags[roomData.roomName + '.FighterRally']);
        }
    }
};