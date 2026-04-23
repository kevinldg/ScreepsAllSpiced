export const roleCarrier = {
  run(creep: Creep) {
    if (creep.store.getUsedCapacity() === 0) {
      creep.memory.collecting = true;
    }
    if (creep.store.getFreeCapacity() === 0) {
      creep.memory.collecting = false;
    }

    if (creep.memory.collecting) {
      creep.say("📦");

      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: r => r.resourceType === RESOURCE_ENERGY
      });

      if (droppedEnergy) {
        if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: "#1E90FF" } });
        }
        return;
      }

      const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (s: AnyStructure) =>
          s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
      }) ;

      const container = creep.pos.findClosestByPath(containers);

      if (container) {
        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(container, { visualizePathStyle: { stroke: "#1E90FF" } });
        }
      }

      return;
    }

    creep.say("🚚");

    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure: AnyStructure) =>
        (structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_EXTENSION) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#1E90FF" } });
      }
    }
  }
};
