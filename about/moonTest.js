const unixJ2000 = 946728000000;
const kEeclipticAngle = 23.436206;
const kEclipticRadAngle = toRad(kEeclipticAngle);
const xCenter = 1800;
const yCenter = 2200;
const kRadius = 1000;
const date = new Date(2015, 0, 2, 4);

function toRad(grad) {
  return (Math.PI * grad) / 180;
}

function toGrad(rad) {
  return (180 * rad) / Math.PI;
}

function stereoProject(radAngle) {
  return Math.tan(Math.PI / 4 - radAngle / 2);
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
function getSunLocation() {
  const excentricity = 0.016708;
  const eclipticLongitudeAtEpoch = toRad(280.466069);
  const eclipticLongitudeAtPerigee = toRad(282.938346);

  const d = ((date.getTime() - unixJ2000) / 31556925252) % 2;
  const meanAnomaly =
    (2 * Math.PI * d + eclipticLongitudeAtEpoch - eclipticLongitudeAtPerigee) %
    (2 * Math.PI);
  const excentricAnomaly = getExcentricAnomaly(meanAnomaly, excentricity);
  const trueAnomaly = getTrueAnomaly(excentricAnomaly, excentricity);
  const ecclipticLongitude =
    (trueAnomaly + eclipticLongitudeAtPerigee) % (2 * Math.PI);
  return { meanAnomaly, ecclipticLongitude };
}

// function getSunCoords(ecclipticLongitude) {
//   let rightAscension = Math.atan(
//     Math.cos(kEclipticRadAngle) * Math.tan(ecclipticLongitude)
//   );
//   rightAscension +=
//     Math.round((ecclipticLongitude - rightAscension) / Math.PI) * Math.PI;
//   const declination = Math.asin(
//     Math.sin(kEclipticRadAngle) * Math.sin(ecclipticLongitude)
//   );
//   return convertCoordsToPosition({ rightAscension, declination });
// }

function getMoonCoords(meanAnomalyOfSun, ecclLongOfSun) {
  const daysSinceEpoch = (date.getTime() - unixJ2000) / 86400000;
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
      toRad(0.1114041) * daysSinceEpoch -
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
  const y_sin_li_O2_cos_i =
    Math.sin(trueEcclLong - corrEcclLongOfAscNode) *
    Math.cos(inclinationOfOrbit);
  const x_cos_li_O2 = Math.cos(trueEcclLong - corrEcclLongOfAscNode);
  const t_arctan_y_x =
    (2 * Math.PI + Math.atan(y_sin_li_O2_cos_i / x_cos_li_O2)) % (2 * Math.PI);
  const t_atan2 =
    (2 * Math.PI + Math.atan2(y_sin_li_O2_cos_i, x_cos_li_O2)) % (2 * Math.PI);
  console.log(
    "y",
    y_sin_li_O2_cos_i,
    "\nx",
    x_cos_li_O2,
    "\nT",
    toGrad(t_arctan_y_x),
    "\nT2",
    toGrad(t_atan2)
  );
  const ecclipticLongitude =
    (2 * Math.PI +
      corrEcclLongOfAscNode +
      Math.atan2(
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
  console.log(
    // "meanAnomalyOfSun",
    // toGrad(meanAnomalyOfSun),
    // "\necclLongOfSun",
    // toGrad(ecclLongOfSun),
    // "\ndaysSinceEpoch",
    // daysSinceEpoch,
    // "\nmeanEcclLong",
    // toGrad(meanEcclLong),
    // "\nmeanEcclLongOfAscNode",
    // toGrad(meanEcclLongOfAscNode),
    // "\nmeanAnomalyOfMoon",
    // toGrad(meanAnomalyOfMoon),
    // "\nequationCorrection",
    // toGrad(equationCorrection),
    // "\nevecCorrection",
    // toGrad(evecCorrection),
    // "\nmeanAnomalyCorrection",
    // toGrad(meanAnomalyCorrection),
    // "\ntrueAnomalyOfMoon",
    // toGrad(trueAnomalyOfMoon),
    // "\ncorrEcclLong",
    // toGrad(corrEcclLong),
    // "\nvariationCorrection",
    // toGrad(variationCorrection),
    // "\ntrueEcclLong",
    // toGrad(trueEcclLong),
    "\ncorrEcclLongOfAscNode",
    toGrad(corrEcclLongOfAscNode),
    "\necclipticLongitude",
    toGrad(ecclipticLongitude),
    "\necclipticLatitude",
    toGrad(ecclipticLatitude),
    "\nrightAscension",
    // Math.floor(toGrad(rightAscension) / 15),
    // Math.floor(toGrad(rightAscension) * 4) % 60,
    // (toGrad(rightAscension) * 240) % 60,
    toGrad(rightAscension) / 15,
    "\ndeclination",
    toGrad(declination)
  );
  return convertCoordsToPosition({ rightAscension, declination });
}

function convertCoordsToPosition({ rightAscension, declination }) {
  const distance = stereoProject(declination) * kRadius;
  const x = xCenter - distance * Math.sin(rightAscension);
  const y = yCenter - distance * Math.cos(rightAscension);
  return { x, y };
}

const { meanAnomaly, ecclipticLongitude } = getSunLocation();
/* const moonCoords = */ getMoonCoords(meanAnomaly, ecclipticLongitude);
