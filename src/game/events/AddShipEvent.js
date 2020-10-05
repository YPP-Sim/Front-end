import SocketEvent from "./SocketEvent";

class AddShipEvent extends SocketEvent {
  constructor() {
    super("addShip");
  }

  onEvent(game, socket, data) {
    console.log("data: ", data);
    const { shipId, type, boardX, boardY, orientation, side } = data;
    console.log("Adding ship with id: " + shipId);

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
