import { moveToWithRoadPreference } from "./utils/movement";

export const roleHarvester = {
  run(creep: Creep) {
    const sourceId = creep.memory.sourceId;
    if (!sourceId) return;

    const source = Game.getObjectById(sourceId) as Source;
    if (!source) return;

    const primaryContainer = source.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER
    }) as StructureContainer;

    if (!primaryContainer) return;

    if (!creep.pos.isEqualTo(primaryContainer.pos)) {
      moveToWithRoadPreference(creep, primaryContainer.pos, { stroke: "#ffaa00" });
      return;
    }

    if (creep.store.getFreeCapacity() === 0) {
      if (primaryContainer.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const overflowContainer = primaryContainer.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s => s.structureType === STRUCTURE_CONTAINER && !s.pos.isEqualTo(primaryContainer.pos)
        }) as StructureContainer[];

        if (overflowContainer) {
          creep.transfer(overflowContainer[0], RESOURCE_ENERGY);
          return;
        }
      } else {
        creep.transfer(primaryContainer, RESOURCE_ENERGY);
        return;
      }
    }

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      moveToWithRoadPreference(creep, source.pos, { stroke: "#ffaa00" });
      return;
    }
  }
};
