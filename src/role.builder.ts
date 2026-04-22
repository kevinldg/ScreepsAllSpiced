export const roleBuilder = {
  run(creep: Creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
    }

    if (creep.memory.building) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

      if (targets.length > 0) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#FF8C00" } });
        }
      }
      creep.say("🏗️");
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
