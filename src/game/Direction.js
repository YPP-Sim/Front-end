const directions = {
  NONE: {
    name: null,
    leftNext: "LEFT",
    rightNext: "RIGHT",
  },
  LEFT: {
    name: "LEFT",
    leftNext: "FORWARD",
    rightNext: "NONE",
  },
  FORWARD: {
    name: "FORWARD",
    leftNext: "RIGHT",
    rightNext: "LEFT",
  },
  RIGHT: {
    name: "RIGHT",
    leftNext: "NONE",
    rightNext: "FORWARD",
  },
  STALL: {
    name: "STALL",
  },
};

export default directions;
