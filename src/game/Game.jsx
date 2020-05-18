import React, { Component } from "react";
import * as PIXI from "pixi.js";
import SpriteBody from "./SpriteBody";

import resourcePairs from "./resources";

// // --- assets imports ---

// // UI
// import shiphand from "../assets/ui/shiphand.png";
// import movesBg from "../assets/ui/moves-background.png";
// import movesTitle from "../assets/ui/title.png";
// import autoOn from "../assets/ui/auto-on.png";
// import autoOff from "../assets/ui/auto-off.png";
// import radioOn from "../assets/ui/radio-on.png";
// import radioOff from "../assets/ui/radio-off.png";
// import hourglass from "../assets/ui/hourglass.png";

// import shipStatusBorder from "../assets/ui/status.png";
// import shipStatus from "../assets/ui/status-bg.png";

// import bilgeStatus from "../assets/ui/bilge.png";
// import damageStatus from "../assets/ui/damage.png";

// // Cannonballs
// import cbSmall from "../assets/projectile/cannonball_small.png";
// import cbMedium from "../assets/projectile/cannonball.png";
// import cbLarge from "../assets/projectile/cannonball_large.png";

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
      const movesBgSprite = this.createSprite("movesBackground");
      const shipStatusBgSprite = this.createSprite("shipStatus");
      const shipStatusBorderSprite = this.createSprite("shipStatusBorder");
      const shiphandSprite = this.createSprite("shiphand");
      const hourglassSprite = this.createSprite("hourglass");

      const movesBody = new SpriteBody(
        movesBgSprite,
        175,
        this.app.renderer.height - 95
      );

      movesBody.addSprite(shiphandSprite, 50, -1);
      movesBody.addSprite(hourglassSprite, 100, 0);

      const stage = this.app.stage;

      stage.addChild(movesBgSprite);
      stage.addChild(shiphandSprite);
      stage.addChild(hourglassSprite);
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
