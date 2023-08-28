import { toRad } from "./math";

export const kWidth = 3600;
export const kHeight = 4000;
export const xCenter = 1800;
export const yCenter = 2200;
export const kRadius = 1000;
export const kBorder = 1650;
export const eclipticAngle = 23.436206;
export const eclipticRadAngle = toRad(eclipticAngle);
export const tropicalFactor =
  Math.cos(eclipticRadAngle) / (1 - Math.sin(eclipticRadAngle));
