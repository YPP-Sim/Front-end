class PlayerMoves {
  constructor(dualCannon) {
    const initialMoveData = { rightGuns: [], leftGuns: [] };

    if (dualCannon) {
      initialMoveData.rightGuns = [false, false];
      initialMoveData.leftGuns = [false, false];
    } else {
      initialMoveData.rightGuns = [false];
      initialMoveData.leftGuns = [false];
    }

    this.move1 = JSON.parse(JSON.stringify(initialMoveData));
    this.move2 = JSON.parse(JSON.stringify(initialMoveData));
    this.move3 = JSON.parse(JSON.stringify(initialMoveData));
    this.move4 = JSON.parse(JSON.stringify(initialMoveData));
  }

  incrementNumberedTurnGuns(numberedTurn, side, onTextureChange) {
    side = side.toLowerCase();
    const selectedMove = this["move" + numberedTurn];
    const selectedGuns = selectedMove[side + "Guns"];

    if (selectedGuns[0] === false) {
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
