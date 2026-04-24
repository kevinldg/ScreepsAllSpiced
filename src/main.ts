import _ from "lodash";
import { roleBuilder } from "./role.builder";
import { roleCarrierSpawn } from "./roleCarrierSpawn";
import { roleCarrierStorage } from "./role.carrierStorage";
import { roleClaim } from "./role.claim";
import { roleCombat } from "./role.combat";
import { roleContainerCarer } from "./role.containerCarer";
import { roleHarvester } from "./role.harvester";
import { roleMinimalUpgrader } from "./role.minimalUpgrader";
import { roleRepairer } from "./role.repairer";
import { roleUpgrader } from "./role.upgrader";
import { roleMinimalHarvester } from "./role.minimalHarvester";
import { roleMinimalBuilder } from "./role.minimalBuilder";

declare global {
  interface RoomMemory {
    [name: string]: any;
    stage: "BUILD_SPAWN" | "SPAWNING_ECONOMY" | "ONLINE";
  }
  interface CreepMemory {
    role: string;
    roomName: string;
    sourceId: string | undefined;
    [name: string]: any;
  }
  interface FlagMemory {
    [name: string]: any;
  }
  interface SpawnMemory {
    [name: string]: any;
  }
}

const ROOM_CONFIG: { [roomName: string]: { role: string; limit: number; body: BodyPartConstant[] }[] } = {
  W5N8: [
    { role: "harvester", limit: 2, body: [WORK, WORK, WORK, WORK, WORK, MOVE] },
    { role: "carrierSpawn", limit: 2, body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] },
    { role: "carrierStorage", limit: 1, body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] },
    { role: "repairer", limit: 1, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { role: "containerCarer", limit: 1, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { role: "upgrader", limit: 1, body: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE] },
    { role: "builder", limit: 1, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { role: "combat", limit: 1, body: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE] },
    { role: "claim", limit: 0, body: [CLAIM, MOVE] }
  ],
  W4N8: [
    { role: "minimalUpgrader", limit: 4, body: [WORK, CARRY, MOVE] },
    { role: "minimalHarvester", limit: 4, body: [WORK, CARRY, MOVE] }
  ]
};

export const loop = () => {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory: " + name);
    }
  }

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];

    if (!room.controller?.my) continue;

    const config = ROOM_CONFIG[roomName];
    if (!config) {
      console.log(`⚠️ Keine Config für Room: ${roomName}`);
      continue;
    }

    const spawns = room.find(FIND_MY_SPAWNS);
    if (spawns.length === 0) continue;
    const spawn = spawns[0];

    for (const roleConfig of config) {
      const creeps = _.filter(
        Game.creeps,
        creep => creep.memory.role === roleConfig.role && creep.memory.roomName === roomName
      );

      if (creeps.length < roleConfig.limit) {
        const name = `${roomName}_${roleConfig.role.charAt(0).toUpperCase()}${roleConfig.role.slice(1)}_${Game.time}`;

        let sourceId: string | undefined;
        if (roleConfig.role === "harvester") {
          const sources = room.find(FIND_SOURCES);
          sourceId = sources.find(source => {
            const count = _.filter(
              Game.creeps,
              creep => creep.memory.sourceId === source.id && creep.memory.roomName === roomName
            ).length;
            return count === 0;
          })?.id;
        }

        spawn.spawnCreep(roleConfig.body, name, {
          memory: {
            role: roleConfig.role,
            roomName,
            sourceId
          }
        });
      }
    }
  }

  const ROLES: { [key: string]: { run(creep: Creep): void } } = {
    harvester: roleHarvester,
    minimalHarvester: roleMinimalHarvester,
    carrierSpawn: roleCarrierSpawn,
    carrierStorage: roleCarrierStorage,
    repairer: roleRepairer,
    containerCarer: roleContainerCarer,
    upgrader: roleUpgrader,
    minimalUpgrader: roleMinimalUpgrader,
    builder: roleBuilder,
    minimalBuilder: roleMinimalBuilder,
    combat: roleCombat,
    claim: roleClaim
  };

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    const role = ROLES[creep.memory.role];

    if (role) {
      role.run(creep);
    } else {
      console.log(`⚠️ Unknown role: ${creep.memory.role} (${creep.name})`);
    }
  }
};
