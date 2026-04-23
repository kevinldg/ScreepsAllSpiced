export const moveToWithRoadPreference = (
  creep: Creep,
  target: RoomPosition | { pos: RoomPosition },
  visualizePathStyle?: PolyStyle
) => {
  return creep.moveTo(target, {
    visualizePathStyle: visualizePathStyle || { stroke: "#cccccc" },
    reusePath: 5
  });
};
