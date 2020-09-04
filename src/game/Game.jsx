import React, { Component } from "react";
import * as PIXI from "pixi.js";
import SpriteBody from "./SpriteBody";
import Ship from "./Ship";
import ShipType from "./ShipType";
import Orientation, { getOrientationByName } from "./Orientation";
import resourcePairs from "./resources";
import SocketController from "./SocketController";
import styled from "styled-components";
import WindType from "./WindType";
import Flag from "./Flag";
import PlayerMoves from "./PlayerMoves";

let loaderLoaded = false;

const GameContainer = styled.div`
  width: 100%;
  height: 20%;
`;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRock(cell_id) {
  switch (cell_id) {
    case 13:
    case 14:
    case 15:
    case 16:
      return true;
    default:
      return false;
  }
}

export function calculateGameToSpritePosition(x, y) {
  const spaceX = (x / 2) * 64 + y * 32;
  const spaceY = y * 48 + x * -24 - y * 24;
  return { spaceX, spaceY };
}

function removeContextMenu(event) {
  event.preventDefault();
}

class Game extends Component {
  constructor(props) {
    super(props);

    this.pixi_cnt = null;
    const width = props.width || 600;
    const height = props.height || 600;
    const realApp = new PIXI.Application({
      // width,
      // height,
      transparent: false,
      backgroundColor: 0x6a819c, // A hex color code
      resolution: window.devicePixelRatio,
      autoResize: true,
    });
    this.resizeRatio = width / height;

    this.realApp = realApp;
    this.stage = new PIXI.Container();
    this.stage.sortableChildren = true;
    this.app = realApp.renderer;
    this.state = { app: this.app };
    this.loader = null;

    //TODO eventually scale code will be apart of zooming in/out feature!
    this.stage.scale.x = 1;
    this.stage.scale.y = 1;

    // Will save some textures from spritesheets for later use.
    this.textures = {};
    // Save sprite handles from setup() to edit in game later
    this.sprites = {};

    this.gameId = props.gameId;
    this.map = props.map;
    this.mapBody = new SpriteBody(null, 100, 250);
    this.ships = {};
    this.socket = props.socket;
    this.socketController = new SocketController(this.socket, this);

    this.setupLoaded = false;
    this.currentGameTick = 0;

    this.gameData = props.gameData;
    this.flags = {};

    if (this.gameData.thisPlayer && this.gameData.thisPlayer.shipData)
      this.playerMoves = new PlayerMoves(
        this.gameData.thisPlayer.shipData.dualCannon
      );

    this.preventMovementInteraction = false;
  }

  initFlags() {
    for (let flag of this.gameData.flags) {
      this.flags[flag.id] = new Flag(flag.x, flag.y, flag.pointValue, this);
    }
  }

  resize() {
    const parent = this.app.view.parentNode;

    // Resize the renderer

    const toW = window.innerWidth - 300;
    const toH = 600;
    this.app.resize(toW, toH);

    // Move the movesBody/shiphand UI
    if (this.movesBody) this.movesBody.setPosition(175, toH - 95);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.socketController.registerEvents();
    this.resize();
    this.pixi_cnt.addEventListener("contextmenu", removeContextMenu);
  }

  componentWillUnmount() {
    this.socketController.unregisterEvents();

    window.removeEventListener("resize", this.resize.bind(this));
    this.pixi_cnt.removeEventListener("contextmenu", removeContextMenu);
  }

  updatePixiContainer = (el) => {
    this.pixi_cnt = el;

    if (this.pixi_cnt && this.pixi_cnt.children.length <= 0)
      this.pixi_cnt.appendChild(this.state.app.view);

    this.setup();
  };

  /**
   * Loads all the graphics into Pixi.js
   */
  setup = () => {
    let loader = PIXI.Loader.shared;
    this.loader = loader;

    // Load resources from resources.js
    if (!loaderLoaded) {
      let res;
      for (res of resourcePairs) loader.add(res.name, res.image);

      loaderLoaded = true;
    }

    loader.load((loader, resources) => {
      this.setupLoaded = true;
      this.loadMapSpritesheets(resources);
      const rocks = this.loadMap();
      this.reRenderRocks(rocks);
      this.loadShipUI(resources);
      this.oldTime = Date.now();
      this.initPlayerShips();
      this.initFlags();
      requestAnimationFrame(this.animate.bind(this));
    });
  };

  initPlayerShips() {
    for (let player of this.gameData.attackers) {
      const { playerName, shipData } = player;
      if (!shipData) continue;
      this.addShip(
        playerName,
        shipData.shipType,
        shipData.boardX,
        shipData.boardY,
        shipData.orientation,
        "ATTACKER"
      );
    }
    for (let player of this.gameData.defenders) {
      const { playerName, shipData } = player;
      if (!shipData) continue;
      this.addShip(
        playerName,
        shipData.shipType,
        shipData.boardX,
        shipData.boardY,
        shipData.orientation,
        "DEFENDER"
      );
    }
  }

