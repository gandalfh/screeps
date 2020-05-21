let controllerSafeModeCountDown = 20;

module.exports = {
    run: function(roomData, room) {
        if (roomData.atWar) {
            var enemies = room.find(FIND_HOSTILE_CREEPS, {filter: (c) => !roomData.allies[c.owner.username]});
            for(let i = 0; i < enemies.length; i++) {
                let enemy = enemies[i];
                let rangeToController = enemy.pos.getRangeTo(Game.spawns['FraggsHouse']);
                if (rangeToController < 5) {
                    roomData.controllerSafeModeCountDown--;
                    if (roomData.controllerSafeModeCountDown <= 0) {
                        Game.notify('Safe mode triggered by attacker with username: ' + enemy.owner.username);
                        Game.spawns['FraggsHouse'].room.controller.activateSafeMode();
                    }
                }
            }
        }
        else {
            roomData.controllerSafeModeCountDown = 20;
        }
    }
};