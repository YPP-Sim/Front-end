import * as PIXI from "pixi.js";
import orientation from "./Orientation";
import { calculateGameToSpritePosition } from "./Game";
import Orientation from "./Orientation";
import {
  getMovementAnimData,
  updateLinearAnimation,
  getSideVelocity,
  updateTextureAnimation,
  updateSinkingTextureAnimation,
  getObjectSize,
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
    this.animationSmoothness = 30; // Bigger is smoother
    this.animationSpeed = 10; // Lower is faster
    this.textureChangeDelay = 110;
    this.turnThreshold = 0.4;
    this.cannonMoveSpeed = 16; // Lower is faster, higher is slower

    // The ratio/percentage distance from 0-1 of how far the ship will move forward
    // on a cancelled forward move (due to bump given by server)
    // before reversing back into place.
    this.bumpMovementRatio = 0.7;

    this.barSectionWidth = 11;
    this.barHeight = 6;
  }

  loadSprites() {
    const loader = PIXI.Loader.shared;

    // Pre loading movement/sinking textures
    this.sinkingTexture = new PIXI.Texture(
      loader.resources[this.type.sinkingTextureName].texture
    );

    this.movementTexture = new PIXI.Texture(
      loader.resources[this.type.textureName].texture
    );

    // Ship Sprite
    const shipSprite = new PIXI.Sprite(this.movementTexture);

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

    const perCannonShoot = () => {
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
          if (hit) this._playHitEffect(targetX, targetY);
          else this._playMissEffect(targetX, targetY);
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
    };

    if (gunData[0]) {
      perCannonShoot();
      if (gunData[1]) {
        // TODO maybe don't use setTimeout, change in future?
        setTimeout(perCannonShoot, 200);
      }
    }
  }

  _playHitEffect(boardX, boardY) {
    const hitTexture = PIXI.Loader.shared.resources["hit"].texture;
    const hitSprite = new PIXI.Sprite(new PIXI.Texture(hitTexture));
    hitSprite.zIndex = 99;
    hitSprite.anchor.x = 0.5;
    hitSprite.anchor.y = 0.5;
    const frame = new PIXI.Rectangle(0, 0, 40, 30);
    hitSprite.texture.frame = frame;

    this.game.stage.addChild(hitSprite);
    const { spaceX, spaceY } = calculateGameToSpritePosition(boardX, boardY);

    const { removeSprite } = this.game.mapBody.addSprite(
      hitSprite,
      spaceX,
      spaceY
    );
    const ticker = new PIXI.Ticker();

    const context = {
      textureChangeElapsed: 0,
      lastElapsedTime: 0,
      time: 130,
      speed: 4,
      ticker,
      totalWidth: 600 - 40,
      remove: () => {
        removeSprite();
        this.game.stage.removeChild(hitSprite);
      },
      frame,
      sprite: hitSprite,
    };

    ticker.add(updateTextureAnimation, context);
    ticker.start();
  }

  _playMissEffect(boardX, boardY) {
    const missTexture =
      PIXI.Loader.shared.resources[this.type.cannonType.missTexture].texture;
    const missSprite = new PIXI.Sprite(new PIXI.Texture(missTexture));
    missSprite.zIndex = 30;
    missSprite.anchor.x = 0.5;
    missSprite.anchor.y = 0.5;
    const frame = new PIXI.Rectangle(0, 0, 40, 30);
    missSprite.texture.frame = frame;

    this.game.stage.addChild(missSprite);
    const { spaceX, spaceY } = calculateGameToSpritePosition(boardX, boardY);

    const { removeSprite } = this.game.mapBody.addSprite(
      missSprite,
      spaceX,
      spaceY
    );
    const ticker = new PIXI.Ticker();

    const context = {
      textureChangeElapsed: 0,
      lastElapsedTime: 0,
      time: 130,
      totalWidth: this.type.cannonType.missTextureWidth - 40,
      speed: 4,
      ticker,
      remove: () => {
        removeSprite();
        this.game.stage.removeChild(missSprite);
      },
      frame,
      sprite: missSprite,
    };

    ticker.add(updateTextureAnimation, context);
    ticker.start();
  }

  _playShootEffect(cannonType) {
    const expTexture =
      PIXI.Loader.shared.resources[cannonType.explosionTexture].texture;
    const explosionSprite = new PIXI.Sprite(new PIXI.Texture(expTexture));
    explosionSprite.zIndex = 30;
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
      textureChangeElapsed: 0,
      lastElapsedTime: 0,
      time: 85,
      totalWidth: this.type.cannonType.explosionTextureWidth - 40,
      speed: 3,
      ticker,
      remove: () => {
        removeSprite();
        this.game.stage.removeChild(explosionSprite);
      },
      frame,
      sprite: explosionSprite,
    };

    ticker.add(updateTextureAnimation, context);
    ticker.start();
  }

  playSinkingAnimation() {
    const orientations = this.type.sinkingOrientations.orientations;

    const { x, y, width, height } = orientations[0];
    const rect = new PIXI.Rectangle(x, y, width, height);
    this.sprite.texture = this.sinkingTexture;
    this.sprite.texture.frame = rect;

    const ticker = new PIXI.Ticker();
    const context = {
      textureChangeElapsed: 0,
      lastElapsedTime: 0,
      currentFrame: 0,
      time: 430,
      speed: 6,
      ticker,
      onComplete: () => {
        this.game.socket.emit("requestShipStats", {
          playerName: this.playerName,
          gameId: this.game.gameId,
        });
      },
      totalFrames: getObjectSize(orientations),
      orientations,
      frame: rect,
      sprite: this.sprite,
    };

    ticker.add(updateSinkingTextureAnimation, context);
    ticker.start();
  }

  /**
   *
   * @param {string} direction
   */
  move(direction, cancelledMovement, cancelledTurnal) {
    switch (direction) {
      case "LEFT":
        this.moveLeft(cancelledMovement, cancelledTurnal);
        break;
      case "FORWARD":
        this.moveForward(cancelledMovement);
        break;
      case "RIGHT":
        this.moveRight(cancelledMovement, cancelledTurnal);
        break;
      default:
        break;
    }
  }

  moveByOrientation(orientation, cancelledMovement) {
    const { xDir, yDir } = orientation;
    const originalX = this.vX;
    const originalY = this.vY;

    const distance =
      cancelledMovement === true ? 1 - this.bumpMovementRatio : 1;

    let targetX = this.vX + distance * xDir;
    let targetY = this.vY + distance * yDir;

    this.animateTo(originalX, originalY, targetX, targetY, cancelledMovement);
  }

  moveForward(cancelled) {
    const originalX = this.x;
    const originalY = this.y;
    let targetX = 0;
    let targetY = 0;

    const distance = cancelled === true ? 1 - this.bumpMovementRatio : 1;

    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.x;
        targetY = this.y + distance;
        break;
      case orientation.NORTH:
        targetX = this.x;
        targetY = this.y - distance;
        break;
      case orientation.WEST:
        targetX = this.x - distance;
        targetY = this.y;
        break;
      case orientation.EAST:
        targetX = this.x + distance;
        targetY = this.y;
        break;
    }

    this.animateTo(originalX, originalY, targetX, targetY, cancelled);
  }

  animateTo(originalX, originalY, targetX, targetY, cancelled) {
    const animationTicker = new PIXI.Ticker();
    const context = {
      ticker: animationTicker,
      lastElapsedTime: 0,
      totalTime: cancelled ? 12 : 35,
      initialPosition: { x: originalX, y: originalY },
      finalPosition: { x: targetX, y: targetY },
      setPosition: (incrementX, incrementY) => {
        this.setGamePosition(this.x + incrementX, this.y + incrementY);
      },
      onComplete: () => {
        this.setPosition(targetX, targetY);

        if (cancelled) {
          const reverseTicker = new PIXI.Ticker();

          const reverseContext = {
            ticker: reverseTicker,
            lastElapsedTime: 0,
            totalTime: 10,
            initialPosition: { x: this.x, y: this.y },
            finalPosition: { x: originalY, y: originalX },
            setPosition: (incrementX, incrementY) => {
              this.setGamePosition(this.x + incrementX, this.y + incrementY);
            },
            onComplete: () => {
              this.setPosition(originalX, originalY);
            },
          };

          reverseTicker.add(updateLinearAnimation, reverseContext);
          reverseTicker.start();
        }
      },
    };

    animationTicker.add(updateLinearAnimation, context);
    animationTicker.start();
  }

  moveRight(cancelledMovement, cancelledTurnal) {
    let targetX = 0;
    let targetY = 0;
    let toOrientation = orientation.NORTH;

    let xFirst = false;
    let yFirst = false;

    const turnalDistance = cancelledTurnal ? 0 : 1;

    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.vX - turnalDistance;
        targetY = this.vY + 1;
        yFirst = true;
        toOrientation = orientation.WEST;
        break;
      case orientation.NORTH:
        targetX = this.vX + turnalDistance;
        targetY = this.vY - 1;
        yFirst = true;
        toOrientation = orientation.EAST;
        break;
      case orientation.WEST:
        targetX = this.vX - 1;
        targetY = this.vY - turnalDistance;
        xFirst = true;
        toOrientation = orientation.NORTH;
        break;
      case orientation.EAST:
        targetX = this.vX + 1;
        targetY = this.vY + turnalDistance;
        xFirst = true;
        toOrientation = orientation.SOUTH;
        break;
    }

    // Animation
    this._startTextureAnim(toOrientation, "RIGHT");

    // TODO Maybe add a 'small' bump animation for cancelled movements on turns
    if (cancelledMovement) return;

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
      this.x,
      this.y,
      targetX,
      targetY,
      this.animationSmoothness
    );

    const animationTicker = new PIXI.Ticker();
    animationTicker.add((deltaTime) => {
      let toX = this.x;
      let toY = this.y;

      if ((xFirst || yComplete <= this.turnThreshold) && xComplete > 0) {
        const toIncrementX = incrementX * deltaTime;
        toX += toIncrementX;
        xComplete -= Math.abs(toIncrementX);
      }

      if ((yFirst || xComplete <= this.turnThreshold) && yComplete > 0) {
        const toIncrementY = incrementY * deltaTime;
        toY += toIncrementY;
        yComplete -= Math.abs(toIncrementY);
      }

      this.setGamePosition(toX, toY);

      if (xComplete <= 0 && yComplete <= 0) {
        animationTicker.stop();
        this.setPosition(targetX, targetY);
      }
    });

    animationTicker.start();
  }

  moveLeft(cancelledMovement, cancelledTurnal) {
    let targetX = 0;
    let targetY = 0;
    let toOrientation = orientation.NORTH;

    let xFirst = false;
    let yFirst = false;

    const turnalDistance = cancelledTurnal ? 0 : 1;

    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.vX + turnalDistance;
        targetY = this.vY + 1;
        yFirst = true;
        toOrientation = orientation.EAST;
        break;
      case orientation.NORTH:
        targetX = this.vX - turnalDistance;
        targetY = this.vY - 1;
        yFirst = true;
        toOrientation = orientation.WEST;
        break;
      case orientation.WEST:
        targetX = this.vX - 1;
        targetY = this.vY + turnalDistance;
        xFirst = true;
        toOrientation = orientation.SOUTH;
        break;
      case orientation.EAST:
        targetX = this.vX + 1;
        targetY = this.vY - turnalDistance;
        xFirst = true;
        toOrientation = orientation.NORTH;
        break;
    }

    // Animation
    this._startTextureAnim(toOrientation, "LEFT");
    // Movement
    if (cancelledMovement) return;

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
    switch (orient.name) {
      case orientation.NORTH.name:
        return 14;
      case orientation.SOUTH.name:
        return 6;
      case orientation.EAST.name:
        return 2;
      case orientation.WEST.name:
        return 10;
    }
  }
}

export default Ship;