  animate() {
    var newTime = Date.now();
    var deltaTime = newTime - this.oldTime;
    this.oldTime = newTime;
    if (deltaTime < 0) deltaTime = 0;
    if (deltaTime > 1000) deltaTime = 1000;
    // var deltaFrame = (deltaTime * 60) / 1000; //1.0 is for single frame

    // update your game there
    // sprite.rotation += 0.1 * deltaFrame;

    this.app.render(this.stage);

    requestAnimationFrame(this.animate.bind(this));
  }

  clearActivityBars() {
    for (let pShipName in this.ships) {
      const pShip = this.ships[pShipName];
      pShip.setBarMovements(0);
    }
  }

  /**
   *
   * @param {string} shipId  Usually the name of the player that owns the ship
   * @param {ShipType} type   The type of the ship, e.g, war frig, xebec.
   * @param {Orientation} orientation   The starting orientation the ship will face, Default is SOUTH
   * @param {number} boardX   The x position on the map board.
   * @param {number} boardY   The y position on the map boar
   */
  addShip(
    shipId,
    type,
    boardX,
    boardY,
    orientation = Orientation.SOUTH,
    team = "UNDECIDED"
  ) {
    if (!this.setupLoaded) {
      console.log("Tried to add ship before textures were loaded...");
      return;
    }

    const ship = new Ship(ShipType.warFrig, this, shipId, team);
    ship.loadSprites();
    if (typeof orientation === "string")
      ship.setOrientation(getOrientationByName(orientation));
    else ship.setOrientation(orientation);
    ship.setPosition(boardX, boardY);
    this.ships[shipId] = ship;

    return ship;
  }

  /**
   *
   * @param {string} shipId  The id of the ship to get.
   * @returns {Ship} The ship retrieved, or null if no ship recognized with that name.
   */
  getShip(shipId) {
    return this.ships[shipId];
  }

  updateFlags(flagDataArray) {
    // Clear flag symbols for all players to start out
    for (let shipName in this.ships) {
      const ship = this.getShip(shipName);
      if (!ship) continue;
      ship.flagSymbols = [];
    }

    for (let flag of flagDataArray) {
      for (let contestingPlayer of flag.playersContesting) {
        const ship = this.getShip(contestingPlayer);
        if (!ship) continue;
        ship.flagSymbols.push(flag);
      }

      const clientFlag = this.flags[flag.id];
      if (!clientFlag) continue;

      if (!flag.attackersContesting && !flag.defendersContesting) {
        clientFlag.setCapturedStatus(0);
        continue;
      }

      if (flag.attackersContesting && flag.defendersContesting) {
        clientFlag.setCapturedStatus(3);
        continue;
      }

      const side = this.gameData.thisPlayer.side;
      if (flag.attackersContesting) {
        if (side === "ATTACKER") clientFlag.setCapturedStatus(4);
        else clientFlag.setCapturedStatus(1);
        continue;
      }

      if (flag.defendersContesting) {
        if (side === "DEFENDER") clientFlag.setCapturedStatus(4);
        else clientFlag.setCapturedStatus(2);
      }
    }

    // update Ship flag symbols
    this._updateShipFlagSymbols();
  }

  _updateShipFlagSymbols() {
    for (let shipName in this.ships) {
      const ship = this.getShip(shipName);
      ship.updateContestedFlags();
    }
  }

