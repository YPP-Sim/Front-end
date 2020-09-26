import ShipType from "../ShipType";
const SocketEvent = require("./SocketEvent");

class AddShipEvent extends SocketEvent {
  constructor() {
    super("addShip");
  }

  onEvent(game, socket, data) {
    const { shipId, type, boardX, boardY, orientation, side } = JSON.parse(
      data
    );
    console.log("Adding ship with id: " + shipId);

    game.addShip(
      shipId,
      ShipType[type],
      parseInt(boardX),
      parseInt(boardY),
      orientation,
      side
    );
  }
}
export default AddShipEvent;
