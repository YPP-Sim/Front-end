import SocketEvent from "./SocketEvent";

class UpdateAutoSelectEvent extends SocketEvent {
  constructor() {
    super("updateAutoSelect");
  }

  onEvent(game, socket, autoSelectBool) {
    game.setAutoSelectTexture(autoSelectBool);
  }
}
export default UpdateAutoSelectEvent;