  loadMapSpritesheets(resources) {
    // Regular cells
    let cellRect = new PIXI.Rectangle(0, 0, 64, 48);
    let c0_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    let c1_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    let c2_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    let c3_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    let c4_t = new PIXI.Texture(resources["cell"].texture, cellRect);

    this.textures["cell_0"] = c0_t;
    this.textures["cell_1"] = c1_t;
    this.textures["cell_2"] = c2_t;
    this.textures["cell_3"] = c3_t;
    this.textures["cell_4"] = c4_t;

    // Safezone cells
    cellRect = new PIXI.Rectangle(0, 0, 64, 48);
    c0_t = new PIXI.Texture(resources["safezone"].texture, cellRect);
    cellRect.x += 64;
    c1_t = new PIXI.Texture(resources["safezone"].texture, cellRect);
    cellRect.x += 64;
    c2_t = new PIXI.Texture(resources["safezone"].texture, cellRect);
    cellRect.x += 64;
    c3_t = new PIXI.Texture(resources["safezone"].texture, cellRect);
    cellRect.x += 64;
    c4_t = new PIXI.Texture(resources["safezone"].texture, cellRect);

    this.textures["safezone_0"] = c0_t;
    this.textures["safezone_1"] = c1_t;
    this.textures["safezone_2"] = c2_t;
    this.textures["safezone_3"] = c3_t;
    this.textures["safezone_4"] = c4_t;

    // Winds
    const windRect = new PIXI.Rectangle(0, 0, 64, 48);
    const rightWind = new PIXI.Texture(resources["wind"].texture, windRect);
    windRect.x += 64;
    const downWind = new PIXI.Texture(resources["wind"].texture, windRect);
    windRect.x += 64;
    const leftWind = new PIXI.Texture(resources["wind"].texture, windRect);
    windRect.x += 64;
    const upWind = new PIXI.Texture(resources["wind"].texture, windRect);

    this.textures["rightWind"] = rightWind;
    this.textures["downWind"] = downWind;
    this.textures["leftWind"] = leftWind;
    this.textures["upWind"] = upWind;

    // Whirlpools

    const whirlRect = new PIXI.Rectangle(0, 0, 64, 48);
    const whirl1 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;
    const whirl2 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;
    const whirl3 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;
    const whirl4 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;

    // Reverse whirlpool
    const revWhirl1 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;
    const revWhirl2 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;
    const revWhirl3 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;
    const revWhirl4 = new PIXI.Texture(resources["whirl"].texture, whirlRect);
    whirlRect.x += 64;

    this.textures["whirl1"] = whirl1;
    this.textures["whirl2"] = whirl2;
    this.textures["whirl3"] = whirl3;
    this.textures["whirl4"] = whirl4;

    this.textures["revWhirl1"] = revWhirl1;
    this.textures["revWhirl2"] = revWhirl2;
    this.textures["revWhirl3"] = revWhirl3;
    this.textures["revWhirl4"] = revWhirl4;

    const rocksRec = new PIXI.Rectangle(0, 0, 58.5, 69);
    const rocks1 = new PIXI.Texture(resources["rocksBig"].texture, rocksRec);
    rocksRec.x += 58.5;
    const rocks2 = new PIXI.Texture(resources["rocksBig"].texture, rocksRec);
    rocksRec.x += 58.5;
    const rocks3 = new PIXI.Texture(resources["rocksBig"].texture, rocksRec);
    rocksRec.x += 58.5;
    const rocks4 = new PIXI.Texture(resources["rocksBig"].texture, rocksRec);

    this.textures["rocks1"] = rocks1;
    this.textures["rocks2"] = rocks2;
    this.textures["rocks3"] = rocks3;
    this.textures["rocks4"] = rocks4;
  }

