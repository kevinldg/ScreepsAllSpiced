import _ from "lodash";
import { roleBuilder } from "./role.builder";
import { roleHarvester } from "./role.harvester";
import { roleRepairer } from "./role.repairer";
import { roleUpgrader } from "./role.upgrader";
import { roleCarrier } from "./role.carrier";

declare global {
  interface RoomMemory {
    [name: string]: any;
  }
  interface CreepMemory {
    role: string;
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

export const loop = () => {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory: " + name);
    }
  }

  const CREEP_CONFIG = [
    { role: "harvester", limit: 2, body: [WORK, WORK, WORK, WORK, CARRY, MOVE] },
    { role: "carrier", limit: 3, body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] },
    { role: "upgrader", limit: 1, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { role: "repairer", limit: 2, body: [WORK, CARRY, CARRY, MOVE, MOVE] },
    { role: "builder", limit: 1, body: [WORK, WORK, CARRY, CARRY, MOVE] }
  ];

  for (const config of CREEP_CONFIG) {
    const creeps = _.filter(Game.creeps, creep => creep.memory.role === config.role);
    const spawn = Game.spawns.Spawn1;

    if (creeps.length < config.limit) {
      const name = `${config.role.charAt(0).toUpperCase()}${config.role.slice(1)}${Game.time}`;
      if (spawn) {
        let sourceId: string | undefined;
        if (config.role === "harvester") {
          const sources = spawn.room.find(FIND_SOURCES);
          const assignedHarvesters = _.filter(Game.creeps, creep => creep.memory.role === "harvester");

          sourceId = sources.find(source => {
            const count = _.filter(assignedHarvesters, creep => creep.memory.sourceId === source.id).length;
            return count === 0;
          })?.id;
        }

        spawn.spawnCreep(config.body, name, { memory: { role: config.role, sourceId } });
      }
    }
  }

  const ROLES: { [key: string]: { run(creep: Creep): void } } = {
    harvester: roleHarvester,
    carrier: roleCarrier,
    upgrader: roleUpgrader,
    repairer: roleRepairer,
    builder: roleBuilder
  };

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    ROLES[creep.memory.role].run(creep);
  }
};
