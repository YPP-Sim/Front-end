import * as PIXI from "pixi.js";
import { calculateGameToSpritePosition } from "./Game";

class Flag {
  constructor(x, y, pointValue, game) {
    this.x = x;
    this.y = y;
    this.pointValue = pointValue;
    this.game = game;

    // Captured Status:
    // 0 - not captured/contested - Yellow flag
    // 1 - attacker captured - Red Flag
    // 2 - defender captured - Green Flag
    // 3 - both captured/contested - Black/Gray Flag
    // 4 - Your team/side captured - Blue flag
    this.capturedStatus = 0;

    this._createSprite();
  }

  _createSprite() {
    const loader = PIXI.Loader.shared;

    const texture = new PIXI.Texture(loader.resources["flags"].texture);

    const sprite = new PIXI.Sprite(texture);
    sprite.zIndex = 20;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.85;

    this.frame = new PIXI.Rectangle(0, 0, 50, 69);
    sprite.texture.frame = this.frame;
    this.sprite = sprite;
    this.updateSpriteTexture();
    const { spaceX, spaceY } = calculateGameToSpritePosition(this.x, this.y);
    this.game.mapBody.addSprite(sprite, spaceX, spaceY);
    this.game.stage.addChild(sprite);
  }

  updateSpriteTexture() {
    switch (this.capturedStatus) {
      case 0:
        this.frame.x = 250;
        break;
      case 1:
        this.frame.x = 100;
        break;
      case 2:
        this.frame.x = 50;
        break;
      case 3:
        this.frame.x = 200;
        break;
      case 4:
        this.frame.x = 0;
        break;
    }

    this.frame.y = (this.pointValue - 1) * 69;

    this.sprite.texture.frame = this.frame;
  }

  /**
   * Sets the captured/contested status of the flag and will update the texture.
   * @param {number} statusCode
   */
  setCapturedStatus(statusCode) {
    this.capturedStatus = statusCode;
    this.updateSpriteTexture();
  }
}

export default Flag;
