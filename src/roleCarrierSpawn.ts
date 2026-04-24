import { moveToWithRoadPreference } from "./utils/movement";

export const roleCarrierSpawn = {
  run(creep: Creep) {
    if (creep.store.getUsedCapacity() === 0) {
      creep.memory.collecting = true;
    }
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.collecting = false;
    }

    if (creep.memory.collecting) {
      creep.say("📦");

      const storage = creep.room.find(FIND_STRUCTURES, {
        filter: (s: StructureStorage) =>
          s.structureType === STRUCTURE_STORAGE && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      })[0];

      if (storage) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          moveToWithRoadPreference(creep, storage.pos, { stroke: "#ffaa00" });
        }
      }

      return;
    }

    creep.say("🚚");

    const spawn = creep.room.find(FIND_STRUCTURES, {
      filter: (s: StructureSpawn) => s.structureType === STRUCTURE_SPAWN && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];

    const extensions = creep.room.find(FIND_STRUCTURES, {
      filter: (s: StructureExtension) =>
        s.structureType === STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];

    const target = spawn || extensions;

    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        moveToWithRoadPreference(creep, target.pos, { stroke: "#ffaa00" });
      }
    }
  }
};
