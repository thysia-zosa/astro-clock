import {
  kEclipticRadAngle,
  kRadius,
  siderealDegree,
  siderealEpoch,
  unixJ2000,
  xCenter,
  yCenter,
} from "./constants";

// grad to radians
export function toRad(grad) {
  return (Math.PI * grad) / 180;
}

// radians to grad
export function toGrad(rad) {
  return (180 * rad) / Math.PI;
}

/**
 * Calculates the projected distance of a latitude from north pole
 *
 * @param {double} radAngle northward latitude in radians
 * @returns {double} distance from projected center
 */
export function stereoProject(radAngle) {
  return Math.tan(Math.PI / 4 - radAngle / 2);
}

/**
 * Calculates the y coordinate of an intersection of two circles with same center-y-coordinate
 * @param {double} r1 radius of first circle
 * @param {double} y1 y-coordinate of first circle's center
 * @param {double} r2 radius of second circle
 * @param {double} y2 y-coordinate of second circle's center
 * @returns
 */
export function getYOfHorizontalIntersection(r1, y1, r2, y2) {
  return (r1 * r1 + y2 * y2 - r2 * r2 - y1 * y1) / (2 * (y2 - y1));
}

/**
 * Calculates the distance in horizontal distance from the centers x-ax of an intersection of two circles with the same senter-y-coordinate
 * @param {double} radius radius of one circle
 * @param {double} y1 y-coordinate of this circle's center
 * @param {double} y2 y-coordinate of the two circles' intersection
 * @returns
 */
export function getXOfHorizontalIntersection(radius, y1, y2) {
  const yDifference = y1 - y2;
  return Math.sqrt(radius * radius - yDifference * yDifference);
}

/**
 * Calclulates center and radius of a projected circle around a non-center-spheric circle
 *
 * @param {double} latitude northward latitude of circle's center in radians
 * @param {double} distAngle distance from circle's center in radius
 * @returns
 */
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
 * Calculates intersection of two circles
 *
 * Needs Radius and center coordinates from both circles
 *
 *
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
 * @returns {
 *    count: count of results (0,1,2; -1 means infinite)
 *    results?: Array with the two points of intersection {x,y}
 * }
 */
export function getCirclesIntersection(x1, y1, r1, x2, y2, r2) {
  let count;
  if (x1 === x2 && y1 === y2 && r1 === r2) {
    count = -1;
    return { count };
  }
  const factor = (x2 - x1) / (y1 - y2);
  const coefficient =
    (x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2 + r2 * r2 - r1 * r1) /
    (2 * y1 - 2 * y2);
  const a = 1 + factor * factor;
  const b = 2 * (coefficient * factor - x1 - y1 * factor);
  const c =
    x1 * x1 +
    coefficient * coefficient +
    y1 * y1 -
    2 * y1 * coefficient -
    r1 * r1;
  const root = Math.sqrt(b * b - 4 * a * c);
  const resultX1 = (-b + root) / (2 * a);
  if (isNaN(resultX1)) {
    count = 0;
    return { count };
  }
  const resultX2 = (-b - root) / (2 * a);
  const resultY1 = coefficient + resultX1 * factor;
  if (resultX1 === resultX2) {
    count = 1;
    return { count, results: [{ x: resultX1, y: resultY1 }] };
  }
  const resultY2 = coefficient + resultX2 * factor;
  count = 2;
  return {
    count,
    results: [
      { x: resultX1, y: resultY1 },
      { x: resultX2, y: resultY2 },
    ],
  };
}

/**
 * Simplified calculation of sidereal time in degrees
 *
 * Calculates the degrees passed since J2000.0 according to the
 * middle apparent movement of the sky
 *
 * @returns the current sidereal time of [longitude] in degrees
 */
export function getSiderealTime(longitude) {
  let time = new Date().getTime() - unixJ2000;
  return (longitude + siderealEpoch + time / siderealDegree) % 360;
}

function getExcentricAnomaly(meanAnomaly, excentricity) {
  let excentricAnomaly = meanAnomaly;
  for (let i = 0; i < 10; i++) {
    excentricAnomaly = meanAnomaly + excentricity * Math.sin(excentricAnomaly);
  }
  return excentricAnomaly;
}

function getTrueAnomaly(excentricAnomaly, excentricity) {
  return (
    ((Math.atan(
      Math.sqrt((1 + excentricity) / (1 - excentricity)) *
        Math.tan(excentricAnomaly / 2)
    ) +
      Math.PI) %
      Math.PI) *
    2
  );
}

