export const roleClaim = {
  run(creep: Creep) {
    const flag = Game.flags.EXPAND;
    if (!flag) return;

    const controller = flag.pos.roomName ? Game.rooms[flag.pos.roomName]?.controller : undefined;

    if (!controller || !Game.rooms[flag.pos.roomName]) {
      creep.moveTo(flag, { visualizePathStyle: { stroke: "#00ff00" } });
      return;
    }

    if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller, { visualizePathStyle: { stroke: "#00ff00" } });
      return;
    }

    creep.say("👑");
  }
};
