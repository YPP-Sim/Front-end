/**
 * Author/Github handle: artish1
 */

import { Sprite } from "pixi.js";
import uniqid from "uniqid";
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
    this.children = {};
  }

  addSprite(sprite, xOffset, yOffset) {
    sprite.x = this.x + xOffset;
    sprite.y = this.y + yOffset;
    const spriteIdentifier = uniqid("spritebody-");
    sprite.bodyId = spriteIdentifier;

    this.children[spriteIdentifier] = {
      sprite,
      xOffset,
      yOffset,
    };

    const setSpriteOffset = (offsetX, offsetY) => {
      sprite.x = this.x + offsetX;
      sprite.y = this.y + offsetY;

      const spriteObj = this.children[spriteIdentifier];
      spriteObj.xOffset = offsetX;
      spriteObj.yOffset = offsetY;
    };

    const incrementSpriteOffset = (incrementX, incrementY) => {
      const spriteObj = this.children[spriteIdentifier];
      if (!spriteObj) return;
      spriteObj.xOffset += incrementX;
      spriteObj.yOffset += incrementY;

      sprite.x = this.x + spriteObj.xOffset;
      sprite.y = this.y + spriteObj.yOffset;
    };

    const removeSprite = () => {
      sprite.destroy();
      delete this.children[spriteIdentifier];
    };

    return { setSpriteOffset, incrementSpriteOffset, removeSprite };
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
    for (spriteChild of Object.values(this.children)) {
      spriteChild.sprite.x = this.x + spriteChild.xOffset;
      spriteChild.sprite.y = this.y + spriteChild.yOffset;
    }
  }

  moveRelative(x, y) {
    this.setPosition(this.x + x, this.y + y);
  }
}

export default SpriteBody;
