let controllerSafeModeCountDown = 20;

module.exports = {
    run: function(atWar) {
        if (atWar) {
            var enemies = Game.spawns.FraggsHouse.room.find(FIND_HOSTILE_CREEPS);
            for(let i = 0; i < enemies.length; i++) {
                let enemy = enemies[i];
                let rangeToController = enemy.pos.getRangeTo(Game.spawns['FraggsHouse']);
                if (rangeToController < 5) {
                    controllerSafeModeCountDown--;
                    if (controllerSafeModeCountDown <= 0) {
                        Game.notify('Safe mode triggered by attacker with username: ' + enemy.owner.username);
                        Game.spawns['FraggsHouse'].room.controller.activateSafeMode();
                    }
                }
            }
        }
        else {
            controllerSafeModeCountDown = 20;
        }
    }
};