  loadShipUI(resources) {
    const movesBgSprite = this.createSprite("movesBackground");
    const shipStatusBgSprite = this.createSprite("shipStatus");
    const shipStatusBorderSprite = this.createSprite("shipStatusBorder");
    const shiphandSprite = this.createSprite("shiphand");
    const hourglassSprite = this.createSprite("hourglass");
    const movesTitle = this.createSprite("movesTitle");
    const sandTop = this.createSprite("sandTop");
    const sandBot = this.createSprite("sandBot");

    const sandTrickleFrame = new PIXI.Rectangle(0, 0, 2, 43);
    const sandTrickle = new PIXI.Sprite(resources["sandTrickle"].texture);
    sandTrickle.texture.frame = sandTrickleFrame;

    sandTrickle.zIndex = 55;

    const sandTrickleTicker = new PIXI.Ticker();

    let targetTimeDelay = 70;
    let totalTimePassed = 0;
    sandTrickleTicker.add(() => {
      if (totalTimePassed >= targetTimeDelay) {
        totalTimePassed = 0;
        if (sandTrickleFrame.x >= 3) sandTrickleFrame.x = 0;
        else sandTrickleFrame.x += 2;

        sandTrickle.texture.frame = sandTrickleFrame;
      } else totalTimePassed += sandTrickleTicker.elapsedMS;
    });
    sandTrickleTicker.start();

    const sandTrickleMask = new PIXI.Graphics();
    sandTrickleMask.beginFill(0xde3249);
    sandTrickleMask.drawRect(-0, 0, 5, 43);
    sandTrickleMask.endFill();
    sandTrickleMask.zIndex = 100;
    sandTrickle.mask = sandTrickleMask;

    movesBgSprite.interactive = true;
    movesBgSprite.on("pointerdown", () => {
      this.bgClicked = true;
    });

    movesBgSprite.zIndex = 51;
    shipStatusBgSprite.zIndex = 52;

    shipStatusBorderSprite.zIndex = 65;
    shiphandSprite.zIndex = 52;
    hourglassSprite.zIndex = 53;
    sandTop.zIndex = 54;
    sandBot.zIndex = 54;
    movesTitle.zIndex = 52;

    const gunTokenTexture = new PIXI.Texture(
      resources["gunToken"].texture,
      new PIXI.Rectangle(25, 0, 25, 25)
    );

    const autoButtonSprite = this.createSprite("autoOn");
    autoButtonSprite.interactive = true;
    autoButtonSprite.zIndex = 52;
    autoButtonSprite.buttonMode = true;
    autoButtonSprite.on("pointerdown", () => {
      //Toggle
      this.shipData.autoTokens = !this.shipData.autoTokens;
      if (this.shipData.autoTokens) {
        autoButtonSprite.texture = resources["autoOn"].texture;
        this.sprites["selectToken"].texture = this.textures["graySelectToken"];
      } else {
        autoButtonSprite.texture = resources["autoOff"].texture;
        this.sprites["selectToken"].texture = this.textures[
          "brightSelectToken"
        ];
      }
    });

    this.sprites["autoButton"] = autoButtonSprite;

    const gunTokenSprite = new PIXI.Sprite(gunTokenTexture);
    gunTokenSprite.zIndex = 52;
    this.setCenterAnchor(gunTokenSprite);

    // Texts ---------------------

    const textStyle = new PIXI.TextStyle({
      fontSize: 14,
    });

    const autoText = new PIXI.Text("Auto", textStyle);

    const rightTokenAmount = new PIXI.Text("x1", textStyle);
    this.setCenterAnchor(rightTokenAmount);
    const leftTokenAmount = new PIXI.Text("x1", textStyle);
    this.setCenterAnchor(leftTokenAmount);
    const forwardTokenAmount = new PIXI.Text("x1", textStyle);
    this.setCenterAnchor(forwardTokenAmount);
    const gunTokenAmount = new PIXI.Text("x1", textStyle);
    this.setCenterAnchor(gunTokenAmount);

    autoText.zIndex = 52;
    gunTokenAmount.zIndex = 52;
    forwardTokenAmount.zIndex = 52;
    rightTokenAmount.zIndex = 52;
    leftTokenAmount.zIndex = 52;

    this.sprites["forwardTokenAmount"] = forwardTokenAmount;
    this.sprites["rightTokenAmount"] = rightTokenAmount;
    this.sprites["leftTokenAmount"] = leftTokenAmount;
    this.sprites["gunTokenAmount"] = gunTokenAmount;

    // ----- Token highlights

    const brightSelectTexture = new PIXI.Texture(
      resources["selectBox"].texture,
      new PIXI.Rectangle(0, 0, 36, 36)
    );
    const graySelectTexture = new PIXI.Texture(
      resources["selectBox"].texture,
      new PIXI.Rectangle(36, 0, 36, 36)
    );

    this.textures["graySelectToken"] = graySelectTexture;
    this.textures["brightSelectToken"] = brightSelectTexture;

    const selectTokenSprite = new PIXI.Sprite(graySelectTexture);
    selectTokenSprite.zIndex = 52;
    this.setCenterAnchor(selectTokenSprite);
    this.sprites["selectToken"] = selectTokenSprite;

    // Move tokens---------------------------------------
    const movesTexture = resources["moves"].texture;
    const moveRect = new PIXI.Rectangle(0, 0, 28, 28);

    // Left token
    const leftTexture = new PIXI.Texture(movesTexture, moveRect);
    this.textures["leftToken"] = leftTexture;
    const leftSprite = new PIXI.Sprite(leftTexture);
    this.setCenterAnchor(leftSprite);
    this.sprites["leftTokens"] = leftSprite;

    // Forward token
    moveRect.x += 28;
    const forwardTexture = new PIXI.Texture(movesTexture, moveRect);
    this.textures["forwardToken"] = forwardTexture;
    const forwardSprite = new PIXI.Sprite(forwardTexture);
    this.setCenterAnchor(forwardSprite);
    this.sprites["forwardTokens"] = forwardSprite;

    // Right Token
    moveRect.x += 28;
    const rightTexture = new PIXI.Texture(movesTexture, moveRect);
    this.textures["rightToken"] = rightTexture;
    const rightSprite = new PIXI.Sprite(rightTexture);
    this.setCenterAnchor(rightSprite);
    this.sprites["rightTokens"] = rightSprite;

    const parent = this.app.view.parentNode;

    const initialY = parent.clientHeight - 3;
    const movesBody = new SpriteBody(movesBgSprite, 175, initialY - 95);
    this.movesBody = movesBody;
    leftSprite.zIndex = 52;
    rightSprite.zIndex = 52;
    forwardSprite.zIndex = 52;

    // Sand masks
    const sandTopMask = new PIXI.Graphics();
    sandTopMask.beginFill(0xde3249);
    sandTopMask.drawRect(-180, -21, 19, 43);
    sandTopMask.endFill();
    sandTopMask.zIndex = 100;
    sandTop.mask = sandTopMask;

    const sandBotMask = new PIXI.Graphics();
    sandBotMask.beginFill(0xde3249);
    sandBotMask.drawRect(-180, 23 + 43, 19, 43);
    sandBotMask.endFill();
    sandBotMask.zIndex = 100;
    sandBot.mask = sandBotMask;

    this.setMaskPosition = (tick) => {
      let maskY = initialY - 92 + (tick / 35) * 43;
      sandTopMask.y = maskY;

      maskY = initialY - 91 - (tick / 35) * 43;
      sandBotMask.y = maskY;

      maskY = initialY - 68 - (tick / 35) * 43;
      sandTrickleMask.y = maskY;
    };

    // Ship move buttons/sprites
    this.addShipHandTurnButtonsSprites(resources, movesBody);
    // Ship gun sprites
    this._addShiphandGuns(true, resources);
    // Ship status display (bilge/damage)
    this.createStatsDisplay(resources);

    movesBody.addSprite(shiphandSprite, 55, -1);
    movesBody.addSprite(hourglassSprite, 130, 25);
    movesBody.addSprite(sandTop, 130, 3);
    movesBody.addSprite(sandTopMask, 300, 3);
    movesBody.addSprite(sandBot, 130, 47);
    movesBody.addSprite(sandBotMask, 300, 3);
    movesBody.addSprite(sandTrickle, 129, 26);
    movesBody.addSprite(sandTrickleMask, 129, 26);
    movesBody.addSprite(shipStatusBgSprite, 130, -50);
    movesBody.addSprite(shipStatusBorderSprite, 130, -50);
    movesBody.addSprite(movesTitle, -60, -57);
    movesBody.addSprite(autoText, -145, -30);

    movesBody.addSprite(leftSprite, -75, 10);
    movesBody.addSprite(forwardSprite, -45, 10);
    movesBody.addSprite(rightSprite, -15, 10);
    movesBody.addSprite(selectTokenSprite, -45, 10);

    movesBody.addSprite(leftTokenAmount, -75, 35);
    movesBody.addSprite(forwardTokenAmount, -45, 35);
    movesBody.addSprite(rightTokenAmount, -15, 35);

    movesBody.addSprite(gunTokenAmount, -108, 35);
    movesBody.addSprite(gunTokenSprite, -108, 10);

    movesBody.addSprite(autoButtonSprite, -100, -23);

    const stage = this.stage;

    stage.addChild(movesBgSprite);
    stage.addChild(shiphandSprite);
    stage.addChild(sandTop);
    stage.addChild(sandBot);
    stage.addChild(sandTrickleMask);
    stage.addChild(hourglassSprite);
    stage.addChild(sandTopMask);
    stage.addChild(sandBotMask);
    stage.addChild(sandTrickle);
    stage.addChild(shipStatusBgSprite);
    stage.addChild(shipStatusBorderSprite);

    stage.addChild(movesTitle);
    stage.addChild(autoText);

    //Tokens
    stage.addChild(leftSprite);
    stage.addChild(forwardSprite);
    stage.addChild(rightSprite);

    stage.addChild(leftTokenAmount);
    stage.addChild(rightTokenAmount);
    stage.addChild(forwardTokenAmount);
    stage.addChild(gunTokenAmount);

    stage.addChild(selectTokenSprite);

    stage.addChild(gunTokenSprite);
    stage.addChild(autoButtonSprite);
  }

