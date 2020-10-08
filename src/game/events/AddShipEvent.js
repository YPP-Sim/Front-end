import SocketEvent from "./SocketEvent";

class AddShipEvent extends SocketEvent {
  constructor() {
    super("addShip");
  }

  onEvent(game, socket, data) {
    const { shipId, type, boardX, boardY, orientation, side } = data;

    game.addShip(
      shipId,
      type,
      parseInt(boardX),
      parseInt(boardY),
      orientation,
      side
    );
  }
}
export default AddShipEvent;
