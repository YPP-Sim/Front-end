class LobbySocketController {
  constructor(socket) {
    this.socket = socket;
  }

  registerEvents() {
    this.socket.on("gameError", (err) => {
      console.error("Received error message from socket: ", err);
    });

    this.socket.on("gameData", (gameData) => {
      console.log("Received some game data: ", gameData);
    });
  }

  registerEvent(eventName, fn) {
    this.socket.on(eventName, fn);
  }

  unregisterEvent(eventName) {
    this.socket.off(eventName);
  }

  unregisterEvents() {}
}

export default LobbySocketController;
