import { moveToWithRoadPreference } from "./utils/movement";

export const roleCombat = {
  run(creep: Creep) {
    // 1. Ziel finden (Invader oder Hostile Creeps)
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (target) {
      // 2. Ranged Attack zuerst (wenn möglich)
      if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
        moveToWithRoadPreference(creep, target.pos, { stroke: "#ff0000" });
      } else {
        // Wenn in Range → trotzdem bewegen für bessere Positionierung
        creep.rangedAttack(target);
      }

      // 3. Optional: Nahkampf
      creep.attack(target);

      creep.say("⚔️");
      return;
    }

    // 4. Falls kein Ziel: optional Controller-Position halten / patrouillieren
    const flag = Game.flags["RALLY"]; // optionaler Sammelpunkt
    if (flag) {
      if (!creep.pos.inRangeTo(flag.pos, 2)) {
        moveToWithRoadPreference(creep, flag.pos, { stroke: "#ff5555" });
      }
      creep.say("📍");
      return;
    }

    // 5. Idle fallback (zentraler Room-Punkt)
    const center = new RoomPosition(25, 25, creep.room.name);
    moveToWithRoadPreference(creep, center, { stroke: "#aa0000" });
    creep.say("😴");
  }
};
