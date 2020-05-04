var percentage = 0.000003;

let repairTargets = {
    
};

module.exports = {
    run: function(creep) {
        if (percentage >= 1) {
            percentage = 0.001;
        }
        
        let target;
        for(let targetId in repairTargets) {
            let targetStructure = repairTargets[targetId];
            if (targetStructure) {
                if (!Game.getObjectById(targetStructure.repairerId) || !Game.getObjectById(targetId)) {
                    delete repairTargets[targetId];
                }
                else {
                    if (targetStructure.repairerId === creep.id) {
                        if (creep.memory.state === 'repairing') {
                            target = Game.getObjectById(targetId);
                            if (target.hits === target.hitsMax) {
                                target = undefined;                                
                            }
                        }
                        else {
                            delete repairTargets[targetId];
                        }
                    }
                }
            }
        }

        if (!creep.memory.state) {
            creep.memory.state = 'invadeflag';
        }
        
        if (creep.memory.state === 'invadeflag') {
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.memory.state = 'harvesting';
            }
            else {
                creep.moveTo(Game.flags.InvasionFlag);
            }
        }

        if (creep.memory.state === 'harvesting') {
            if (creep.room === Game.spawns.FraggsHouse.room) { 
                creep.memory.state = 'invadeflag';
            }
            
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.state = 'repairing';
            }
            else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }            
            }
        }
            
        if (creep.memory.state === 'repairing') {
            if (creep.room === Game.spawns.FraggsHouse.room) { 
                creep.memory.state = 'invadeflag';
            }
        

            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = 'harvesting';
            }            
            
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.hits / s.hitsMax < percentage)  && !repairTargets[s.id]
                });
            }
            
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < s.hitsMax)  && !repairTargets[s.id]
                });
            }            
            
            if (target !== null) {
                var status = creep.repair(target);
                repairTargets[target.id] =  { repairerId: creep.id };
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target,  {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
                percentage *= 10;
                creep.moveTo(Game.flags.DefendersFlag,  {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};