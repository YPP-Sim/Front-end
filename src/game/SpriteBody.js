/**
 * Author/Github handle: artish1
 */

import { Sprite } from "pixi.js";
/**
 * @class A helpful class that groups sprites so that they can move together.
 */
class SpriteBody {
  /**
   *  @param { Sprite } mainSprite  The main sprite of the body. Can be set to null.
   *  @param { number } x            The x value that the body should be displayed onto the screen
   *  @param { number } y            The y value that the body should be displayed onto the screen
   */
  constructor(mainSprite, x, y) {
    this.mainSprite = mainSprite;
    this.x = x;
    this.y = y;

    if (this.mainSprite) {
      this.mainSprite.x = x;
      this.mainSprite.y = y;
    }
    this.children = [];
  }

  addSprite(sprite, xOffset, yOffset) {
    sprite.x = this.x + xOffset;
    sprite.y = this.y + yOffset;

    this.children.push({
      sprite,
      xOffset,
      yOffset,
    });

    const setSpriteOffset = (offsetX, offsetY) => {
      sprite.x = this.x + offsetX;
      sprite.y = this.y + offsetY;
    };

    return setSpriteOffset;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;

    // Change position of main sprite
    if (this.mainSprite) {
      this.mainSprite.x = x;
      this.mainSprite.y = y;
    }

    let spriteChild;
    //Change position of children to stick with body
    for (spriteChild of this.children) {
      spriteChild.x = this.x + spriteChild.xOffset;
      spriteChild.y = this.y + spriteChild.yOffset;
    }
  }
}

export default SpriteBody;