  createStatsDisplay(resources) {
    // ------------------ Damage ---------------------
    const damageSprite = new PIXI.Sprite(
      new PIXI.Texture(resources["damageStatus"].texture)
    );
    damageSprite.zIndex = 59;

    const damageMask = new PIXI.Graphics();
    damageMask.beginFill(0xde3249);
    damageMask.arc(0, 0, 19, 0, Math.PI);
    damageMask.endFill();
    damageMask.zIndex = 100;
    damageMask.angle = 270;

    this.stage.addChild(damageMask);
    this.movesBody.addSprite(damageMask, 130, -50);

    damageSprite.mask = damageMask;

    this.setDamageUIPercent = (percent) => {
      const angleToAdd = percent * 180;

      damageMask.angle = 270 + angleToAdd;
    };

    this.setCenterAnchor(damageSprite);
    this.movesBody.addSprite(damageSprite, 122, -50);
    this.stage.addChild(damageSprite);

    // ------------------- Bilge ----------------------
    const bilgeSprite = new PIXI.Sprite(
      new PIXI.Texture(resources["bilgeStatus"].texture)
    );
    bilgeSprite.zIndex = 59;

    const bilgeMask = new PIXI.Graphics();
    bilgeMask.beginFill(0xde3249);
    bilgeMask.arc(0, 0, 19, 0, Math.PI);
    bilgeMask.endFill();
    bilgeMask.zIndex = 100;
    bilgeMask.angle = 90;

    this.stage.addChild(bilgeMask);
    this.movesBody.addSprite(bilgeMask, 131, -50);

    bilgeSprite.mask = bilgeMask;

    this.setBilgeUIPercent = (percent) => {
      const angleToSubtract = percent * 180;

      bilgeMask.angle = 90 - angleToSubtract;
    };

    this.setCenterAnchor(bilgeSprite);
    this.movesBody.addSprite(bilgeSprite, 139, -50);
    this.stage.addChild(bilgeSprite);
  }

