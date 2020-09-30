import Game from "./Game";
import UpdatePointsEvent from "./events/UpdatePointsEvent";
import GameTimeEvent from "./events/GameTimeEvent";
import PlayMoveEvent from "./events/PlayMoveEvent";
import UpdateTokensEvent from "./events/UpdateTokensEvent";
import UpdateAutoSelectEvent from "./events/UpdateAutoSelect";
import UpdateSelectedTokenEvent from "./events/UpdateSelectedTokenEvent";
import GameTickEvent from "./events/GameTickEvent";
import MessageEvent from "./events/MessageEvent";
import UpdateShipStatsEvent from "./events/UpdateShipStatsEvent";
import UpdatePlayerActionsEvent from "./events/UpdatePlayerActionsEvent";
import ShipPositionChangeEvent from "./events/ShipPositionChangeEvent";
import ClearShipsEvent from "./events/ClearShipsEvent";
import AddShipEvent from "./events/AddShipEvent";
import GameFinishedEvent from "./events/GameFinishedEvent";
import PlayerSunkEvent from "./events/PlayerSunkEvent";
class SocketController {
  /**
   *
   * @param {*} socket
   * @param {Game} game
   */
  constructor(socket, game) {
    this.game = game;
    this.socket = socket;
    this.events = [];

    this.init();
  }

  init() {
    this.events.push(new UpdatePointsEvent());
    this.events.push(new GameTimeEvent());
    this.events.push(new PlayMoveEvent());
    this.events.push(new UpdateTokensEvent());
    this.events.push(new UpdateAutoSelectEvent());
    this.events.push(new UpdateSelectedTokenEvent());
    this.events.push(new GameTickEvent());
    this.events.push(new MessageEvent());
    this.events.push(new UpdateShipStatsEvent());
    this.events.push(new UpdatePlayerActionsEvent());
    this.events.push(new ShipPositionChangeEvent());
    this.events.push(new ClearShipsEvent());
    this.events.push(new AddShipEvent());
    this.events.push(new GameFinishedEvent());
    this.events.push(new PlayerSunkEvent());
  }

  registerEvents() {
    const socket = this.socket;

    for (let event of this.events) {
      socket.on(event.eventName, (eventObj) => {
        event.onEvent(this.game, socket, eventObj);
      });
    }
    // Special async event
    socket.on("gameTurn", async (turnData) => {
      socket.emit("requestShipStats", {
        playerName: this.game.gameData.thisPlayer.playerName,
        gameId: this.game.gameId,
      });
      this.game.preventMovementInteraction = true;
      await this.game.executeGameTurns(turnData.playerMovements);
      this.game.updateShipPositions(turnData.playerData);
      this.game.updateFlags(turnData.flags);
    });
  }

  unregisterEvents() {
    this.socket.removeAllListeners();
  }
}

export default SocketController;
