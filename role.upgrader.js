var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'staging';
        }
        if (creep.memory.state === 'staging') {
            var pathLen = creep.pos.getRangeTo(Game.flags.UpgradeFrom);
            if (pathLen > 2) {
                creep.moveTo(Game.flags.UpgradeFrom);    
                creep.memory.state = 'staging';
            }
            else {
                creep.memory.state = 'upgrading';
            }
        }
        
	    if(creep.memory.state === 'harvesting') {
	        if (creep.store.getFreeCapacity() === 0) {
	            creep.memory.state = 'staging';
	        }
	        else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
	        }
        }
        
        if (creep.memory.state === 'upgrading') {
	        if (creep.store[RESOURCE_ENERGY] === 0) {
	            creep.memory.state = 'harvesting';
	        }
	        else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
	        }
        }
	}
};

module.exports = roleUpgrader;