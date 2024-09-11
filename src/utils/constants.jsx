import { toRad } from "./math";

// Basic measures

/**
 * image width
 */
export const kWidth = 3600;

/**
 * image height
 */
export const kHeight = 4000;

/**
 * half of width
 */
export const xCenter = 1800;

/**
 * half of height
 */
export const yCenter = 2200;

/**
 * radius of equator line
 */
export const kRadius = 1000;

/**
 * inner radius of mater's ridge
 */
export const kBorder = 1650;

/**
 * outer radius of mater's ridge
 */
export const kLimbus = 1780;

/**
 * earth's ecliptic angle (simplified, may be delegated to a temporal function
 * in the future)
 */
export const kEeclipticAngle = 23.436206;

/**
 * earth's ecliptic angle in radians (simplified, may be delegated to a temporal function
 * in the future)
 */
export const kEclipticRadAngle = toRad(kEeclipticAngle);

/**
 * stereometric proportion of outer tropical circle to equator
 * and of equator to inner tropical circle
 */
export const kTropicalFactor =
  Math.cos(kEclipticRadAngle) / (1 - Math.sin(kEclipticRadAngle));

// astronomical constants
/**
 * sidereal Time (in degrees) at J2000.0
 */
export const siderealEpoch = 280.46061837500001;

/**
 * J2000.0 epoch in Unix-miliseconds
 */
export const unixJ2000 = 946728000000;

/**
 * Miliseconds for a sidereal movement of 1 degree.
 */
export const siderealDegree = 239344.69591898023;

