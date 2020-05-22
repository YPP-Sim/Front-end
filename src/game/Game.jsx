import React, { Component } from "react";
import * as PIXI from "pixi.js";
import SpriteBody from "./SpriteBody";
import Ship from "./Ship";
import ShipType from "./ShipType";
import Orientation from "./Orientation";

import resourcePairs from "./resources";

import io from "socket.io-client";
import SocketController from "./SocketController";

const ENDPOINT = "http://127.0.0.1:4000";

const socket = io(ENDPOINT);

const defaultMap = [
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 13, 0, 11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [15, 0, 14, 0, 10, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 7, 8, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [15, 6, 5, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [15, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0],
];

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

class Game extends Component {
  constructor(props) {
    super(props);

    this.pixi_cnt = null;
    const renderer = new PIXI.Renderer({
      width: 600,
      height: 600,
      transparent: false,
      backgroundColor: 0x6a819c, // A hex color code
      resolution: window.devicePixelRatio,
    });

    this.stage = new PIXI.Container();
    this.stage.sortableChildren = true;
    this.app = renderer;
    this.state = { app: this.app };
    this.loader = null;

    // Will save some textures from spritesheets for later use.
    this.textures = {};
    // Save sprite handles from setup() to edit in game later
    this.sprites = {};

    this.map = defaultMap;
    this.mapBody = new SpriteBody(null, 100, 250);
    this.ships = {};

    this.socketController = new SocketController(socket, this);

    this.setupLoaded = false;
  }

  componentDidMount() {
    this.socketController.registerEvents();
  }

  componentWillUnmount() {
    this.socketController.unregisterEvents();
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
    let res;
    for (res of resourcePairs) loader.add(res.name, res.image);

    loader.load((loader, resources) => {
      this.setupLoaded = true;
      this.loadMapSpritesheets(resources);
      const rocks = this.loadMap();
      this.reRenderRocks(rocks);
      this.loadShipUI(resources);
      this.oldTime = Date.now();

      requestAnimationFrame(this.animate.bind(this));
    });
  };

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

  /**
   *
   * @param {string} shipId  Usually the name of the player that owns the ship
   * @param {ShipType} type   The type of the ship, e.g, war frig, xebec.
   * @param {Orientation} orientation   The starting orientation the ship will face, Default is SOUTH
   * @param {number} boardX   The x position on the map board.
   * @param {number} boardY   The y position on the map boar
   */
  addShip(shipId, type, boardX, boardY, orientation = Orientation.SOUTH) {
    if (!this.setupLoaded) {
      console.log("Tried to add ship before textures were loaded...");
      return;
    }

    const ship = new Ship(ShipType.warFrig, this);
    ship.loadSprites();
    ship.setOrientation(orientation);
    ship.setPosition(boardX, boardY);
    this.ships[shipId] = ship;
  }

  /**
   *
   * @param {string} shipId  The id of the ship to get.
   * @returns {Ship} The ship retrieved, or null if no ship recognized with that name.
   */
  getShip(shipId) {
    return this.ships[shipId];
  }

  loadMapSpritesheets(resources) {
    // Regular cells
    const cellRect = new PIXI.Rectangle(0, 0, 64, 48);
    const c0_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    const c1_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    const c2_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    const c3_t = new PIXI.Texture(resources["cell"].texture, cellRect);
    cellRect.x += 64;
    const c4_t = new PIXI.Texture(resources["cell"].texture, cellRect);

    this.textures["cell_0"] = c0_t;
    this.textures["cell_1"] = c1_t;
    this.textures["cell_2"] = c2_t;
    this.textures["cell_3"] = c3_t;
    this.textures["cell_4"] = c4_t;

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

    movesBgSprite.zIndex = 51;
    shipStatusBgSprite.zIndex = 52;
    shipStatusBorderSprite.zIndex = 52;
    shiphandSprite.zIndex = 52;
    hourglassSprite.zIndex = 52;
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

    const movesBody = new SpriteBody(movesBgSprite, 175, this.app.height - 95);

    leftSprite.zIndex = 52;
    rightSprite.zIndex = 52;
    forwardSprite.zIndex = 52;

    movesBody.addSprite(shiphandSprite, 55, -1);
    movesBody.addSprite(hourglassSprite, 130, 25);
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
    stage.addChild(hourglassSprite);

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
    let cell_id;

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
        this.setCenterAnchor(cellSprite);

        const { spaceX, spaceY } = calculateGameToSpritePosition(x, y);

        mapBody.addSprite(cellSprite, spaceX, spaceY);

        this.stage.addChild(cellSprite);
      }
    }

    return rocks;
  }

  reRenderRocks(rocks) {
    let rockData;
    for (rockData of rocks) {
      const { spaceX, spaceY } = calculateGameToSpritePosition(
        rockData.x,
        rockData.y
      );
      const rockSprite = new PIXI.Sprite(this.getCellTexture(rockData.id));
      rockSprite.zIndex = 50;
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
    return <div ref={this.updatePixiContainer}></div>;
  }
}

export default Game;
