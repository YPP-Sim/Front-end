import SocketEvent from "./SocketEvent";

class GameTickEvent extends SocketEvent {
  constructor() {
    super("gameTick");
  }

  onEvent(game, socket, tick) {
    game.currentGameTick = tick;

    const setMaskPosition = game.setMaskPosition;
    if (setMaskPosition) setMaskPosition(tick);
  }
}
export default GameTickEvent;
