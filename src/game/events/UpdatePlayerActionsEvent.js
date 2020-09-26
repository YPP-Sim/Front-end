const SocketEvent = require("./SocketEvent");

class UpdatePlayerActionsEvent extends SocketEvent {
  constructor() {
    super("updatePlayerActions");
  }

  onEvent(game, socket, { playerName, turnAmount }) {
    const ship = game.getShip(playerName);
    if (!ship) {
      console.error(
        "Player making moves but does not have a ship on the board."
      );
      return;
    }
    ship.setBarMovements(turnAmount);
  }
}
export default UpdatePlayerActionsEvent;
