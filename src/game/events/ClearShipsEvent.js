import SocketEvent from "./SocketEvent";

class ClearShipsEvent extends SocketEvent {
  constructor() {
    super("clearShips");
  }

  onEvent(game, socket, eventData) {
    socket.emit("requestShipMoves", {
      playerName: game.gameData.thisPlayer.playerName,
      gameId: game.gameId,
    });
    game.clearActivityBars();
    if (game.clearUICannons) game.clearUICannons();
    if (game.playerMoves) game.playerMoves.clearCannons();

    game.preventMovementInteraction = false;
  }
}
export default ClearShipsEvent;
