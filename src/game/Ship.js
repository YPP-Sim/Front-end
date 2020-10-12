import * as PIXI from "pixi.js";
import { OutlineFilter } from "pixi-filters";
import orientation from "./Orientation";
import { calculateGameToSpritePosition } from "./Game";
import Orientation from "./Orientation";
import {
  updateLinearAnimation,
  getSideVelocity,
  updateTextureAnimation,
  updateSinkingTextureAnimation,
  getObjectSize,
  getTeamColor,
} from "./util";

class Ship {
  constructor(shipType, game, playerName, team = "UNDECIDED") {
    this.type = shipType;
    this.game = game;
    this.playerName = playerName;
    this.team = team;

    this.updateTeamColor();

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

    this.flagSymbols = [];
    this.flagSymbolsSprites = [];
  }

  updateTeamColor() {
    this.teamColor = getTeamColor(
      this.game.gameData.thisPlayer.side,
      this.team
    );
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

    shipSprite.filters = [new OutlineFilter(1, this.teamColor)];
    shipSprite.zIndex = 3;
    const { spaceX, spaceY } = calculateGameToSpritePosition(this.vX, this.vY);

    const shipBody = this.game.mapBody.addSprite(shipSprite, spaceX, spaceY);
    this.setSpritePosition = shipBody.setSpriteOffset;
    this.removeSprite = shipBody.removeSprite;
    // Movement bar
    const shipMoveBar = new PIXI.Graphics();
    shipMoveBar.lineStyle(1, 0x000000);

    const totalBarWidth = this.type.hasStallToken
      ? this.barSectionWidth * 3
      : this.barSectionWidth * 4;
    shipMoveBar.drawRect(0, -30, totalBarWidth, this.barHeight);
    shipMoveBar.pivot.x = totalBarWidth / 2;
    shipMoveBar.pivot.y = this.barHeight / 2;
    shipMoveBar.zIndex = 41;

    const spriteBarBody = this.game.mapBody.addSprite(
      shipMoveBar,
      spaceX,
      spaceY - 20
    );
    this.setSpriteBarPosition = spriteBarBody.setSpriteOffset;
    this.removeSpriteBar = spriteBarBody.removeSprite;
    this.shipMoveBar = shipMoveBar;

    // filled movement bar
    const shipFillBar = new PIXI.Graphics();
    shipFillBar.beginFill(0xffffff);
    shipFillBar.drawRect(-6, -30, 0, this.barHeight);
    shipFillBar.pivot.x = this.barSectionWidth;
    shipFillBar.pivot.y = this.barHeight / 2;
    shipFillBar.zIndex = 41;
    shipFillBar.endFill();

    this.shipFillBar = shipFillBar;
    const fillBarBody = this.game.mapBody.addSprite(
      shipFillBar,
      spaceX,
      spaceY - 20
    );
    this.setFillBarPosition = fillBarBody.setSpriteOffset;
    this.removeSpriteFillBar = fillBarBody.removeSprite;
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
    const textStyle = new PIXI.TextStyle({
      fontFamily: "Saira",
      fontSize: 13,
      letterSpacing: 1,
      fill: this.teamColor,
      stroke: "black",
      strokeThickness: 2,
    });
    const shipNameText = new PIXI.Text(this.playerName, textStyle);
    shipNameText.zIndex = 41;
    shipNameText.anchor.x = 0.5;
    shipNameText.anchor.y = 0.5;
    let nameBody = this.game.mapBody.addSprite(
      shipNameText,
      spaceX + 64,
      spaceY - 68
    );
    this.shipNameText = shipNameText;
    this.setNamePosition = nameBody.setSpriteOffset;
    this.removeSpriteName = nameBody.removeSprite;
    this.createInfluenceCircle();

    this.updateSideColors = () => {
      this.updateTeamColor();
      // Ship name text
      nameBody.removeSprite();

      const newTextStyle = new PIXI.TextStyle({
        fontFamily: "Saira",
        fontSize: 13,
        letterSpacing: 1,
        fill: this.teamColor,
        stroke: "black",
        strokeThickness: 2,
      });
      const newNameText = new PIXI.Text(this.playerName, newTextStyle);
      newNameText.zIndex = 41;
      newNameText.anchor.x = 0.5;
      newNameText.anchor.y = 0.5;
      const { spaceX, spaceY } = calculateGameToSpritePosition(
        this.vX,
        this.vY
      );
      this.shipNameText = newNameText;
      nameBody = this.game.mapBody.addSprite(
        newNameText,
        spaceX + 64,
        spaceY - 68
      );

      this.game.stage.addChild(newNameText);
      this.setNamePosition = nameBody.setSpriteOffset;
      this.removeSpriteName = nameBody.removeSprite;
      shipSprite.filters = [new OutlineFilter(1, this.teamColor)];

      // Will remove the old circle and replace it with a more updated one.
      this.createInfluenceCircle();
    };

    shipSprite.interactive = true;
    shipSprite.on("mouseover", () => {
      // Single ship visibility, do all eventually.
      this.game.showShipInfluences();
    });

    shipSprite.on("mouseout", () => {
      this.game.hideShipInfluences();
    });

    this.sprite = shipSprite;
    this.game.stage.addChild(shipNameText);
    this.game.stage.addChild(shipMoveBar);
    this.game.stage.addChild(shipSprite);
    this.game.stage.addChild(shipFillBar);
    this.faceDirection = orientation.SOUTH;
    this.setTextureFromOrientation(this.faceDirection);
  }

