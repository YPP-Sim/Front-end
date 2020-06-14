import ShipType from "./ShipType";

class SocketController {
  constructor(socket, game) {
    this.game = game;
    this.socket = socket;
  }

  registerEvents() {
    const socket = this.socket;
    socket.on("gameTurn", (data) => {
      console.log("Game turn: ", data);
    });

    socket.on("gameTick", (tick) => {
      console.log("Game tick: ", tick);
      this.game.currentGameTick = tick;

      const setMaskPosition = this.game.setMaskPosition;
      if (setMaskPosition) setMaskPosition(tick);
    });

    socket.on("message", (e) => {
      console.log("Received message from server: ", e);
    });

    socket.on("shipPositionChange", (data) => {
      const { shipId, boardX, boardY, orientation } = data;
      const ship = this.game.getShip(shipId);
      ship.setPosition(boardX, boardY);
      ship.setOrientation(orientation);
    });

    socket.on("moveShip", (data) => {
      console.log("MOVE DATA: ", data);
      const { shipId, moveType } = data;

      const ship = this.game.getShip(shipId);

      if (!ship) {
        console.error(
          "Server sent movement type for ship with id: " +
            shipId +
            ", but there is no ship with that Id"
        );
        return;
      }

      const move = moveType.toUpperCase();

      switch (move) {
        case "LEFT":
          ship.moveLeft();
          break;
        case "RIGHT":
          ship.moveRight();
          break;
        case "FORWARD":
          ship.moveForward();
          break;

        default:
          console.log("Unknown movement type: " + move);
          break;
      }
    });

    socket.on("addShip", (data) => {
      const { shipId, type, boardX, boardY, orientation } = JSON.parse(data);
      console.log("Adding ship with id: " + shipId);
      this.game.addShip(
        shipId,
        ShipType[type],
        parseInt(boardX),
        parseInt(boardY),
        orientation
      );
    });
  }

  unregisterEvents() {
    const socket = this.socket;

    socket.off("test");
    socket.off("message");
    socket.off("shipPositionChange");
    socket.off("addShip");
  }
}

export default SocketController;
