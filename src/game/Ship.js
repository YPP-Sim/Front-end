import * as PIXI from "pixi.js";
import orientation from "./Orientation";
import WebTicker from "./webTicker.worker.js";
import MyTicker from "./MyTicker";

import { calculateGameToSpritePosition } from "./Game";
import Orientation from "./Orientation";
import {
  getMovementAnimData,
  updateLinearAnimation,
  getSideVelocity,
} from "./util";

// TESTING COMMANDS:
// addShip -- shipId: art, boardX: 1, boardY: 1, shipType: warFrig, orientation: SOUTH
// moveShip -- shipId: art, moveType: SOUTH

class Ship {
  constructor(shipType, game, playerName) {
    this.type = shipType;
    this.game = game;
    this.playerName = playerName;

    //Graphical position of the ship (in terms for the sprite)
    this.x = 0;
    this.y = 0;

    //Virtual position (e.g, board position)
    this.vX = 0;
    this.vY = 0;

    // Timings -- Try not to touch unless you really understand.
    this.animationSmoothness = 100; // Bigger is smoother
    this.animationSpeed = 10; // Lower is faster
    this.textureChangeDelay = 129;
    this.turnThreshold = 0.4;
    this.cannonMoveSpeed = 16; // Lower is faster, higher is slower

    //
    this.movementTicker = new WebTicker();
    this.activeTicker = new MyTicker();
    this.movementTicker.addEventListener("message", () => {
      this.activeTicker.fire();
    });

    this.barSectionWidth = 11;
    this.barHeight = 6;
  }

  loadSprites() {
    const loader = PIXI.Loader.shared;

    // Ship Sprite
    const shipSprite = new PIXI.Sprite(
      new PIXI.Texture(loader.resources[this.type.textureName].texture)
    );

    shipSprite.zIndex = 3;
    const { spaceX, spaceY } = calculateGameToSpritePosition(this.vX, this.vY);

    const shipBody = this.game.mapBody.addSprite(shipSprite, spaceX, spaceY);
    this.setSpritePosition = shipBody.setSpriteOffset;
    // Movement bar
    const shipMoveBar = new PIXI.Graphics();
    shipMoveBar.lineStyle(1, 0x000000);

    const totalBarWidth = this.type.hasStallToken
      ? this.barSectionWidth * 3
      : this.barSectionWidth * 4;
    shipMoveBar.drawRect(0, -30, totalBarWidth, this.barHeight);
    shipMoveBar.pivot.x = totalBarWidth / 2;
    shipMoveBar.pivot.y = this.barHeight / 2;
    shipMoveBar.zIndex = 4;

    const spriteBarBody = this.game.mapBody.addSprite(
      shipMoveBar,
      spaceX,
      spaceY - 20
    );
    this.setSpriteBarPosition = spriteBarBody.setSpriteOffset;

    // filled movement bar
    const shipFillBar = new PIXI.Graphics();
    shipFillBar.beginFill(0xffffff);
    shipFillBar.drawRect(-6, -30, 0, this.barHeight);
    shipFillBar.pivot.x = this.barSectionWidth;
    shipFillBar.pivot.y = this.barHeight / 2;
    shipFillBar.zIndex = 5;
    shipFillBar.endFill();

    const fillBarBody = this.game.mapBody.addSprite(
      shipFillBar,
      spaceX,
      spaceY - 20
    );
    this.setFillBarPosition = fillBarBody.setSpriteOffset;

    this.setBarMovements = (moves) => {
      shipFillBar.clear();
      shipFillBar.beginFill(0xffffff);
      if (this.type.hasStallToken) {
        if (moves > 3) {
          shipFillBar.drawRect(
            -6,
            -30,
            this.barSectionWidth * 3,
            this.barHeight
          );
          // Add red suffix
          shipFillBar.beginFill(0xff0000);
          shipFillBar.drawRect(
            -6 + this.barSectionWidth * 3,
            -30,
            this.barSectionWidth,
            this.barHeight
          );
          shipFillBar.endFill();
        } else
          shipFillBar.drawRect(
            -6,
            -30,
            this.barSectionWidth * moves,
            this.barHeight
          );
      } else {
        shipFillBar.drawRect(
          0,
          -30,
          this.barSectionWidth * moves,
          this.barHeight
        );
      }

      shipFillBar.endFill();
    };

    // Ship Name Text
    const textStyle = new PIXI.TextStyle({ fontSize: 14 });
    const shipNameText = new PIXI.Text(this.playerName, textStyle);
    shipNameText.zIndex = 4;
    shipNameText.anchor.x = 0.5;
    shipNameText.anchor.y = 0.5;
    const nameBody = this.game.mapBody.addSprite(
      shipNameText,
      spaceX + 64,
      spaceY - 67
    );
    this.setNamePosition = nameBody.setSpriteOffset;

    this.sprite = shipSprite;
    this.game.stage.addChild(shipNameText);
    this.game.stage.addChild(shipMoveBar);
    this.game.stage.addChild(shipSprite);
    this.game.stage.addChild(shipFillBar);
    this.faceDirection = orientation.SOUTH;
    this.setTextureFromOrientation(this.faceDirection);
  }

