const SocketEvent = require("./SocketEvent");

class GameFinishedEvent extends SocketEvent {
  constructor() {
    super("gameFinished");
  }

  onEvent(game, socket, eventData) {
    console.log("Game finished with eventData: ", eventData);
  }
}
export default GameFinishedEvent;
