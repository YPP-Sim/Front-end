import Orientation from "./Orientation";

export function getMovementAnimData(
  currentX,
  currentY,
  targetX,
  targetY,
  animationSmoothness
) {
  let dX = targetX - currentX;
  let dY = targetY - currentY;

  const incrementX = dX / animationSmoothness;
  const incrementY = dY / animationSmoothness;

  let xComplete = Math.abs(dX);
  let yComplete = Math.abs(dY);

  return { incrementX, incrementY, xComplete, yComplete };
}

export function updateLinearAnimation(deltaTime) {
  const elapsedTime = this.lastElapsedTime + deltaTime;
  if (elapsedTime >= this.totalTime) {
    if (this.onComplete) this.onComplete();
    if (!this.dontStop) this.ticker.stop();
  }
  const { x: initialX, y: initialY } = this.initialPosition;

  const { x: finalX, y: finalY } = this.finalPosition;

  const dX = (finalX - initialX) / this.totalTime;
  const dY = (finalY - initialY) / this.totalTime;

  const incrementX = dX * deltaTime;
  const incrementY = dY * deltaTime;

  this.setPosition(incrementX, incrementY);

  this.lastElapsedTime = elapsedTime;
}

export function updateTextureAnimation(deltaTime) {
  const elapsedTime = this.lastElapsedTime + deltaTime;
  this.textureChangeElapsed += deltaTime;
  if (elapsedTime > this.time) {
    this.ticker.stop();
    this.remove();
    return;
  }

  if (this.textureChangeElapsed >= this.speed) {
    if (this.frame.x >= this.totalWidth) {
      this.remove();
      this.ticker.stop();
      return;
    } else this.frame.x += 40;

    this.sprite.texture.frame = this.frame;
    this.textureChangeElapsed = 0;
  }
  this.lastElapsedTime = elapsedTime;
}

export function updateSinkingTextureAnimation(deltaTime) {
  const elapsedTime = this.lastElapsedTime + deltaTime;
  this.textureChangeElapsed += deltaTime;
  if (elapsedTime > this.time) {
    this.ticker.stop();
    this.onComplete();
    return;
  }

  if (this.textureChangeElapsed >= this.speed) {
    if (this.currentFrame >= this.totalFrames) {
      this.ticker.stop();
      this.onComplete();
      return;
    } else {
      const { x, y, width, height } = this.orientations[this.currentFrame];
      this.frame.x = x;
      this.frame.y = y;
      this.frame.width = width;
      this.frame.height = height;

      this.currentFrame++;
    }

    this.sprite.texture.frame = this.frame;
    this.textureChangeElapsed = 0;
  }
  this.lastElapsedTime = elapsedTime;
}

export function getObjectSize(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

export function getTeamColor(playerTeam, shipTeam) {
  switch (shipTeam) {
    case playerTeam:
      return 0x00eeff;
    case "ATTACKER":
      return 0xff4444;
    case "DEFENDER":
      return 0x70ff33;
    default:
      return 0x000000;
  }
}

export function getSideVelocity(orientation, side) {
  if (side !== "left" && side !== "right") return { x: 0, y: 0 };

  switch (orientation) {
    case Orientation.NORTH:
      return side === "left" ? { x: -1, y: 0 } : { x: 1, y: 0 };
    case Orientation.SOUTH:
      return side === "left" ? { x: 1, y: 0 } : { x: -1, y: 0 };
    case Orientation.EAST:
      return side === "left" ? { x: 0, y: -1 } : { x: 0, y: 1 };
    case Orientation.WEST:
      return side === "left" ? { x: 0, y: 1 } : { x: 0, y: -1 };

    default:
      return { x: 0, y: 0 };
  }
}
