export function toRad(grad) {
  return (Math.PI * grad) / 180;
}

export function toGrad(rad) {
  return (180 * rad) / Math.PI;
}

export function stereoProject(radAngle) {
  return Math.tan(Math.PI / 4 - radAngle / 2);
}
