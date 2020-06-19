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

    this.move1 = initialMoveData;
    this.move2 = initialMoveData;
    this.move3 = initialMoveData;
    this.move4 = initialMoveData;
  }

  incrementNumberedTurnGuns(numberedTurn, side) {
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
  }
}

export default PlayerMoves;
