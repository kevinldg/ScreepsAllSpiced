export const structureTower = {
  run() {
    const towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });

    _.forEach(towers, function (tower: StructureTower) {
      const closestEnemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestEnemy) {
        tower.attack(closestEnemy);
      }
    });
  }
};
