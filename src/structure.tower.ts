export const structureTower = {
  run() {
    const towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });

    _.forEach(towers, function (tower: StructureTower) {
      const closestEnemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestEnemy) {
        tower.attack(closestEnemy);
        return;
      }

      const damagedStructures = tower.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_RAMPART || structure.structureType === STRUCTURE_WALL) &&
            structure.hits < structure.hitsMax
          );
        }
      });

      if (damagedStructures.length > 0) {
        const closestDamaged = tower.pos.findClosestByRange(damagedStructures);
        if (closestDamaged) {
          tower.repair(closestDamaged);
        }
      }
    });
  }
};