  // Ship influence circle
  createInfluenceCircle() {
    if (this.influenceBody) this.influenceBody.removeSprite();

    const influenceRatio = 0.75;
    const influenceRadius = this.type.influenceRadius;
    const influenceWidth = influenceRadius * 50 - 18;
    const influenceHeight = influenceWidth * influenceRatio;

    const { spaceX, spaceY } = calculateGameToSpritePosition(this.vX, this.vY);

    const influenceSprite = new PIXI.Graphics();
    influenceSprite.zIndex = 30;
    influenceSprite.pivot.x = 0.5;
    influenceSprite.pivot.y = 0.5;
    influenceSprite.lineStyle(2, this.teamColor);
    influenceSprite.drawEllipse(
      spaceX,
      spaceY,
      influenceWidth,
      influenceHeight
    );
    influenceSprite.endFill();
    influenceSprite.alpha = 0.5;
    influenceSprite.visible = false;

    const influenceBody = this.game.mapBody.addSprite(
      influenceSprite,
      spaceX,
      spaceY
    );
    this.influenceBody = influenceBody;
    this.setInfluencePosition = influenceBody.setSpriteOffset;
    this.removeSpriteInfluence = influenceBody.removeSprite;
    this.setInfluenceVisibility = (bool) => {
      influenceSprite.visible = bool;
    };
    this.game.stage.addChild(influenceSprite);
  }

  _findFlagSymbolTextureOffset(attackersContesting, defendersContesting) {
    if (attackersContesting && defendersContesting) {
      // Black flags
      return 120;
    }

    const side = this.game.gameData.thisPlayer.side;

    if (attackersContesting) {
      if (side === "ATTACKER")
        // Same team flags (blue)
        return 0;
      else return 60; //Red flags
    }

    if (defendersContesting) {
      if (side === "DEFENDER")
        // Same team flags (blue)
        return 0;
      else return 30; // Green flags
    }
  }

  remove() {
    this.game.stage.removeChild(this.sprite);
    this.removeSprite();
    this.removeSpriteBar();
    this.removeSpriteFillBar();
    this.removeSpriteInfluence();
    this.removeSpriteName();
  }

