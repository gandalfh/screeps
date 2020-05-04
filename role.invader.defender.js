module.exports = {
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'invasionflag';
        }

        if (creep.memory.state === 'invasionflag') {
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.moveTo(Game.flags.DefendersFlag);
                creep.memory.state = 'fight';
                return;
            }
            else if (creep.pos.getRangeTo(Game.flags.InvasionFlag) > 0) {
                creep.moveTo(Game.flags.InvasionFlag);
            }
        }        
        
        if (creep.memory.state === 'fight') {
            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                creep.memory.doNotHeal = false;
                if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return 'empire.under.attack';
            }
            else {
                creep.memory.doNotHeal = true;
                if (creep.room === Game.spawns.FraggsHouse.room) {
                    creep.moveTo(Game.spawns.FraggsHouse);
                    if (Game.spawns.FraggsHouse.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns.FraggsHouse);
                    }
                }
                else {
                    creep.moveTo(Game.flags.EnergyStealerFlag);
                }
                
                return 'all.is.calm';
            }
        }
    }
};