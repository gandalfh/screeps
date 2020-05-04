var percentage = 0.000003;

let repairTargets = {
    
};


module.exports = {
    run: function(creep) {
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
            creep.memory.state = 'harvesting';
        }
        
        
        if (creep.store.getFreeCapacity() === 0 && creep.memory.state === 'harvesting') {
            creep.memory.state = 'repairing';
        }
        
        if (creep.memory.state === 'harvesting') {
            
            let sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && 
                                structure.store[RESOURCE_ENERGY] > 0;
                    }
            }); 
            
            if (sources.length > 0) {
                let source = sources[0];
                
                if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                creep.moveTo(Game.flags.Standby,  {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        
        if (creep.memory.state === 'repairing') {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = 'harvesting';
            }
            
            
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_RAMPART) && (s.hits < 1000) && !repairTargets[s.id]
                });
            }

            if (target === null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_RAMPART) && (s.hits < 10000) && !repairTargets[s.id]
                });                
            }   
 
            

            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_CONTAINER) && s.hits/s.hitsMax < 0.50 && !repairTargets[s.id]
                });
            } 
            
            if (target === null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_ROAD) && (s.hits < s.hitsMax*.10) && !repairTargets[s.id]
                });                
            }            
            if (target === null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_ROAD) && (s.hits < s.hitsMax*.50) && !repairTargets[s.id]
                });                
            }  
            
            
            if (target === null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_ROAD) && (s.hits < s.hitsMax*.60) && !repairTargets[s.id]
                });                
            }             
            
            if (target === null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_RAMPART) && (s.hits < 250000) && !repairTargets[s.id]
                });                
            }   
            
            if (target === null) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.hits / s.hitsMax < percentage)  && !repairTargets[s.id]
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
                if (percentage > 1) {
                    percentage = 0.000003;
                }
                creep.moveTo(Game.flags.Standby,  {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};