  /**
   * will update the contest buoys/flags on top of the ship with the given point array
   *
   */
  updateContestedFlags() {
    // Clear out previous sprites
    for (let symbolSpriteHandler of this.flagSymbolsSprites) {
      symbolSpriteHandler.removeSprite();
    }
    this.flagSymbolsSprites = [];

    const loader = PIXI.Loader.shared;

    const yOffset = -83;
    const paddingLength = (this.flagSymbols.length - 1) * 2;
    const flagsLength = this.flagSymbols.length * 10;
    const totalLength = paddingLength + flagsLength;
    // Start as a negative xOffset to be put in middle.
    let xOffset = -(totalLength / 2);

    for (let flag of this.flagSymbols) {
      const flagSymbolTexture = new PIXI.Texture(
        loader.resources["flagSymbols"].texture
      );

      const flagTextureX =
        10 * (flag.pointValue - 1) +
        this._findFlagSymbolTextureOffset(
          flag.attackersContesting,
          flag.defendersContesting
        );
      const flagTextureY = 0;

      const flagSymbolTextureFrame = new PIXI.Rectangle(
        flagTextureX,
        flagTextureY,
        10,
        13
      );

      const flagSymbolSprite = new PIXI.Sprite(flagSymbolTexture);
      flagSymbolSprite.texture.frame = flagSymbolTextureFrame;
      // Set texture frame based off of side and flag/buoy point value
      flagSymbolSprite.anchor.x = 0.5;
      flagSymbolSprite.anchor.y = 0.5;
      // flagSymbolSprite.zIndex = 48;
      flagSymbolSprite.zIndex = 49;

      const { spaceX, spaceY } = calculateGameToSpritePosition(this.x, this.y);
      const { removeSprite, setSpriteOffset } = this.game.mapBody.addSprite(
        flagSymbolSprite,
        spaceX + xOffset,
        spaceY + yOffset
      );

      const spriteHandler = {
        sprite: flagSymbolSprite,
        removeSprite,
        xOffset,
        yOffset,
        setPosition: (x, y) => {
          setSpriteOffset(x, y);
        },
      };
      this.flagSymbolsSprites.push(spriteHandler);
      this.game.stage.addChild(flagSymbolSprite);

      xOffset += 14;
    }
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
    this.setNamePosition(spaceX, spaceY - 68);
    this.setFillBarPosition(spaceX, spaceY - 20);
    this.setInfluencePosition(spaceX, spaceY);

    // Update position of flag symbols above ship
    for (let spriteHandler of this.flagSymbolsSprites) {
      const { setPosition, xOffset, yOffset } = spriteHandler;
      setPosition(spaceX + xOffset, spaceY + yOffset);
    }
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
   * Will animate a cannon shot turn.
   * Example input data:
   * shoot([true,true], "left", 3, false);
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
      cannonSprite.zIndex = 48;

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

  /**
   * Will play an explosion (hit) effect on the board at x/y coordinate.
   * @param {number} boardX
   * @param {number} boardY
   */
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

  /**
   * Will play/animate a missing effect (cannon splash) on the board at x/y coordinate.
   * @param {number} boardX
   * @param {number} boardY
   */
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

  /**
   * Will play/animate a shooting effect (smoke from initial cannon shot) on top of the ship
   * @param {CannonType} cannonType
   */
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

  /**
   * Will start the sinking animation of this ship.
   */
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
      onComplete: () => {},
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
            finalPosition: { x: originalX, y: originalY },
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

    const turnalDistance = cancelledTurnal || cancelledMovement ? 0 : 1;
    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.vX - turnalDistance;
        targetY = this.vY + 1;
        toOrientation = orientation.WEST;
        break;
      case orientation.NORTH:
        targetX = this.vX + turnalDistance;
        targetY = this.vY - 1;
        toOrientation = orientation.EAST;
        break;
      case orientation.WEST:
        targetX = this.vX - 1;
        targetY = this.vY - turnalDistance;
        toOrientation = orientation.NORTH;
        break;
      case orientation.EAST:
        targetX = this.vX + 1;
        targetY = this.vY + turnalDistance;
        toOrientation = orientation.SOUTH;
        break;
    }

    // Animation
    this._startTextureAnim(toOrientation, "RIGHT");

    // TODO Maybe add a 'small' bump animation for cancelled movements on turns
    if (cancelledMovement) return;

