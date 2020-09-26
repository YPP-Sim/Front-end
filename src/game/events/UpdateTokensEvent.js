const SocketEvent = require("./SocketEvent");

class UpdateTokensEvent extends SocketEvent {
  constructor() {
    super("updateTokens");
  }

  onEvent(game, socket, tokenData) {
    const { moves, cannons } = tokenData;
    if (moves) {
      game.setLeftTokens(moves.LEFT);
      game.setForwardTokens(moves.FORWARD);
      game.setRightTokens(moves.RIGHT);
    }

    if (cannons) {
      if (cannons === -1) game.setCannonsAmount(0);
      else game.setCannonsAmount(cannons);
    }
  }
}
export default UpdateTokensEvent;
