const ORIENTATIONS = {
  NORTH: {
    name: "NORTH",
    xDir: 0,
    yDir: -1,
    left: {
      x: -1,
      y: 0,
      angleOffset: 4,
    },
    right: {
      x: 1,
      y: 0,
      angleOffset: 2,
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
    },
    right: {
      x: -1,
      y: 0,
      angleOffset: 4,
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
    },
    right: {
      x: 0,
      y: -1,
      angleOffset: 1,
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
    },
    right: {
      x: 0,
      y: 1,
      angleOffset: 3,
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
