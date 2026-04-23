export const roleHarvester = {
  run(creep: Creep) {
    const sourceId = creep.memory.sourceId;
    if (!sourceId) return;

    const source = Game.getObjectById(sourceId) as Source;
    if (!source) return;

    let primaryContainer = source.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_STORAGE
    }) as StructureStorage;

    if (!primaryContainer) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      primaryContainer = source.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER
      }) as StructureContainer;
    }

    if (!creep.pos.isEqualTo(primaryContainer.pos)) {
      creep.moveTo(primaryContainer.pos, { visualizePathStyle: { stroke: "#ffaa00" } });
      return;
    }

    if (creep.store.getFreeCapacity() === 0) {
      if (primaryContainer.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const overflowContainers = primaryContainer.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s => s.structureType === STRUCTURE_CONTAINER && !s.pos.isEqualTo(primaryContainer.pos)
        }) as StructureContainer[];

        const bestContainer = overflowContainers.sort(
          (a, b) => b.store.getFreeCapacity(RESOURCE_ENERGY) - a.store.getFreeCapacity(RESOURCE_ENERGY)
        )[0];

        if (bestContainer) {
          creep.transfer(bestContainer, RESOURCE_ENERGY);
          return;
        }
      } else {
        creep.transfer(primaryContainer, RESOURCE_ENERGY);
        return;
      }
    }

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
      return;
    }
  }
};
