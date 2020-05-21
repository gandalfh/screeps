module.exports = {
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'deployflag';
        }
        
        if (creep.memory.state === 'deployflag') {
            if (creep.room !== Game.spawns['FraggsHouse'].room) {
                creep.memory.state = 'stage1';
            }

            creep.moveTo(Game.flags.InvasionFlag2);
        }
        
        if (creep.memory.state === 'stage1') {
            if (creep.pos.getRangeTo(Game.flags.InvasionStage1) < 2) {
                creep.memory.state = 'stage2';
            }
            creep.moveTo(Game.flags.InvasionStage1);
        }
        
        if (creep.memory.state === 'stage2') {
            if (creep.pos.getRangeTo(Game.flags.InvasionStage2) < 2) {
                creep.memory.state = 'stage3';
            }
            creep.moveTo(Game.flags.InvasionStage2);
        }
        
        if (creep.memory.state === 'stage3') {
            if (creep.pos.getRangeTo(Game.flags.InvasionStage3) < 2) {
                creep.memory.state = 'fight';
            }
            creep.moveTo(Game.flags.InvasionStage3);
        }
        
        if (creep.memory.state === 'fight') {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c) => !roomData.allies[c.owner.username]});
            
            if (target) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};