import React, { Component } from "react";
import * as PIXI from "pixi.js";
import SpriteBody from "./SpriteBody";

import resourcePairs from "./resources";

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

    // Will save some textures from spritesheets for later use.
    this.textures = {};

    // Save sprite handles from setup() to edit in game later
    this.sprites = {};

    this.gameData = {
      autoTokens: true,
    };
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
      // Basic Sprites
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
        this.gameData.autoTokens = !this.gameData.autoTokens;
        if (this.gameData.autoTokens)
          autoButtonSprite.texture = resources["autoOn"].texture;
        else autoButtonSprite.texture = resources["autoOff"].texture;
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
    });
  };

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

  render() {
    return <div ref={this.updatePixiContainer}></div>;
  }
}

export default Game;