  _createTurnSprite(turnNumber, yOffset, resources, movesBody) {
    const turnSprite = new PIXI.Sprite(
      new PIXI.Texture(resources["movesShiphand"].texture)
    );
    const turnFrameRect = new PIXI.Rectangle(84, 0, 28, 28);
    turnSprite.texture.frame = turnFrameRect;
    turnSprite.interactive = true;
    turnSprite.on("pointerdown", (event) => {
      if (this.preventMovementInteraction) return;

      const buttonType = event.data.originalEvent.button;
      this.bgClicked = true;
      if (buttonType === 0) {
        // Left click
        if (turnFrameRect.x >= 84) turnFrameRect.x = 0;
        else turnFrameRect.x += 28;
      } else if (buttonType === 1) {
        // Middle mouse click
        turnFrameRect.x = 28;
      } else if (buttonType === 2) {
        // Right Click
        if (turnFrameRect.x <= 0) turnFrameRect.x = 84;
        else turnFrameRect.x -= 28;
      }

      let turnDirection = null;
      if (turnFrameRect.x === 0) turnDirection = "LEFT";
      else if (turnFrameRect.x === 28) turnDirection = "FORWARD";
      else if (turnFrameRect.x === 56) turnDirection = "RIGHT";

      this.socket.emit("setMove", {
        gameId: this.gameId,
        playerName: this.gameData.thisPlayer.playerName,
        moveData: {
          moveNumber: turnNumber,
          direction: turnDirection,
          leftGuns: [false, false],
          rightGuns: [false, false],
        },
      });

      turnSprite.texture.frame = turnFrameRect;
    });
    turnSprite.zIndex = 55;
    this.setCenterAnchor(turnSprite);

    movesBody.addSprite(turnSprite, 54, yOffset);
    this.stage.addChild(turnSprite);

    return () => {
      turnFrameRect.x = 84;
      turnSprite.texture.frame = turnFrameRect;
    };
  }

  _addShiphandGuns(dualCannon, resources) {
    if (!this.gameData.thisPlayer || !this.gameData.thisPlayer.shipData) return;

    const stage = this.stage;
    const movesBody = this.movesBody;
    const playerMoves = this.playerMoves;
    const socket = this.socket;
    const gameId = this.gameId;
    const playerName = this.gameData.thisPlayer.playerName;

    function createGunSprite_(x, y, gunTurn, side) {
      const gunSprite = new PIXI.Sprite(
        new PIXI.Texture(resources["cannonSlots"].texture)
      );
      const gunFrame = new PIXI.Rectangle(0, 0, dualCannon ? 32 : 16, 18);
      gunSprite.interactive = true;
      gunSprite.zIndex = 53;
      gunSprite.texture.frame = gunFrame;

      const filledGunFirstSprite = new PIXI.Sprite(
        new PIXI.Texture(resources["cannonSlots"].texture)
      );
      filledGunFirstSprite.zIndex = 54;
      filledGunFirstSprite.texture.frame = new PIXI.Rectangle(33, 0, 16, 18);

      let filledGunSecondSprite;

      if (dualCannon) {
        filledGunSecondSprite = new PIXI.Sprite(
          new PIXI.Texture(resources["cannonSlots"].texture)
        );
        filledGunSecondSprite.zIndex = 54;
        filledGunSecondSprite.texture.frame = new PIXI.Rectangle(33, 0, 16, 18);
      }

      gunSprite.on("pointerdown", () => {
        if (this.preventMovementInteraction) return;

        playerMoves.incrementNumberedTurnGuns(gunTurn, side, (gunData) => {
          if (gunData[0]) filledGunFirstSprite.visible = true;
          else filledGunFirstSprite.visible = false;

          if (gunData.length === 2) {
            if (gunData[1]) filledGunSecondSprite.visible = true;
            else filledGunSecondSprite.visible = false;
          }

          gunSprite.texture.frame = gunFrame;
          socket.emit("setGuns", {
            gameId,
            playerName,
            numberedTurn: gunTurn,
            side,
            gunData,
          });
        });
      });

      if (side === "LEFT") {
        gunSprite.anchor.x = 1;
        filledGunFirstSprite.anchor.x = 1;
        filledGunSecondSprite.anchor.x = 1;
        if (dualCannon) movesBody.addSprite(filledGunSecondSprite, x - 16, y);
      } else if (side === "RIGHT") {
        gunSprite.anchor.x = 0;
        filledGunSecondSprite.anchor.x = 0;
        filledGunFirstSprite.anchor.x = 0;

        if (dualCannon) movesBody.addSprite(filledGunSecondSprite, x + 16, y);
      }
      filledGunSecondSprite.visible = false;
      filledGunFirstSprite.visible = false;
      movesBody.addSprite(filledGunFirstSprite, x, y);
      movesBody.addSprite(gunSprite, x, y);
      stage.addChild(filledGunSecondSprite);
      stage.addChild(gunSprite);
      stage.addChild(filledGunFirstSprite);

      return () => {
        filledGunFirstSprite.visible = false;
        if (dualCannon) {
          filledGunSecondSprite.visible = false;
        }
      };
    }

    const createGunSprite = createGunSprite_.bind(this);

    const left1Clear = createGunSprite(40, -57, 1, "LEFT");
    const right1Clear = createGunSprite(69, -57, 1, "RIGHT");

    const left2Clear = createGunSprite(40, -23, 2, "LEFT");
    const right2Clear = createGunSprite(69, -23, 2, "RIGHT");

    const left3Clear = createGunSprite(40, 11, 3, "LEFT");
    const right3Clear = createGunSprite(69, 11, 3, "RIGHT");

    const left4Clear = createGunSprite(40, 45, 4, "LEFT");
    const right4Clear = createGunSprite(69, 45, 4, "RIGHT");

    this.clearUICannons = () => {
      left1Clear();
      right1Clear();

      left2Clear();
      right2Clear();

      left3Clear();
      right3Clear();

      left4Clear();
      right4Clear();
    };
  }

