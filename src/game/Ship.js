import * as PIXI from "pixi.js";
import orientation from "./Orientation";
import WebTicker from "./webTicker.worker.js";
import MyTicker from "./MyTicker";

import { calculateGameToSpritePosition } from "./Game";
import Orientation from "./Orientation";

class Ship {
  constructor(shipType, game) {
    this.x = 0;
    this.y = 0;
    this.type = shipType;
    this.game = game;

    //Virtual position
    this.vX = 0;
    this.vY = 0;

    // this.bilge = 0;
    // this.damage = 0;

    // Timings
    this.animationSmoothness = 50; // Bigger is smoother
    this.animationSpeed = 10; // Lower is faster
    this.textureChangeDelay = 129;
    this.turnThreshold = 0.4;

    this.movementTicker = new WebTicker();

    this.activeTicker = new MyTicker();
    this.movementTicker.addEventListener("message", () => {
      this.activeTicker.fire();
    });
  }

  loadSprites() {
    const loader = PIXI.Loader.shared;

    const shipSprite = new PIXI.Sprite(
      new PIXI.Texture(loader.resources[this.type.textureName].texture)
    );

    shipSprite.zIndex = 2;

    const { spaceX, spaceY } = calculateGameToSpritePosition(this.vX, this.vY);
    this.setSpritePosition = this.game.mapBody.addSprite(
      shipSprite,
      spaceX,
      spaceY
    );

    this.sprite = shipSprite;

    this.game.stage.addChild(shipSprite);

    this.faceDirection = orientation.SOUTH;

    this.setTextureFromOrientation(this.faceDirection);
  }

  setGamePosition(x, y) {
    this.x = x;
    this.y = y;
    const { spaceX, spaceY } = calculateGameToSpritePosition(x, y);
    this.setSpritePosition(spaceX, spaceY);
  }

  setVirtualPosition(x, y) {
    this.vX = x;
    this.vY = y;

    this.x = x;
    this.y = y;
  }

  setPosition(x, y) {
    this.setGamePosition(x, y);
    this.setVirtualPosition(x, y);
  }

  setOrientation(orientation) {
    this.faceDirection = orientation;
    this.setTextureFromOrientation(orientation);
  }

  moveForward() {
    let targetX = 0;
    let targetY = 0;
    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.x;
        targetY = this.y + 1;
        break;
      case orientation.NORTH:
        targetX = this.x;
        targetY = this.y - 1;
        break;
      case orientation.WEST:
        targetX = this.x - 1;
        targetY = this.y;
        break;
      case orientation.EAST:
        targetX = this.x + 1;
        targetY = this.y;
        break;
    }

    // Animation
    let dX = targetX - this.x;
    let dY = targetY - this.y;

    const incrementX = dX / this.animationSmoothness;
    const incrementY = dY / this.animationSmoothness;

    let xComplete = Math.abs(dX);
    let yComplete = Math.abs(dY);

    console.log("this: ", this.x, this.y);

    this.activeTicker = new MyTicker();
    this.activeTicker.add(() => {
      this.setGamePosition(this.x + incrementX, this.y + incrementY);
      xComplete -= Math.abs(incrementX);
      yComplete -= Math.abs(incrementY);

      if (xComplete <= 0 && yComplete <= 0) {
        this.setPosition(targetX, targetY);
        this.movementTicker.postMessage(["stop"]);
      }
    });

