export const structureTower = {
  run() {
    const towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });

    _.forEach(towers, function (tower: StructureTower) {
      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax
      });

      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }
    });
  }
};