  addShipHandTurnButtonsSprites(resources, movesBody) {
    const clear1 = this._createTurnSprite(1, -48, resources, movesBody);
    const clear2 = this._createTurnSprite(2, -14, resources, movesBody);
    const clear3 = this._createTurnSprite(3, 20, resources, movesBody);
    const clear4 = this._createTurnSprite(4, 54, resources, movesBody);

    this.clearShipHand = () => {
      clear1();
      clear2();
      clear3();
      clear4();
    };
  }

  // A function that helps with readability when making sprites.
  createSprite(textureName) {
    const spr = new PIXI.Sprite(this.loader.resources[textureName].texture);
    this.setCenterAnchor(spr);
    return spr;
  }

  setCenterAnchor(sprite) {
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
  }

  updateShipPositions(playerData) {
    for (let player of playerData) {
      const { boardX, boardY, orientation, playerName } = player;
      const ship = this.getShip(playerName);
      if (!ship) continue;
      ship.setPosition(boardX, boardY);
      ship.setOrientation(getOrientationByName(orientation));
    }
  }

  executeGameTurns(playerMovements) {
    return new Promise(async (resolve) => {
      await this._executeMoves(1, playerMovements);
      resolve();
    });
  }

  async _executeMoves(numberedTurn, playerMovements) {
    return new Promise(async (resolve) => {
      if (numberedTurn > 4) {
        resolve();
        return;
      }

      const turnMovements = playerMovements["turn_" + numberedTurn];
      const turnWinds = playerMovements["turn_" + numberedTurn + "_winds"];
      const turnShots = playerMovements["turn_" + numberedTurn + "_shots"];
      const turnSinks = playerMovements["turn_" + numberedTurn + "_sinks"];

      // Initial Movement phase
      for (let turn of turnMovements) {
        const {
          playerName,
          direction,
          cancelledMovement,
          cancelledTurnal,
        } = turn;

        const ship = this.getShip(playerName);
        if (!ship) continue;

        ship.move(direction, cancelledMovement, cancelledTurnal);
      }
      if (turnMovements.length > 0) await sleep(1000);

      // Wind movement phase
      if (turnWinds.length > 0) {
        for (let windMove of turnWinds) {
          const ship = this.getShip(windMove.playerName);
          const windType = WindType[windMove.windType.type];
          ship.moveByOrientation(
            windType.direction,
            windMove.windType.cancelledMovement
          );
        }

        await sleep(800);
      }

      // Cannons phase
      if (turnShots.length > 0) {
        for (let shotData of turnShots) {
          const {
            playerName,
            leftGuns,
            rightGuns,
            rightGunEnd,
            leftGunEnd,
            leftHit,
            rightHit,
          } = shotData;
          // Do gun shooting animation;
          if (leftGuns[0])
            this.getShip(playerName).shoot(
              leftGuns,
              "left",
              leftGunEnd,
              leftHit
            );

          if (rightGuns[0])
            this.getShip(playerName).shoot(
              rightGuns,
              "right",
              rightGunEnd,
              rightHit
            );
        }
        await sleep(1200);
      }

      // Ship sinking phase
      if (turnSinks.length > 0) {
        for (let playerObj of turnSinks) {
          const { playerName } = playerObj;
          const ship = this.getShip(playerName);
          if (ship) {
            ship.playSinkingAnimation();
          }
        }
      }

      await this._executeMoves(++numberedTurn, playerMovements);
      resolve();
    });
  }

