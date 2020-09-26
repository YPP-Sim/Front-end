import { getOrientationByName } from "../Orientation";

const SocketEvent = require("./SocketEvent");

class ShipPositionChangeEvent extends SocketEvent {
  constructor() {
    super("shipPositionChange");
  }

  onEvent(game, socket, data) {
    const { shipId, boardX, boardY, orientation } = data;
    const ship = game.getShip(shipId);

    ship.sprite.texture = ship.movementTexture;
    ship.setPosition(boardX, boardY);
    ship.setOrientation(getOrientationByName(orientation));
  }
}
export default ShipPositionChangeEvent;
