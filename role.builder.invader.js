var roleBuilderInvader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'invaderflag';
        }
        
        if (creep.memory.state === 'invaderflag') {
            creep.moveTo(Game.flags.InvasionFlag);
            
            if (creep.room !== Game.spawns['FraggsHouse'].room) {
                creep.memory.state = 'building';
            }
            
        }
        
        if (creep.memory.state === 'building') {
    	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
    	    }
    	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
    	        creep.memory.building = true;
    	        creep.say('🚧 build');
    	    }
    
    	    if(creep.memory.building) {
    	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else {
                    creep.moveTo(Game.flags.DefendersFlag);
                }
    	    }
    	    else {
    	        var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
    	    }
        }
	}
};

module.exports = roleBuilderInvader;