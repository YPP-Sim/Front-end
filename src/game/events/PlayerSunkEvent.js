import SocketEvent from "./SocketEvent";

class PlayerSunkEvent extends SocketEvent {
  constructor() {
    super("playerSunk");
  }

  onEvent(game, socket, data) {
    game.setDamageUIPercent(0);
    game.setBilgeUIPercent(0);
  }
}

export default PlayerSunkEvent;
