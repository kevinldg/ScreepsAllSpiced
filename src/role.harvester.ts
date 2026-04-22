export const roleHarvester = {
  run(creep: Creep) {
    const sourceId = creep.memory.sourceId;
    if (!sourceId) return;

    const source = Game.getObjectById(sourceId) as Source;
    if (!source) return;

    const container = source.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER
    }) as StructureContainer;

    if (!container) return;

    if (!creep.pos.isEqualTo(container.pos)) {
      creep.moveTo(container.pos, { visualizePathStyle: { stroke: "#ffaa00" } });
      return;
    }

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }

    if (creep.store.getFreeCapacity() === 0 && container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      creep.transfer(container, RESOURCE_ENERGY);
    }
  }
};
