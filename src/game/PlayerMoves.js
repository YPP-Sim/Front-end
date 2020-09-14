class PlayerMoves {
  constructor(dualCannon, game) {
    this.initialMoveData = { rightGuns: [], leftGuns: [] };
    this.game = game;

    if (dualCannon) {
      this.initialMoveData.rightGuns = [false, false];
      this.initialMoveData.leftGuns = [false, false];
    } else {
      this.initialMoveData.rightGuns = [false];
      this.initialMoveData.leftGuns = [false];
    }

    this.dualCannon = dualCannon;

    this.move1 = JSON.parse(JSON.stringify(this.initialMoveData));
    this.move2 = JSON.parse(JSON.stringify(this.initialMoveData));
    this.move3 = JSON.parse(JSON.stringify(this.initialMoveData));
    this.move4 = JSON.parse(JSON.stringify(this.initialMoveData));
  }

  clearCannons() {
    this.move1 = JSON.parse(JSON.stringify(this.initialMoveData));
    this.move2 = JSON.parse(JSON.stringify(this.initialMoveData));
    this.move3 = JSON.parse(JSON.stringify(this.initialMoveData));
    this.move4 = JSON.parse(JSON.stringify(this.initialMoveData));
  }

  incrementNumberedTurnGuns(numberedTurn, side, onTextureChange) {
    side = side.toLowerCase();
    const selectedMove = this["move" + numberedTurn];
    const selectedGuns = selectedMove[side + "Guns"];

    if (this.game.cannons <= 0) {
      selectedGuns[0] = false;
      if (selectedGuns[1]) selectedGuns[1] = false;
    } else if (selectedGuns[0] === false) {
      selectedGuns[0] = true;
    } else {
      if (selectedGuns.length === 2) {
        if (selectedGuns[1] === false) {
          selectedGuns[1] = true;
        } else {
          selectedGuns[0] = false;
          selectedGuns[1] = false;
        }
      } else {
        selectedGuns[0] = false;
      }
    }

    if (onTextureChange)
      onTextureChange(this["move" + numberedTurn][side + "Guns"]);
  }
}

export default PlayerMoves;
