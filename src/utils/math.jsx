import { kRadius, yCenter } from "./constants";

export function toRad(grad) {
  return (Math.PI * grad) / 180;
}

export function toGrad(rad) {
  return (180 * rad) / Math.PI;
}

export function stereoProject(radAngle) {
  return Math.tan(Math.PI / 4 - radAngle / 2);
}

export function getYOfHorizontalIntersection(r1, y1, r2, y2) {
  return (r1 * r1 + y2 * y2 - r2 * r2 - y1 * y1) / (2 * (y2 - y1));
}

export function getXOfHorizontalIntersection(radius, y1, y2) {
  const yDifference = y1 - y2;
  return Math.sqrt(radius * radius - yDifference * yDifference);
}

export function getStereoCircle(latitude, distAngle) {
  // distance between southernmost point of altitude circle and north pole
  const netherLine = kRadius * stereoProject(toRad(latitude - distAngle));

  // distance between northernmost point of altitude circle and north pole
  const upperLine = kRadius * stereoProject(toRad(latitude + distAngle));

  // half distance between northernmost and southernmost points of altitude circle
  const radius = (netherLine - upperLine) / 2;

  // center of altitude circle
  const center = yCenter - radius - upperLine;
  return {
    radius,
    center,
  };
}

/**
 * (x-a)² + (y-b)² - c² = (x-d)² + (y-e)² - f²
 * x²+a²-2xa + y²+b²-2yb - c² = x²+d²-2xd + y²+e²-2ye -f²
 * a²-2xa+b²-2yb-c² = d²-2xd+e²-2ye-f²
 * a²+2xd-2xa+b²-c²-d²-e²+f² = 2yb-2ye
 * x(2d-2a)+a²+b²-c²-d²-e²+f² = y(2b-2e)
 * x(2d-2a)/(2b-2e) + (a²+b²-c²-d²-e²+f²)/(2b-2e) = y
 * x(d-a)/(b-e) + (a²+b²-c²-d²-e²+f²)/(2b-2e) = y
 * a:4, b:3, c²:10, d:10, e:6, f²:25
 * x(10-4)/(3-6) + (4²+3²-10-10²-6²+25)/(2*3-2*6) = y
 * x*6/-3 + (16+9-10-100-36+25)/(6-12) = y
 * -2x + 16 = y
 *
 * @param {*} x1
 * @param {*} y1
 * @param {*} r1
 * @param {*} x2
 * @param {*} y2
 * @param {*} r2
 * @returns Array with the two points of intersection {x,y}
 */
export function getCirclesIntersection(x1, y1, r1, x2, y2, r2) {
  const factor = (x2 - x1) / (y1 - y2);
  const coefficient =
    (x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2 + r2 * r2 - r1 * r1) /
    (2 * y1 - 2 * y2);
  const a = 1 + factor * factor;
  const b = 2 * (coefficient * factor - x1 - y1 * factor);
  const c =
    x1 * x1 + coefficient * coefficient + y1 * y1 - 2 * y1 * coefficient - r1 * r1;
  const root = Math.sqrt(b * b - 4 * a * c);
  const resultX1 = (-b + root) / (2 * a);
  const resultX2 = (-b - root) / (2 * a);
  const resultY1 = coefficient + resultX1 * factor;
  const resultY2 = coefficient + resultX2 * factor;
  return [
    { resultX1, resultY1 },
    { resultX2, resultY2 },
  ];
}
