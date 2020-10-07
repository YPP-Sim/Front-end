import SocketEvent from "./SocketEvent";

class RequestShipConfigEvent extends SocketEvent {
  constructor() {
    super("requestShipConfig");
  }

  onEvent(game, socket, data) {
    game.setShipConfigView(data.set);
  }
}
export default RequestShipConfigEvent;
