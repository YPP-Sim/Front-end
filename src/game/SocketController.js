import ShipType from "./ShipType";

class SocketController {
  constructor(socket, game) {
    this.game = game;
    this.socket = socket;
  }

  registerEvents() {
    const socket = this.socket;
    socket.on("test", (e) => {
      console.log("Hey!", e);
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

    socket.on("addShip", (data) => {
      console.log("Incomming data: ", data);
      const { shipId, type, boardX, boardY, orientation } = JSON.parse(data);
      console.log("Adding ship with id: " + shipId);
      this.game.addShip(shipId, ShipType[type], boardX, boardY, orientation);
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
