import { moveToWithRoadPreference } from "./utils/movement";

export const roleClaim = {
  run(creep: Creep) {
    const flag = Game.flags.EXPAND;
    if (!flag) return;

    const room = flag.room;

    // 🔴 If room not visible yet → just go there
    if (!room) {
      moveToWithRoadPreference(creep, flag.pos, { stroke: "#00ff00" });
      return;
    }

    const controller = room.controller;
    if (!controller) return;

    // 👑 Claim logic
    if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
      moveToWithRoadPreference(creep, controller.pos, { stroke: "#00ff00" });
    }

    creep.say("👑");
  }
};
