import { toRad } from "./math";

export const kWidth = 3600;
export const kHeight = 4000;
export const xCenter = 1800;
export const yCenter = 2200;
export const kRadius = 1000;
export const kBorder = 1650;
export const kEeclipticAngle = 23.436206;
export const kEclipticRadAngle = toRad(kEeclipticAngle);
export const kTropicalFactor =
  Math.cos(kEclipticRadAngle) / (1 - Math.sin(kEclipticRadAngle));
