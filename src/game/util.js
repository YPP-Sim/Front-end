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
    this.onComplete();
    this.ticker.stop();
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
