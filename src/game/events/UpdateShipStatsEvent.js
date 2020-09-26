const SocketEvent = require("./SocketEvent");

class UpdateShipStatsEvent extends SocketEvent {
  constructor() {
    super("updateShipStats");
  }

  onEvent(game, socket, shipStats) {
    const { bilge, damage } = shipStats;
    if (damage) game.setDamageUIPercent(damage);
    if (bilge) game.setBilgeUIPercent(bilge);
  }
}
export default UpdateShipStatsEvent;
