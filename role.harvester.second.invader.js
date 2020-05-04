var roleHarvesterInvader = {
    
    suicideIfLowTicks: function(creep) {
        if (creep.ticksToLive <= 90 && creep.store[RESOURCE_ENERGY] === 0) {
            creep.suicide();
            return true;
        }
        return false;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.state) {
            creep.memory.state = 'invasionflag';
        }
        
        if (creep.memory.state === 'invasionflag') {
            if (this.suicideIfLowTicks(creep)) {
                return;
            }
            if (creep.room !== Game.spawns.FraggsHouse.room) {
                creep.memory.firstRoomName = creep.room.name;
                creep.memory.state = 'secondroomflag';
            }
            else {
                creep.moveTo(Game.flags.InvasionFlag);
            }
        }
        
        if (creep.memory.state === 'secondroomflag') {
            if (this.suicideIfLowTicks(creep)) {
                return;
            }
            if (creep.room.name !== creep.memory.firstRoomName) {
                creep.memory.state = 'steal';
            }
            else {
                creep.moveTo(Game.flags.SecondRoomInvasionFlag);
            }
        }
        
        
        if (creep.memory.state === 'steal') {
            if (this.suicideIfLowTicks(creep)) {
                return;
            }

            if(creep.store.getFreeCapacity() === 0) {
                creep.memory.state = 'returnhomeflag';
            }
            else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        
        if (creep.memory.state === 'returnhomeflag') {
            if (creep.room.name === creep.memory.firstRoomName) {
                creep.memory.state = 'energystealerflag';
            }
            else {
                creep.moveTo(Game.flags.SecondRoomHomeFlag);
            }            
        }
        
        if (creep.memory.state === 'energystealerflag') {
            if (creep.room === Game.spawns.FraggsHouse.room) {
                creep.memory.state = 'deposit';
            }

            if (creep.pos.getRangeTo(Game.flags.EnergyStealerFlag) > 0) {
                creep.moveTo(Game.flags.EnergyStealerFlag);
            }
        }
        
        if (creep.memory.state === 'deposit') {
            var target;
            
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = 'invasionflag';
            }

            if (!target) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_STORAGE ||
                                    structure.structureType == STRUCTURE_TOWER) && 
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                
                if(targets.length > 0) {
                    target = targets[0];
                }
            }
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                creep.moveTo(Game.flags.Harvesters);
            }
        }
	}
};

module.exports = roleHarvesterInvader;