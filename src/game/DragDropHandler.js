import * as PIXI from "pixi.js";
import Direction from "./Direction";

// The distance that the mouse needs to move when holding down left click to be considered 'dragging'
const DRAG_DETECTION_MOUSE_OFFSET = 10;

class DragDropHandler {
  constructor(game) {
    this.selectedToken = null;
    this.selectedTokenIndex = 0;
    this.game = game;
    this.startDetect = false;
    this.isDragging = false;

    this.startX = 0;
    this.startY = 0;
  }

  startDetecting(startingX, startingY) {
    this.startX = startingX;
    this.startY = startingY;
    this.startDetect = true;

    this.dragSprite.x = this.startX;
    this.dragSprite.y = this.startY;
  }

  init() {
    const texture = new PIXI.Texture(
      this.game.loader.resources["moves"].texture
    );
    this.dragSprite = new PIXI.Sprite(texture);
    this.dragSprite.texture.frame = new PIXI.Rectangle(0, 0, 28, 28);
    this.dragSprite.visible = false;
    this.dragSprite.x = 10;
    this.dragSprite.y = 10;
    this.dragSprite.anchor.x = 0.5;
    this.dragSprite.anchor.y = 0.5;
    this.dragSprite.zIndex = 999;

    this.game.stage.addChild(this.dragSprite);

    this.game.stage.interactive = true;
    this.game.stage.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.game.stage.width,
      this.game.stage.height
    );

    const moveHandler = (event) => {
      if (!this.isDragging) return;

      const x = event.data.global.x;
      const y = event.data.global.y;

      if (
        x < this.game.stage.width &&
        x > 0 &&
        y > 0 &&
        y < this.game.stage.height
      ) {
        this.dragSprite.x = x;
        this.dragSprite.y = y;
      }
    };

    const detectionHandler = (event) => {
      if (!this.startDetect) return;

      const x = event.data.global.x;
      const y = event.data.global.y;

      const dX = Math.abs(this.startX - x);
      const dY = Math.abs(this.startY - y);
      if (
        dX >= DRAG_DETECTION_MOUSE_OFFSET ||
        dY >= DRAG_DETECTION_MOUSE_OFFSET
      ) {
        this.setDragging(true);
        this.startDetect = false;
      }
    };
    this.game.stage.on("mousemove", detectionHandler);
    this.game.stage.mousemove = moveHandler;
  }

  setDragging(bool) {
    this.isDragging = bool;
    this.dragSprite.visible = bool;

    if (bool === false) this.startDetect = false;
  }

  /**
   *    either "LEFT", "RIGHT", "FORWARD", or "STALL" as possible inputs
   * @param {string} move
   */
  setMove(move, index) {
    this.selectedToken = move;
    this.selectedTokenIndex = index;
    const frame = this.dragSprite.texture.frame;
    switch (move) {
      case "LEFT":
        frame.x = 0;
        break;
      case "FORWARD":
        frame.x = 28;
        break;
      case "RIGHT":
        frame.x = 56;
        break;
      case "STALL":
        frame.x = 84;
        break;
    }

    this.dragSprite.texture.frame = frame;
  }

  getSprite() {
    return this.dragSprite;
  }
}

export default DragDropHandler;