// Calculate the location of the Sun
export function getSunLocation() {
  const excentricity = 0.016708;
  const eclipticLongitudeAtEpoch = toRad(280.466069);
  const eclipticLongitudeAtPerigee = toRad(282.938346);

  const d = ((new Date().getTime() - unixJ2000) / 31556925252) % 2;
  const meanAnomaly =
    (2 * Math.PI * d + eclipticLongitudeAtEpoch - eclipticLongitudeAtPerigee) %
    (2 * Math.PI);
  const excentricAnomaly = getExcentricAnomaly(meanAnomaly, excentricity);
  const trueAnomaly = getTrueAnomaly(excentricAnomaly, excentricity);
  const ecclipticLongitude =
    (trueAnomaly + eclipticLongitudeAtPerigee) % (2 * Math.PI);
  return { meanAnomaly, ecclipticLongitude };
}

export function getSunCoords(ecclipticLongitude) {
  let rightAscension = Math.atan(
    Math.cos(kEclipticRadAngle) * Math.tan(ecclipticLongitude)
  );
  rightAscension +=
    Math.round((ecclipticLongitude - rightAscension) / Math.PI) * Math.PI;
  const declination = Math.asin(
    Math.sin(kEclipticRadAngle) * Math.sin(ecclipticLongitude)
  );
  return convertCoordsToPosition({ rightAscension, declination });
}

function isInferior(aP) {
  return aP < 1;
}

function getGeocentricEcclipticLongitude(aP, RP, LamdaP, L_P, LE, RE) {
  if (isInferior(aP)) return getGelForInferiorPlanet(RP, LamdaP, L_P, LE, RE);
  return getGelForSuperiorPlanet(RP, LamdaP, L_P, LE, RE);
}

function getGelForInferiorPlanet(RP, LamdaP, L_P, LE, RE) {
  return (
    (3 * Math.PI +
      LE +
      Math.atan(
        (RP * Math.cos(LamdaP) * Math.sin(LE - L_P)) /
          (RE - RP * Math.cos(LamdaP) * Math.cos(LE - L_P))
      )) %
    (2 * Math.PI)
  );
}

function getGelForSuperiorPlanet(RP, LamdaP, L_P, LE, RE) {
  return (
    2 * Math.PI +
    L_P +
    (Math.atan(
      (RE * Math.sin(L_P - LE)) /
        (RP * Math.cos(LamdaP) - RE * Math.cos(LE - L_P))
    ) %
      (2 * Math.PI))
  );
}

// Calculate the location of the Sun
function getPlanetLocation(planet, earth) {
  const { TP, eP, aP, iP, epsilonP, piP, OmegaP } = planet;
  const {
    /* earth's distance from sun in AU */ RE,
    /* earth's heliocentric eccliptic longitude */ LE,
  } = earth;

  const /* number of days since the standard epoch */ DE =
      ((new Date().getTime() - unixJ2000) / (31556925252 * TP)) % 2;
  const /* mean anomaly */ Mp =
      (2 * Math.PI * DE + epsilonP - piP) % (2 * Math.PI);
  const /* excentric anomaly */ EP = getExcentricAnomaly(Mp, eP);
  const /* true anomaly */ ypsilonP = getTrueAnomaly(EP, eP);
  const /* heliocentric eccliptic longitude */ LP =
      (ypsilonP + piP) % (2 * Math.PI);
  const /* heliocentric eccliptic latitude */ LamdaP = Math.asin(
      Math.sin(LP - OmegaP) * Math.sin(iP)
    );
  const /* distance from sun in AU */ RP =
      (aP * (1 - eP * eP)) / (1 + eP * Math.cos(ypsilonP));
  let /* adjustment to heliocentric eccliptic longitude */ L_P =
      OmegaP +
      Math.atan((Math.sin(LP - OmegaP) * Math.cos(iP)) / Math.cos(LP - OmegaP));
  L_P += Math.round((LP - L_P) / Math.PI) * Math.PI;

  const /* geocentric eccliptic longitude */ lambda_P =
      getGeocentricEcclipticLongitude(aP, RP, LamdaP, L_P, LE, RE);
  const /* geocentric eccliptic latitude */ betaP = Math.atan(
      (RP * Math.cos(LamdaP) * Math.tan(LamdaP) * Math.sin(lambda_P - L_P)) /
        (RE * Math.sin(L_P - LE))
    );
  let rightAscension = Math.atan(
    (Math.sin(lambda_P) * Math.cos(kEclipticRadAngle) -
      Math.tan(betaP) * Math.sin(kEclipticRadAngle)) /
      Math.cos(lambda_P)
  );
  rightAscension += Math.round((lambda_P - rightAscension) / Math.PI) * Math.PI;
  const declination = Math.asin(
    Math.sin(betaP) * Math.cos(kEclipticRadAngle) +
      Math.cos(betaP) * Math.sin(kEclipticRadAngle) * Math.sin(lambda_P)
  );
  return convertCoordsToPosition({ rightAscension, declination });
}