  /**
   *  Set's the sprites position, used mainly for animations.
   * This does not set the actual board position and is purely for
   * graphics
   * @param {number} x
   * @param {number} y
   */
  setGamePosition(x, y) {
    this.x = x;
    this.y = y;
    const { spaceX, spaceY } = calculateGameToSpritePosition(x, y);
    this.setSpritePosition(spaceX, spaceY);
    this.setSpriteBarPosition(spaceX, spaceY - 20);
    this.setNamePosition(spaceX, spaceY - 67);
    this.setFillBarPosition(spaceX, spaceY - 20);
  }

  /**
   * Set's the board position as well as setting the regular x,y fields for the
   * starting reference needed for animations.
   * @param {number} x
   * @param {number} y
   */
  setVirtualPosition(x, y) {
    this.vX = x;
    this.vY = y;

    this.x = x;
    this.y = y;
  }

  /**
   * Will set an absolute position. This will set the sprite position and
   * the board position. Used mainly for spawning ships and doing any sort of hard
   * position setting (like switching sides from defender-side to attacking-side)
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    this.setGamePosition(x, y);
    this.setVirtualPosition(x, y);
  }

  setOrientation(orientation) {
    this.faceDirection = orientation;
    this.setTextureFromOrientation(orientation);
  }

  /**
   *
   * @param {Array.<boolean>} gunData
   * @param {string} side
   */
  shoot(gunData, side, gunEnd, hit) {
    this._playShootEffect(this.type.cannonType);
    const loader = PIXI.Loader.shared;
    let startingX = this.vX;
    let startingY = this.vY;
    const targetVelocity = getSideVelocity(this.faceDirection, side);
    const targetX = startingX + gunEnd * targetVelocity.x;
    const targetY = startingY + gunEnd * targetVelocity.y;
    const startingSpritePosition = calculateGameToSpritePosition(
      startingX,
      startingY
    );

    const gunTexture = new PIXI.Texture(
      loader.resources[this.type.cannonType.texture].texture
    );

    for (let gun of gunData) {
      if (!gun) continue;
      const cannonSprite = new PIXI.Sprite(gunTexture);
      cannonSprite.anchor.x = 0.5;
      cannonSprite.anchor.y = 0.5;
      cannonSprite.zIndex = 2;

      const cannonBody = this.game.mapBody.addSprite(
        cannonSprite,
        startingSpritePosition.spaceX,
        startingSpritePosition.spaceY
      );
      const incrementCannonPosition = cannonBody.incrementSpriteOffset;

      this.game.stage.addChild(cannonSprite);

      const shotTicker = new PIXI.Ticker();
      const linearAnimationContext = {
        initialPosition: { x: startingX, y: startingY },
        finalPosition: { x: targetX, y: targetY },
        totalTime: this.cannonMoveSpeed * gunEnd,
        lastElapsedTime: 0, // Init to 0
        ticker: shotTicker,
        onComplete: () => {
          console.log("Animation completed");
          this.game.stage.removeChild(cannonSprite);
          cannonBody.removeSprite();
        },
        setPosition: (incrementX, incrementY) => {
          const newCannonSpritePosition = calculateGameToSpritePosition(
            incrementX,
            incrementY
          );
          incrementCannonPosition(
            newCannonSpritePosition.spaceX,
            newCannonSpritePosition.spaceY
          );
        },
      };
      shotTicker.add(updateLinearAnimation, linearAnimationContext);
      shotTicker.start();
    }
  }

