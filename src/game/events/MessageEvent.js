const SocketEvent = require("./SocketEvent");

class MessageEvent extends SocketEvent {
  constructor() {
    super("message");
  }

  onEvent(game, socket, eventData) {
    console.log("Message from server: ", eventData);
  }
}
export default MessageEvent;
