import { moveToWithRoadPreference } from "./utils/movement";

export const roleCarrierStorage = {
  run(creep: Creep) {
    if (creep.store.getUsedCapacity() === 0) {
      creep.memory.collecting = true;
    }
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.collecting = false;
    }

    if (creep.memory.collecting) {
      creep.say("📦");

      const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource: Resource) => resource.resourceType === RESOURCE_ENERGY
      });

      const container = creep.room.find(FIND_STRUCTURES, {
        filter: (s: StructureContainer) =>
          s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      });

      const source = droppedEnergy[0] || container[0];

      if (source) {
        const result = source instanceof Resource ? creep.pickup(source) : creep.withdraw(source, RESOURCE_ENERGY);

        if (result === ERR_NOT_IN_RANGE) {
          moveToWithRoadPreference(creep, source.pos, { stroke: "#ffaa00" });
        }
      }

      return;
    }

    creep.say("🚚");

    const storage = creep.room.find(FIND_STRUCTURES, {
      filter: (s: StructureStorage) =>
        s.structureType === STRUCTURE_STORAGE && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];

    if (storage) {
      if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        moveToWithRoadPreference(creep, storage.pos, { stroke: "#ffaa00" });
      }
    }
  }
};
