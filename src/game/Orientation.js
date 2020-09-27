const ORIENTATIONS = {
  NORTH: {
    name: "NORTH",
    xDir: 0,
    yDir: -1,
    left: {
      x: -1,
      y: 0,
      angleOffset: 4,
      orientation: "WEST",
    },
    right: {
      x: 1,
      y: 0,
      angleOffset: 2,
      orientation: "EAST",
    },
    angleOffset: 3,
  },
  SOUTH: {
    name: "SOUTH",
    xDir: 0,
    yDir: 1,
    left: {
      x: 1,
      y: 0,
      angleOffset: 6,
      orientation: "EAST",
    },
    right: {
      x: -1,
      y: 0,
      angleOffset: 4,
      orientation: "WEST",
    },
    angleOffset: 5,
  },
  WEST: {
    name: "WEST",
    xDir: -1,
    yDir: 0,
    left: {
      x: 0,
      y: 1,
      angleOffset: 3,
      orientation: "SOUTH",
    },
    right: {
      x: 0,
      y: -1,
      angleOffset: 1,
      orientation: "NORTH",
    },
    angleOffset: 2,
  },
  EAST: {
    name: "EAST",
    xDir: 1,
    yDir: 0,
    left: {
      x: 0,
      y: -1,
      angleOffset: 5,
      orientation: "NORTH",
    },
    right: {
      x: 0,
      y: 1,
      angleOffset: 3,
      orientation: "SOUTH",
    },
    angleOffset: 4,
  },
};
export default ORIENTATIONS;

export function getOrientationByName(name) {
  switch (name) {
    case "NORTH":
      return ORIENTATIONS.NORTH;
    case "SOUTH":
      return ORIENTATIONS.SOUTH;
    case "WEST":
      return ORIENTATIONS.WEST;
    case "EAST":
      return ORIENTATIONS.EAST;
  }
}
