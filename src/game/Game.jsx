import React, { Component } from "react";
import * as PIXI from "pixi.js";
import SpriteBody from "./SpriteBody";
import ShipData from "./ShipData";

import resourcePairs from "./resources";

const defaultMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

class Game extends Component {
  constructor(props) {
    super(props);

    this.pixi_cnt = null;
    const app = new PIXI.Application({
      width: 600,
      height: 600,
      transparent: false,
      backgroundColor: 0x6a819c, // A hex color code
      resolution: window.devicePixelRatio,
    });

    this.app = app;
    this.state = { app };
    this.loader = null;

    this.map = defaultMap;

    // Will save some textures from spritesheets for later use.
    this.textures = {};

    // Save sprite handles from setup() to edit in game later
    this.sprites = {};

    this.shipData = new ShipData(8, true, 0, 0);
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
    let loader = new PIXI.Loader();
    this.loader = loader;

    // Load resources from resources.js
    let res;
    for (res of resourcePairs) loader.add(res.name, res.image);

    loader.load((loader, resources) => {
      this.loadMapSpritesheets(resources);
      this.loadMap();
      this.loadShipUI(resources);
    });
  };

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
  }

  loadShipUI(resources) {
    const movesBgSprite = this.createSprite("movesBackground");
    const shipStatusBgSprite = this.createSprite("shipStatus");
    const shipStatusBorderSprite = this.createSprite("shipStatusBorder");
    const shiphandSprite = this.createSprite("shiphand");
    const hourglassSprite = this.createSprite("hourglass");
    const movesTitle = this.createSprite("movesTitle");

    const gunTokenTexture = new PIXI.Texture(
      resources["gunToken"].texture,
      new PIXI.Rectangle(25, 0, 25, 25)
    );

    const autoButtonSprite = this.createSprite("autoOn");
    autoButtonSprite.interactive = true;
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

    const movesBody = new SpriteBody(
      movesBgSprite,
      175,
      this.app.renderer.height - 95
    );

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

    const stage = this.app.stage;

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

  getCellTexture(cell_id) {
    switch (cell_id) {
      case 0:
        const rNum = Math.floor(Math.random() * 5);
        return this.textures["cell_" + rNum];
      default:
        return this.loader.resources["ocean"].texture;
    }
  }

  loadMap() {
    let cell_id;

    const mapBody = new SpriteBody(null, 50, 100);

    const xSize = this.map[0].length;
    const ySize = this.map.length;

    console.log("YSize: ", ySize, "XSize: ", xSize);
    for (let x = 0; x < xSize; x++) {
      for (let y = 0; y < ySize; y++) {
        const cell_id = this.map[y][x];

        const cellSprite = new PIXI.Sprite(this.getCellTexture(cell_id));
        cellSprite.anchor.x = 0.5;
        cellSprite.anchor.y = 0.5;
        // mapBody.addSprite(cellSprite, (x / 2) * 64, y * 48 + x * 24);

        const spaceX = (x / 2) * 64 + y * 32;
        const spaceY = y * 48 + x * -24 - y * 24;

        mapBody.addSprite(cellSprite, spaceX, spaceY);

        this.app.stage.addChild(cellSprite);
      }
    }
    for (cell_id of this.map) {
    }
  }

  updateTokens() {}

  render() {
    return <div ref={this.updatePixiContainer}></div>;
  }
}

export default Game;
