import SocketEvent from "./SocketEvent";
import { organizeGameData } from "../../components/GameLobby/GameLobby";
class UpdateGameDataEvent extends SocketEvent {
  constructor() {
    super("updateGameData");
  }

  onEvent(game, socket, data) {
    const playerName = game.getThisPlayer().playerName;
    const organizedData = organizeGameData(data, playerName);
    game.updateGameData(organizedData);
    game.updateTeamColors();
  }
}
export default UpdateGameDataEvent;
