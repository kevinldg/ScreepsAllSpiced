import { moveToWithRoadPreference } from "./utils/movement";

export const roleUpgrader = {
  run(creep: Creep) {

    if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.upgrading = false;
    }
    if(!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true;
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
        // creep.moveTo(creep.room.controller as StructureController, { visualizePathStyle: { stroke: "#ffffff" } });
        moveToWithRoadPreference(creep, (creep.room.controller as StructureController).pos, { stroke: "#ffaa00" });
      }
      creep.say("⬆️");
    } else {
      const energyTargets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0
      });
      if (energyTargets.length > 0) {
        if (creep.withdraw(energyTargets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          // creep.moveTo(energyTargets[0], { visualizePathStyle: { stroke: "#FF8C00" } });
          moveToWithRoadPreference(creep, energyTargets[0].pos, { stroke: "#ffaa00" });
        }
        creep.say("🔄");
        return;
      }
    }
  }
};
