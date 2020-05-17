import Player from "./player";

let canvas;
let context;

let secondsPassed;
let oldTimeStamp;
let fps;

let player = new Player(20, 20);

function init(width, height) {
  console.log("initializing...");
  canvas = document.querySelector("#game-canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d");

  gameLoop();

  // Register Listeners
  document.addEventListener("keydown", onKeyUp);
  document.addEventListener("keyup", onKeyDown);
}

function draw() {
  context.fillStyle = "red";
  context.fillRect(player.x, player.y, 20, 20);
}

function gameLoop(timeStamp) {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Calculate fps
  fps = Math.round(1 / secondsPassed);

  // Draw number to the screen
  context.fillStyle = "white";
  context.fillRect(0, 0, 500, 500);
  //   context.font = "10px Arial";
  draw();
  context.fillStyle = "blue";
  context.fillText("FPS: " + fps, 10, 30);

  window.requestAnimationFrame(gameLoop);
}

function onKeyUp(event) {
  console.log("Key down");
  if(event.key)
}

function onKeyDown(event) {
  console.log("Key Up");
}

// ----
let time = 0;
let frames = 0;
let prevTime = 0;
let totalTime = 0;

function getFPS() {
  frames++;
  prevTime = time;
  time = Date.now();

  const elapsed = time - prevTime;
  totalTime += elapsed;

  return frames / (totalTime / 1000);
}

export default init;
