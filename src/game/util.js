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
  if (elapsedTime >= this.totalTime) this.ticker.stop();

  const { x: initialX, y: initialY } = this.initialPosition;

  const { x: finalX, y: finalY } = this.finalPosition;

  const dX = (finalX - initialX) / this.totalTime;
  const dY = (finalY - initialY) / this.totalTime;

  const incrementX = dX * deltaTime;
  const incrementY = dY * deltaTime;

  this.setPosition(incrementX, incrementY);

  this.lastElapsedTime = elapsedTime;
}
