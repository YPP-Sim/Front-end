import React, { Component } from "react";
import * as PIXI from "pixi.js";

// images
import shiphand from "../assets/ui/shiphand.png";

class Game extends Component {
  constructor(props) {
    super(props);

    this.pixi_cnt = null;
    const app = new PIXI.Application({
      width: 600,
      height: 600,
      transparent: false,
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
    loader.add("shiphand", shiphand).load((loader, resources) => {
      const sh = new PIXI.Sprite(resources.shiphand.texture);

      sh.x = this.app.renderer.width / 2;
      sh.y = this.app.renderer.height / 2;

      sh.anchor.x = 0.5;
      sh.anchor.y = 0.5;

      this.app.stage.addChild(sh);
    });
  };

  //   initialize = () => {
  //     const sh = new PIXI.Sprite(PIXI.Loader.resources["shiphand"].texture);
  //     console.log("SH: ", sh);
  //     this.state.app.stage.addChild(sh);
  //   };

  //   state = {};

  render() {
    return <div ref={this.updatePixiContainer}></div>;
  }
}

export default Game;
