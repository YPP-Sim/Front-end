class SocketEvent {
  /**
   *
   * @param {string} eventName
   */
  constructor(eventName) {
    this.eventName = eventName;
  }

  onEvent(game, socket, eventData) {}
}

module.exports = SocketEvent;