    // Movement
    if (cancelledTurnal) {
      this.animateTo(this.x, this.y, targetX, targetY, false);
    } else this._startMovementAnim(targetX, targetY, "RIGHT");
  }

  moveRightReverse(cancelledMovement, cancelledTurnal) {
    let targetX = 0;
    let targetY = 0;
    let toOrientation = orientation.NORTH;

    const turnalDistance = cancelledTurnal ? 0 : 1;

    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.vX - turnalDistance;
        targetY = this.vY - 1;
        toOrientation = orientation.EAST;
        break;
      case orientation.NORTH:
        targetX = this.vX + turnalDistance;
        targetY = this.vY + 1;
        toOrientation = orientation.WEST;
        break;
      case orientation.WEST:
        targetX = this.vX + 1;
        targetY = this.vY - turnalDistance;
        toOrientation = orientation.SOUTH;
        break;
      case orientation.EAST:
        targetX = this.vX - 1;
        targetY = this.vY + turnalDistance;
        toOrientation = orientation.NORTH;
        break;
    }

    // Animation
    this._startTextureAnimReverse(toOrientation, "RIGHT");

    // TODO Maybe add a 'small' bump animation for cancelled movements on turns
    if (cancelledMovement) return;

    // Movement
    this._startMovementAnim(targetX, targetY, "RIGHT", true);
  }

  _startTextureAnimReverse(toOrientation, toDirection) {
    let currentFrameId = this.getFrameByOrientation(this.faceDirection);
    const shipRect = new PIXI.Rectangle(0, 0, 0, 0);

    let frameCounter = 0;
    const textureAnimId = setInterval(() => {
      if (toDirection === "RIGHT" && currentFrameId === 0) currentFrameId = 15;
      else if (toDirection === "LEFT" && currentFrameId === 15)
        currentFrameId = 0;

      const { x, y, width, height } = this.type.orientations.orientations[
        currentFrameId
      ];

      shipRect.x = x;
      shipRect.y = y;
      shipRect.width = width;
      shipRect.height = height;

      this.sprite.texture.frame = shipRect;
      if (toDirection === "RIGHT") currentFrameId--;
      else if (toDirection === "LEFT") currentFrameId++;

      frameCounter++;

      if (frameCounter > 4) {
        clearInterval(textureAnimId);
        this.setOrientation(toOrientation);
      }
    }, this.textureChangeDelay);
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

  moveAngular(moveSettings, fromAngleOffset, toAngleOffset) {
    const { origXOffset, origYOffset, targetX, targetY } = moveSettings;
    const ORIGIN_X = this.vX + origXOffset;
    const ORIGIN_Y = this.vY + origYOffset;

    let fromAngle = (fromAngleOffset * Math.PI) / 2;
    let toAngle = (toAngleOffset * Math.PI) / 2;
    let currentAngle = fromAngle;

    const deltaInterval = (toAngleOffset - fromAngleOffset) / 25;

    const animationTicker = new PIXI.Ticker();
    animationTicker.add((deltaTime) => {
      currentAngle += deltaInterval * deltaTime;

      const toX = ORIGIN_X + Math.cos(currentAngle);
      const toY = ORIGIN_Y + Math.sin(currentAngle);

      this.setGamePosition(toX, toY);

      // Stopping edge case
      if (deltaInterval < 0) {
        // Negative interval
        if (currentAngle <= toAngle) {
          animationTicker.stop();
          this.setPosition(targetX, targetY);
        }
      } else if (currentAngle >= toAngle) {
        animationTicker.stop();
        this.setPosition(targetX, targetY);
      }
    });

    animationTicker.start();
  }

  _startMovementAnim(targetX, targetY, toSide, reverse = false) {
    toSide = toSide.toLowerCase();

    let sideAngleOffset;
    sideAngleOffset = toSide === "right" ? -1 : 1;

    const fromOrientation = this.faceDirection;

    let fromAngleOffset =
      fromOrientation.angleOffset + (reverse ? sideAngleOffset : 0);
    let toAngleOffset = fromAngleOffset + sideAngleOffset;

    const moveSettings = {
      targetX,
      targetY,
      origXOffset: fromOrientation[toSide].x,
      origYOffset: fromOrientation[toSide].y,
    };
    this.moveAngular(moveSettings, toAngleOffset, fromAngleOffset);
  }

  moveLeft(cancelledMovement, cancelledTurnal) {
    let targetX = 0;
    let targetY = 0;
    let toOrientation = orientation.NORTH;

    const turnalDistance = cancelledTurnal ? 0 : 1;

    switch (this.faceDirection) {
      case orientation.SOUTH:
        targetX = this.vX + turnalDistance;
        targetY = this.vY + 1;
        toOrientation = orientation.EAST;
        break;
      case orientation.NORTH:
        targetX = this.vX - turnalDistance;
        targetY = this.vY - 1;
        toOrientation = orientation.WEST;
        break;
      case orientation.WEST:
        targetX = this.vX - 1;
        targetY = this.vY + turnalDistance;
        toOrientation = orientation.SOUTH;
        break;
      case orientation.EAST:
        targetX = this.vX + 1;
        targetY = this.vY - turnalDistance;
        toOrientation = orientation.NORTH;
        break;
    }

    // Animation
    this._startTextureAnim(toOrientation, "LEFT");
    // Movement
    if (cancelledMovement) return;

    if (cancelledTurnal) {
      this.animateTo(this.x, this.y, targetX, targetY, false);
    } else this._startMovementAnim(targetX, targetY, "LEFT");
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
