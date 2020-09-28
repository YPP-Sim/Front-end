import SocketEvent from "./SocketEvent";

class PlayMoveEvent extends SocketEvent {
  constructor() {
    super("playMove");
  }

  onEvent(game, socket, moveData) {
    game.setClientMove(moveData.index, moveData.direction);
  }
}
export default PlayMoveEvent;
