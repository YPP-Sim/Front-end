import React, { Component } from "react";
import * as PIXI from "pixi.js";
import SpriteBody from "./../../game/SpriteBody";
import resourcePairs from "../../game/resources";
import styled from "styled-components";
import Flag from "../../game/Flag";
import DragDropHandler from "../../game/DragDropHandler";

let loaderLoaded = false;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  `;

function isRock(cell_id) {
  switch (cell_id) {
    case 13:
    case 14:
    case 15:
    case 16:
    case 20:
    case 21:
    case 22:
    case 23:
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
    const realApp = new PIXI.Application({
      transparent: false,
      backgroundColor: 0x6a819c, // A hex color code
      resolution: window.devicePixelRatio,
      autoResize: false,
    });

    this.realApp = realApp;
    this.stage = new PIXI.Container();
    this.stage.sortableChildren = true;
    
    this.app = realApp.renderer;
    this.app.view.width = 450;
    this.app.view.height = 500;
    this.state = { app: this.app };
    this.loader = null;

    //TODO eventually scale code will be apart of zooming in/out feature!
    this.stage.scale.x = 1;
    this.stage.scale.y = 1;

    this.textures = {};
    this.sprites = {};

    this.map = props.map;
    this.mapBody = new SpriteBody(null, 100, 250);

    this.setupLoaded = false;

    this.dragHandler = new DragDropHandler(this);
  }

  initFlags() {
    for (let flag of this.gameData.flags) {
      this.flags[flag.id] = new Flag(flag.x, flag.y, flag.pointValue, this);
    }
  }

  getThisPlayer() {
    return this.gameData.thisPlayer;
  }

  componentDidMount() {
    this.pixi_cnt.addEventListener("contextmenu", removeContextMenu);
  }

  componentWillUnmount() {
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
      
      for (res of resourcePairs) {
        try{
          loader.add(res.name, res.image);
        } catch (err) {
          if(!err.message.startsWith("Resource named")) {
            console.log("Error loading resource: ", err);
          }
        }
      } 

      loaderLoaded = true;
    }

    loader.load((loader, resources) => {
      this.setupLoaded = true;
      this.loadMapSpritesheets(resources);
      const { rocks, flags } = this.loadMap();
      this.reRenderRocks(rocks);
      this.reRenderFlags(flags);
      this.oldTime = Date.now();
      // this.initFlags();
      this.dragHandler.init();
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

    const rocksSmRec = new PIXI.Rectangle(0, 0, 56.5, 50);
    const smRocks1 = new PIXI.Texture(
      resources["rocksSmall"].texture,
      rocksSmRec
    );
    rocksSmRec.x += 56.5;
    const smRocks2 = new PIXI.Texture(
      resources["rocksSmall"].texture,
      rocksSmRec
    );
    rocksSmRec.x += 56.5;
    const smRocks3 = new PIXI.Texture(
      resources["rocksSmall"].texture,
      rocksSmRec
    );
    rocksSmRec.x += 56.5;
    const smRocks4 = new PIXI.Texture(
      resources["rocksSmall"].texture,
      rocksSmRec
    );

    this.textures["smallRocks1"] = smRocks1;
    this.textures["smallRocks2"] = smRocks2;
    this.textures["smallRocks3"] = smRocks3;
    this.textures["smallRocks4"] = smRocks4;
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

  isFlag(cell_id) {
    switch(cell_id) {
      case 17:
      case 18:
      case 19:
          return true;
      default: return false;
    }
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
      case 17:
      case 18:
      case 19:
        return this.textures["cell_3"];
      case 20:
        return this.textures["smallRocks1"];
      case 21:
        return this.textures["smallRocks2"];
      case 22:
        return this.textures["smallRocks3"];
      case 23:
        return this.textures["smallRocks4"];

      default:
        return this.loader.resources["ocean"].texture;
    }
  }

  getFlagPointValue(cell_id) {
    switch(cell_id) {
      case 17: return 1;
      case 18: return 2;
      case 19: return 3;
      default: return 0;
    }
  }

  loadMap() {
    const mapBody = this.mapBody;

    const xSize = this.map[0].length;
    const ySize = this.map.length;

    const rocks = [];
    const flags = [];

    for (let x = 0; x < xSize; x++) {
      for (let y = 0; y < ySize; y++) {
        let cell_id = this.map[y][x];

        if (isRock(cell_id)) {
          rocks.push({ id: cell_id, x, y });
          cell_id = 0;
        }

        if(this.isFlag(cell_id)) {
          flags.push({id: cell_id, x, y});
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
    return {rocks, flags};
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
      this.dragHandler.setDragging(false);
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
      rockSprite.zIndex = 1;
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
        case 20:
          rockSprite.anchor.x = 0.4;
          rockSprite.anchor.y = 0.4;
          break;
        case 21:
          rockSprite.anchor.x = 0.5;
          rockSprite.anchor.y = 0.55;
          break;
        case 22:
          rockSprite.anchor.x = 0.5;
          rockSprite.anchor.y = 0.45;
          break;
        // case 23:
        //   break;
        default:
          this.setCenterAnchor(rockSprite);
      }

      this.mapBody.addSprite(rockSprite, spaceX, spaceY);
      this.stage.addChild(rockSprite);
    }
  }

  reRenderFlags(flags) {
    let flagData;
    for (flagData of flags) {
      new Flag(flagData.x, flagData.y, this.getFlagPointValue(flagData.id), this);
    }
  }

  render() {
    return (
      <GameContainer id="game" ref={this.updatePixiContainer}></GameContainer>
    );
  }
}

export default Game;
