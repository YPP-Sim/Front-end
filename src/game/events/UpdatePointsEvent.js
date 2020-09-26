const SocketEvent = require("./SocketEvent");

class UpdatePointsEvent extends SocketEvent {
  constructor() {
    super("updatePoints");
  }

  onEvent(game, socket, scores) {
    if (scores.attackerScore) game.setAttackerScore(scores.attackerScore);
    if (scores.defenderScore) game.setDefenderScore(scores.defenderScore);
  }
}

export default UpdatePointsEvent;