  _playShootEffect(cannonType) {
    const expTexture =
      PIXI.Loader.shared.resources[cannonType.explosionTexture].texture;
    const explosionSprite = new PIXI.Sprite(new PIXI.Texture(expTexture));
    explosionSprite.zIndex = 100;
    explosionSprite.anchor.x = 0.5;
    explosionSprite.anchor.y = 0.5;
    const frame = new PIXI.Rectangle(0, 0, 40, 30);
    explosionSprite.texture.frame = frame;

    this.game.stage.addChild(explosionSprite);
    const { spaceX, spaceY } = calculateGameToSpritePosition(this.vX, this.vY);
    const { removeSprite } = this.game.mapBody.addSprite(
      explosionSprite,
      spaceX,
      spaceY
    );

    const ticker = new PIXI.Ticker();

    const context = {
      lastElapsedTime: 0,
      speed: 3,
      textureChangeElapsed: 0,
      time: 85,
    };

    ticker.add((deltaTime) => {
      const elapsedTime = context.lastElapsedTime + deltaTime;
      context.textureChangeElapsed += deltaTime;

      if (elapsedTime > context.time) {
        ticker.stop();
        removeSprite();
        this.game.stage.removeChild(explosionSprite);
        return;
      }

      if (context.textureChangeElapsed >= context.speed) {
        if (frame.x >= cannonType.explosionTextureWidth - 40) {
          removeSprite();
          this.game.stage.removeChild(explosionSprite);
          ticker.stop();
          return;
        } else frame.x += 40;

        explosionSprite.texture.frame = frame;
        context.textureChangeElapsed = 0;
      }
      context.lastElapsedTime = elapsedTime;
    });

    ticker.start();
  }

  /**
   *
   * @param {string} direction
   */
  move(direction) {
    switch (direction) {
      case "LEFT":
        this.moveLeft();
        break;
      case "FORWARD":
        this.moveForward();
        break;
      case "RIGHT":
        this.moveRight();
        break;
      default:
        break;
    }
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

    let { incrementX, incrementY, xComplete, yComplete } = getMovementAnimData(
      this.x,
      this.y,
      targetX,
      targetY,
      this.animationSmoothness
    );

    const animationTicker = new PIXI.Ticker();
    animationTicker.add((deltaTime) => {
      this.setGamePosition(this.x + incrementX, this.y + incrementY);
      xComplete -= Math.abs(incrementX);
      yComplete -= Math.abs(incrementY);

      if (xComplete <= 0 && yComplete <= 0) {
        this.setPosition(targetX, targetY);
        animationTicker.stop();
      }
    }, {});

    animationTicker.start();
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
    this._startTextureAnim(toOrientation, "RIGHT");
    // Movement
    this._startMovementAnim(xFirst, yFirst, targetX, targetY);
  }

  _startTextureAnim(toOrientation, toDirection) {
    let currentFrameId = this.getFrameByOrientation(this.faceDirection);
    const shipRect = new PIXI.Rectangle(0, 0, 0, 0);

    let frameCounter = 0;
    const textureAnimId = setInterval(() => {
      if (toDirection === "RIGHT" && currentFrameId === 15) currentFrameId = 0;
      else if (toDirection === "LEFT" && currentFrameId === 0)
        currentFrameId = 15;

      const { x, y, width, height } = this.type.orientations.orientations[
        currentFrameId
      ];

      shipRect.x = x;
      shipRect.y = y;
      shipRect.width = width;
      shipRect.height = height;

      this.sprite.texture.frame = shipRect;
      if (toDirection === "RIGHT") currentFrameId++;
      else if (toDirection === "LEFT") currentFrameId--;

      frameCounter++;

      if (frameCounter > 4) {
        clearInterval(textureAnimId);
        this.setOrientation(toOrientation);
      }
    }, this.textureChangeDelay);
  }

  _startMovementAnim(xFirst, yFirst, targetX, targetY) {
    let { incrementX, incrementY, xComplete, yComplete } = getMovementAnimData(
      targetX,
      targetY
    );

    this.activeTicker = new MyTicker();

    const animationTicker = new PIXI.Ticker();
    const movementContext = {
      object: this.sprite,
      initialPosition: {},
      finalPosition: {},
      totalTime: 2000,
      lastElapsedTime: 0,
    };
    animationTicker.add((deltaTime) => {
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
        animationTicker.stop();
        this.setPosition(targetX, targetY);
      }
    }, movementContext);

    animationTicker.start();
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
    this._startTextureAnim(toOrientation, "LEFT");
    // Movement
    this._startMovementAnim(xFirst, yFirst, targetX, targetY);
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
