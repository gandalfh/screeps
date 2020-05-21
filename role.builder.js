var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, roomData, room) {
        if (!creep.memory.state) {
            creep.memory.state = 'staging';
        }
        
        if (creep.memory.state === 'staging') {
            if (!Game.flags[creep.memory.birthRoom + '.BuildFrom'] && !Game.flags[creep.memory.birthRoom + '.BuildFrom2']) {
                creep.memory.state = 'building';
            }
            else {
                var pathLen = creep.pos.getRangeTo(Game.flags[creep.memory.birthRoom + '.BuildFrom']);
                var pathLen2 = creep.pos.getRangeTo(Game.flags[creep.memory.birthRoom + '.BuildFrom2']);
                if ((pathLen > 2 && pathLen < 20) || (pathLen2 > 2 && pathLen2 < 20)) {
                    
                    creep.moveTo(pathLen < pathLen2 ? Game.flags[creep.memory.birthRoom + '.BuildFrom'] : Game.flags[creep.memory.birthRoom + '.BuildFrom2']);    
                    creep.memory.state = 'staging';
                }
                else {
                    creep.memory.state = 'building';
                }
            }
        }
        
        if (creep.memory.state === 'building') {
    	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
    	    }
    	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
    	        creep.memory.building = true;
    	        creep.memory.state = 'staging';
    	        creep.say('🚧 build');
    	    }
    
    	    if(creep.memory.building) {
    	        let rampart = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.structureType === STRUCTURE_RAMPART && s.hits < 10000 && creep.pos.getRangeTo(s) < 10
                    });
                    
                if (rampart) {
                    console.log('repairing rampart');
                    var status = creep.repair(rampart);
                    if (status === ERR_NOT_IN_RANGE) {
                        creep.moveTo(rampart,  {visualizePathStyle: {stroke: '#ffaa00'}});
                    }  
                    return;
                }
    	        
    	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_RAMPART;
                    }
                });
                if (targets.length === 0) {
        	        targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                }
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else {
                    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType === STRUCTURE_RAMPART) && (s.hits < 1000)
                    });
                    
                    if (!target) {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (s) => (s.structureType === STRUCTURE_RAMPART) && (s.hits < 10000)
                        });
                    }
                    
                    if (!target) {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (s) => (s.structureType === STRUCTURE_RAMPART) && (s.hits < 100000)
                        });
                    }                    
                    
                    if (target) {
                        var status = creep.repair(target);
                        if (status === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target,  {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                    else {
                        creep.moveTo(Game.flags[creep.memory.birthRoom + '.Standby']);
                    }
                }
    	    }
    	    else {
    	        
    	       let sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && 
                                structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
                
                if (sources.length > 0) {
     	            if (creep.withdraw(sources[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
                else {
        	        let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
    	    }
        }
	}
};

module.exports = roleBuilder;