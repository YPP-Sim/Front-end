import SocketEvent from "./SocketEvent";

class UpdateTokensEvent extends SocketEvent {
  constructor() {
    super("updateTokens");
  }

  onEvent(game, socket, tokenData) {
    const { moves, cannons } = tokenData;
    if (moves) {
      game.setLeftTokens(moves.LEFT.amount);
      game.setForwardTokens(moves.FORWARD.amount);
      game.setRightTokens(moves.RIGHT.amount);
    }

    if (cannons) {
      if (cannons === -1) game.setCannonsAmount(0);
      else game.setCannonsAmount(cannons);
    }
  }
}
export default UpdateTokensEvent;
