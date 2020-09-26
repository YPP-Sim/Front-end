const SocketEvent = require("./SocketEvent");

class GameTimeEvent extends SocketEvent {
  constructor() {
    super("gameTime");
  }

  onEvent(game, socket, time) {
    if (game.updateTimeNumber) game.updateTimeNumber(time);
  }
}

export default GameTimeEvent;
