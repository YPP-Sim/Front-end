import React, { Component } from "react";
import * as PIXI from "pixi.js";
import SpriteBody from "./SpriteBody";

// images
import shiphand from "../assets/ui/shiphand.png";

import cbLarge from "../assets/projectile/cannonball_large.png";

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
  }

  updatePixiContainer = (el) => {
    this.pixi_cnt = el;

    if (this.pixi_cnt && this.pixi_cnt.children.length <= 0)
      this.pixi_cnt.appendChild(this.state.app.view);

    this.setup();
  };

  setup = () => {
    let loader = new PIXI.Loader();
    loader
      .add("cbLarge", cbLarge)
      .add("shiphand", shiphand)
      .load((loader, resources) => {
        const sh = new PIXI.Sprite(resources.shiphand.texture);
        const sh1 = new PIXI.Sprite(resources.cbLarge.texture);

        sh1.anchor.x = 0.5;
        sh1.anchor.y = 0.5;
        sh.anchor.x = 0.5;
        sh.anchor.y = 0.5;

        const sprBody = new SpriteBody(
          sh,
          this.app.renderer.width / 2,
          this.app.renderer.height / 2
        );

        sprBody.addSprite(sh1, 50, 0);

        this.app.stage.addChild(sh);
        this.app.stage.addChild(sh1);
      });

    // loader.add("shiphand", shiphand).load((loader, resources) => {
    //   const sh = new PIXI.Sprite(resources.shiphand.texture);
    //   const sh1 = new PIXI.Sprite(resources.shiphand.texture);

    //   sh1.anchor.x = 0.5;
    //   sh1.anchor.y = 0.5;
    //   sh.anchor.x = 0.5;
    //   sh.anchor.y = 0.5;

    //   const sprBody = new SpriteBody(
    //     sh,
    //     this.app.renderer.width / 2,
    //     this.app.renderer.height / 2
    //   );

    //   sprBody.addSprite(sh1, 50, 50);

    //   this.app.stage.addChild(sh);
    //   this.app.stage.addChild(sh1);
    // });
  };

  render() {
    return <div ref={this.updatePixiContainer}></div>;
  }
}

export default Game;
