export const roleRepairer = {
  run(creep: Creep) {
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
      creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
      });
      targets.sort((a, b) => a.hits - b.hits);

      if (targets.length > 0) {
        if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#FF8C00" } });
        }
      }
      creep.say("🛠️");
      return;
    }

    const energyTargets = creep.room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
    });

    if (energyTargets.length > 0) {
      if (creep.withdraw(energyTargets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(energyTargets[0], { visualizePathStyle: { stroke: "#FF8C00" } });
      }
      creep.say("🔄");
      return;
    }
  }
};
