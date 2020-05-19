class ShipData {
  /**
   * @param {number} maxGuns      The maximum number of guns the ship can have
   * @param {boolean} stallToken  States if the ship has a stall token (3 movement and 1 stall)
   */
  constructor(maxGuns, stallToken, mapX, mapY) {
    this.mapX = mapX;
    this.mapY = mapY;

    this.bilge = 0;
    this.damage = 0;
    this.movementTokens = {
      right: 2,
      forward: 4,
      left: 2,
    };

    this.movementSlots = {
      first: null,
      second: null,
      third: null,
      fourth: stallToken ? "stall" : null,
    };

    this.maxGuns = maxGuns;
    this.currentGuns = maxGuns;
    this.autoTokens = true;
    this.hasStallToken = stallToken;
  }

  setLeftTokens(amount) {
    this.movementTokens.left = amount;
  }

  setForwardTokens(amount) {
    this.movementTokens.forward = amount;
  }

  setRightTokens(amount) {
    this.movementTokens.right = amount;
  }

  damageShip(hits, cannonType) {
    // TODO
    this.damage += hits * 0.5;
  }
}

export default ShipData;
