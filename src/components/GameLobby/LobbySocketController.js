class LobbySocketController {
  constructor(socket) {
    this.socket = socket;
  }

  registerEvents() {
    this.socket.on("gameError", (err) => {
      console.error("Received error message from socket: ", err);
    });
  }

  registerEvent(eventName, fn) {
    this.socket.on(eventName, fn);
  }

  unregisterEvent(eventName) {
    this.socket.off(eventName);
  }

  unregisterEvents() {
    this.socket.removeAllListeners();
  }
}

export default LobbySocketController;
