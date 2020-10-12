import SocketEvent from "./SocketEvent";

class PlayerLeaveEvent extends SocketEvent {
  constructor() {
    super("playerLeave");
  }

  onEvent(game, socket, { playerName }) {
    game.removeShip(playerName);
  }
}
export default PlayerLeaveEvent;