  /**
   *
   * @param mapData a 2D array of integers referencing cell data
   */
  setMap(mapData) {
    this.map = mapData;
  }

  /**
   * Maps the cell texture by their id's
   * @param {number} cell_id
   *
   * @returns The texture of the cell id.
   */
  getCellTexture(cell_id) {
    switch (cell_id) {
      case -1:
        return this.textures["safezone_3"];
      case 0:
        // const rNum = Math.floor(Math.random() * 5);
        return this.textures["cell_3"];
      case 1:
        return this.textures["upWind"];
      case 2:
        return this.textures["rightWind"];
      case 3:
        return this.textures["downWind"];
      case 4:
        return this.textures["leftWind"];

      case 5:
        return this.textures["whirl1"];

      case 6:
        return this.textures["whirl2"];

      case 7:
        return this.textures["whirl3"];

      case 8:
        return this.textures["whirl4"];

      case 9:
        return this.textures["revWhirl2"];

      case 10:
        return this.textures["revWhirl3"];

      case 11:
        return this.textures["revWhirl4"];

      case 12:
        return this.textures["revWhirl1"];

      case 13:
        return this.textures["rocks1"];

      case 14:
        return this.textures["rocks2"];

      case 15:
        return this.textures["rocks3"];

      case 16:
        return this.textures["rocks4"];

      default:
        return this.loader.resources["ocean"].texture;
    }
  }

  loadMap() {
    const mapBody = this.mapBody;

    const xSize = this.map[0].length;
    const ySize = this.map.length;

    const rocks = [];

    for (let x = 0; x < xSize; x++) {
      for (let y = 0; y < ySize; y++) {
        let cell_id = this.map[y][x];

        if (isRock(cell_id)) {
          rocks.push({ id: cell_id, x, y });
          cell_id = 0;
        }

        const cellSprite = new PIXI.Sprite(this.getCellTexture(cell_id));
        cellSprite.zIndex = 1;
        this.setCenterAnchor(cellSprite);

        const { spaceX, spaceY } = calculateGameToSpritePosition(x, y);

        mapBody.addSprite(cellSprite, spaceX, spaceY);

        this.stage.addChild(cellSprite);
      }
    }

    // Adding draggable map feature

    this._addDraggableMap();
    return rocks;
  }

  _addDraggableMap() {
    let dragging = false;

    let dX = 0;
    let dY = 0;

    let startingX = 0;
    let startingY = 0;

    this.app.interactive = true;
    this.app.plugins.interaction.on("pointerdown", (e) => {
      // Check if clicked on map and NOT ship UI
      if (this.bgClicked) return;

      dragging = true;

      startingX = e.data.global.x;
      startingY = e.data.global.y;
    });

    this.app.plugins.interaction.on("pointerup", () => {
      this.bgClicked = false;
      dragging = false;
    });

    this.app.plugins.interaction.on("pointermove", (e) => {
      if (!dragging) return;

      dX = e.data.global.x - startingX;
      dY = e.data.global.y - startingY;

      // Move map
      this.mapBody.moveRelative(dX, dY);

      startingX = e.data.global.x;
      startingY = e.data.global.y;
    });
  }

  reRenderRocks(rocks) {
    let rockData;
    for (rockData of rocks) {
      const { spaceX, spaceY } = calculateGameToSpritePosition(
        rockData.x,
        rockData.y
      );
      const rockSprite = new PIXI.Sprite(this.getCellTexture(rockData.id));
      rockSprite.zIndex = 40;
      // Center rocks onto tiles.
      switch (rockData.id) {
        case 13:
          rockSprite.anchor.x = 0.5;
          rockSprite.anchor.y = 0.58;
          break;
        case 14:
          rockSprite.anchor.x = 0.45;
          rockSprite.anchor.y = 0.55;
          break;
        case 15:
          rockSprite.anchor.x = 0.45;
          rockSprite.anchor.y = 0.55;
          break;
        case 16:
          rockSprite.anchor.x = 0.5;
          rockSprite.anchor.y = 0.7;
          break;
        default:
          this.setCenterAnchor(rockSprite);
      }

      this.mapBody.addSprite(rockSprite, spaceX, spaceY);
      this.stage.addChild(rockSprite);
    }
  }

  updateTokens() {}

  render() {
    return (
      <GameContainer id="game" ref={this.updatePixiContainer}></GameContainer>
    );
  }
}

export default Game;