    this.movementTicker.postMessage(["start", this.animationSpeed]);
  }

  moveRight() {
    let targetX = 0;
    let targetY = 0;
    let toOrientation = orientation.NORTH;

    let xFirst = false;
    let yFirst = false;

    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.vX - 1;
        targetY = this.vY + 1;
        yFirst = true;
        toOrientation = orientation.WEST;
        break;
      case orientation.NORTH:
        targetX = this.vX + 1;
        targetY = this.vY - 1;
        yFirst = true;
        toOrientation = orientation.EAST;

        break;
      case orientation.WEST:
        targetX = this.vX - 1;
        targetY = this.vY - 1;
        xFirst = true;
        toOrientation = orientation.NORTH;

        break;
      case orientation.EAST:
        targetX = this.vX + 1;
        targetY = this.vY + 1;
        xFirst = true;
        toOrientation = orientation.SOUTH;
        break;
    }

    // Animation

    let currentFrameId = this.getFrameByOrientation(this.faceDirection);
    const shipRect = new PIXI.Rectangle(0, 0, 0, 0);

    let frameCounter = 0;
    const textureAnimId = setInterval(() => {
      if (currentFrameId === 15) currentFrameId = 0;

      const { x, y, width, height } = this.type.orientations.orientations[
        currentFrameId
      ];

      shipRect.x = x;
      shipRect.y = y;
      shipRect.width = width;
      shipRect.height = height;

      this.sprite.texture.frame = shipRect;

      currentFrameId++;
      frameCounter++;

      if (frameCounter > 4) {
        clearInterval(textureAnimId);
        this.setOrientation(toOrientation);
      }
    }, this.textureChangeDelay);

    // Movement
    let dX = targetX - this.x;
    let dY = targetY - this.y;

    const incrementX = dX / this.animationSmoothness;
    const incrementY = dY / this.animationSmoothness;

    let xComplete = Math.abs(dX);
    let yComplete = Math.abs(dY);

    this.activeTicker = new MyTicker();
    this.activeTicker.add(() => {
      let toX = this.x;
      let toY = this.y;

      if ((xFirst || yComplete <= this.turnThreshold) && xComplete > 0) {
        toX += incrementX;
        xComplete -= Math.abs(incrementX);
      }

      if ((yFirst || xComplete <= this.turnThreshold) && yComplete > 0) {
        toY += incrementY;
        yComplete -= Math.abs(incrementY);
      }

      this.setGamePosition(toX, toY);

      if (xComplete <= 0 && yComplete <= 0) {
        this.movementTicker.postMessage(["stop"]);
        this.setGamePosition(targetX, targetY);
        this.setVirtualPosition(targetX, targetY);
        this.setPosition(targetX, targetY);
      }
    });

    this.movementTicker.postMessage(["start", this.animationSpeed]);
  }

  moveLeft() {
    let targetX = 0;
    let targetY = 0;
    let toOrientation = orientation.NORTH;

    let xFirst = false;
    let yFirst = false;

    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.vX + 1;
        targetY = this.vY + 1;
        yFirst = true;
        toOrientation = orientation.EAST;
        break;
      case orientation.NORTH:
        targetX = this.vX - 1;
        targetY = this.vY - 1;
        yFirst = true;
        toOrientation = orientation.WEST;

        break;
      case orientation.WEST:
        targetX = this.vX - 1;
        targetY = this.vY + 1;
        xFirst = true;
        toOrientation = orientation.SOUTH;

        break;
      case orientation.EAST:
        targetX = this.vX + 1;
        targetY = this.vY - 1;
        xFirst = true;
        toOrientation = orientation.NORTH;
        break;
    }

    // Animation

    let currentFrameId = this.getFrameByOrientation(this.faceDirection);
    const shipRect = new PIXI.Rectangle(0, 0, 0, 0);

    let frameCounter = 0;
    const textureAnimId = setInterval(() => {
      if (currentFrameId === 0) currentFrameId = 15;

      const { x, y, width, height } = this.type.orientations.orientations[
        currentFrameId
      ];

      shipRect.x = x;
      shipRect.y = y;
      shipRect.width = width;
      shipRect.height = height;

      this.sprite.texture.frame = shipRect;

      currentFrameId--;
      frameCounter++;

      if (frameCounter > 4) {
        clearInterval(textureAnimId);
        this.setOrientation(toOrientation);
      }
    }, this.textureChangeDelay);

    // Movement
    let dX = targetX - this.x;
    let dY = targetY - this.y;

    const incrementX = dX / this.animationSmoothness;
    const incrementY = dY / this.animationSmoothness;

    let xComplete = Math.abs(dX);
    let yComplete = Math.abs(dY);

    let time = Date.now();
    let prevTime = time;
    const id = setInterval(() => {
      time = Date.now();
      // console.log("Elapsed time: " + (time - prevTime));

      if (time - prevTime > 100) {
        console.log("Spike: ", time - prevTime);
        clearInterval(id);
        this.setGamePosition(targetX, targetY);
        this.setVirtualPosition(targetX, targetY);
        this.setPosition(targetX, targetY);
        console.log("Setting game pos: ", targetX, targetY);
      }

      let toX = this.x;
      let toY = this.y;

      if ((xFirst || yComplete <= this.turnThreshold) && xComplete > 0) {
        toX += incrementX;
        xComplete -= Math.abs(incrementX);
      }

      if ((yFirst || xComplete <= this.turnThreshold) && yComplete > 0) {
        toY += incrementY;
        yComplete -= Math.abs(incrementY);
      }

      this.setGamePosition(toX, toY);

      prevTime = time;

      if (xComplete <= 0 && yComplete <= 0) {
        clearInterval(id);
        this.setGamePosition(targetX, targetY);
        this.setVirtualPosition(targetX, targetY);
        this.setPosition(targetX, targetY);
      }
    }, this.animationSpeed);
  }

  setTextureFromOrientation(orient = Orientation.SOUTH) {
    let orientationNumber = this.getFrameByOrientation(orient);

    const {
      x,
      y,
      width,
      height,
      anchorx,
      anchory,
    } = this.type.orientations.orientations[orientationNumber];
    const shipRect = new PIXI.Rectangle(x, y, width, height);
    this.sprite.texture.frame = shipRect;
    this.sprite.anchor.x = anchorx;
    this.sprite.anchor.y = anchory;
  }

  getFrameByOrientation(orient) {
    switch (orient) {
      case orientation.NORTH:
        return 14;
      case orientation.SOUTH:
        return 6;
      case orientation.EAST:
        return 2;
      case orientation.WEST:
        return 10;
    }
  }
}

export default Ship;