export function getPlanet(planet, ecclipticLongitude) {
  const LE = ecclipticLongitude + (Math.PI % (2 * Math.PI));
  const positions = getPlanetLocation(
    {
      TP: planet.TP,
      eP: planet.eP,
      aP: planet.aP,
      iP: toRad(planet.iP),
      epsilonP: toRad(planet.epsilonP),
      piP: toRad(planet.piP),
      OmegaP: toRad(planet.OmegaP),
    },
    { RE: 1, LE }
  );
  return {
    name: planet.name,
    rad: Math.ceil(5 - planet.VP),
    color: planet.color,
    ...positions,
  };
}

export function getMoonCoords(meanAnomalyOfSun, ecclLongOfSun) {
  const daysSinceEpoch = (new Date().getTime() - unixJ2000) / 86400000;
  const inclinationOfOrbit = toRad(5.1453964);
  const ecclLongAtEpoch = toRad(218.316433);
  const ecclLongAtPerigee = toRad(83.353451);
  const meanEcclLongOfAscNodeAtEpoch = toRad(125.044522);
  const meanEcclLong =
    (toRad(13.176339686) * daysSinceEpoch + ecclLongAtEpoch) % (2 * Math.PI);
  const meanEcclLongOfAscNode =
    (10 * Math.PI +
      meanEcclLongOfAscNodeAtEpoch -
      toRad(0.0529539) * daysSinceEpoch) %
    (2 * Math.PI);
  const meanAnomalyOfMoon =
    (10 * Math.PI +
      meanEcclLong -
      toRad(0.114041) * daysSinceEpoch -
      ecclLongAtPerigee) %
    (2 * Math.PI);
  const equationCorrection = toRad(0.1858) * Math.sin(meanAnomalyOfSun);
  const evecCorrection =
    toRad(1.2739) *
    Math.sin(2 * (meanEcclLong - ecclLongOfSun) - meanAnomalyOfMoon);
  const meanAnomalyCorrection =
    meanAnomalyOfMoon +
    evecCorrection -
    equationCorrection -
    toRad(0.37) * Math.sin(meanAnomalyOfSun);
  const trueAnomalyOfMoon =
    toRad(6.2886) * Math.sin(meanAnomalyCorrection) +
    toRad(0.214) * Math.sin(2 * meanAnomalyCorrection);
  const corrEcclLong =
    meanEcclLong + evecCorrection + trueAnomalyOfMoon - equationCorrection;
  const variationCorrection =
    toRad(0.6583) * Math.sin(2 * (corrEcclLong - ecclLongOfSun));
  const trueEcclLong = corrEcclLong + variationCorrection;
  const corrEcclLongOfAscNode =
    meanEcclLongOfAscNode - toRad(0.16) * Math.sin(meanAnomalyOfSun);
  const ecclipticLongitude =
    (2 * Math.PI +
      corrEcclLongOfAscNode +
      Math.atan(
        Math.sin(trueEcclLong - corrEcclLongOfAscNode) *
          Math.cos(inclinationOfOrbit),
        Math.cos(trueEcclLong - corrEcclLongOfAscNode)
      )) %
    (2 * Math.PI);
  const ecclipticLatitude = Math.asin(
    Math.sin(trueEcclLong - corrEcclLongOfAscNode) *
      Math.sin(inclinationOfOrbit)
  );
  let rightAscension = Math.atan(
    (Math.sin(ecclipticLongitude) * Math.cos(kEclipticRadAngle) -
      Math.tan(ecclipticLatitude) * Math.sin(kEclipticRadAngle)) /
      Math.cos(ecclipticLongitude)
  );
  rightAscension +=
    Math.round((ecclipticLongitude - rightAscension) / Math.PI) * Math.PI;
  const declination = Math.asin(
    Math.sin(ecclipticLatitude) * Math.cos(kEclipticRadAngle) +
      Math.cos(ecclipticLatitude) *
        Math.sin(kEclipticRadAngle) *
        Math.sin(ecclipticLongitude)
  );
  return convertCoordsToPosition({ rightAscension, declination });
}

function convertCoordsToPosition({ rightAscension, declination }) {
  const distance = stereoProject(declination) * kRadius;
  const x = xCenter - distance * Math.sin(rightAscension);
  const y = yCenter - distance * Math.cos(rightAscension);
  return { x, y };
}
