import SocketEvent from "./SocketEvent";

class UpdateSelectedTokenEvent extends SocketEvent {
  constructor() {
    super("updateSelectedToken");
  }

  onEvent(game, socket, selectedToken) {
    game.setSelectedToken(selectedToken);
  }
}
export default UpdateSelectedTokenEvent;
