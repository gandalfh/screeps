
module.exports = {
    run: function(creep, empireUnderAttack) {
        
        if (empireUnderAttack && creep.room === Game.spawns.FraggsHouse.room) {
            creep.moveTo(Game.flags.InvasionFlag);
        }
        else if (!empireUnderAttack && creep.room !== Game.spawns.FraggsHouse.room) {
            creep.moveTo(Game.flags.EnergyStealerFlag);
        }
        else {
            const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax && !object.memory.doNotHeal;
                }
            });
            if(target) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                if(creep.pos.isNearTo(target)) {
                    creep.heal(target);
                }
                else {
                    creep.rangedHeal(target);
                }
            }
            else {
                creep.moveTo(Game.flags.HealerRally, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};