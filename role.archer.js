module.exports = {
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if (!creep.memory.deployTargetId) {
            let ramparts = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_RAMPART;
                    }
            });
            
            let potentialRamparts = [];
            
            for(let i = 0; i < ramparts.length; i++) {
                let rampart = ramparts[i];
                let found = false;
                for(let name in Game.creeps) {
                    let archer = Game.creeps[name];
                    if (archer.memory.role == 'archer') {
                        if (archer.memory.deployTargetId === rampart.id) {
                            found = true;
                            break;
                        }
                    }
                }
                
                if (!found) {
                    potentialRamparts.push(rampart);
                    if (!target) {
                        creep.memory.deployTargetId = potentialRamparts[i].id;
                    }
                }
            }
            
            if (target) {
                let closestBattleRampart;
                let closestBattleDistance = 99999999;
                for(let i = 0; i < potentialRamparts.length; i++) {
                    let distance =potentialRamparts[i].pos.getRangeTo(target)
                    if (distance < closestBattleDistance) {
                        closestBattleRampart = potentialRamparts[i];
                        closestBattleDistance = distance;
                    }
                }
                
                if (closestBattleRampart) {
                    creep.memory.deployTargetId = closestBattleRampart.id;
                }
            }
            
            if (!creep.memory.deployTargetId) {
                creep.moveTo(Game.flags.ArcherRally);
            }
        }
        else {
            if (Game.getObjectById(creep.memory.deployTargetId) !== null) {
                if (target || (creep.pos.x > 5 && creep.pos.y < 45)) {
                    creep.moveTo(Game.getObjectById(creep.memory.deployTargetId));
                }
                else {
                    creep.moveTo(Game.flags.ArcherRally);
                }
            }
            else {
                creep.memory.deployTargetId = undefined;
            }
        }
        
        
        if (target) {
            let status = creep.rangedAttack(target);
        }
    }
};