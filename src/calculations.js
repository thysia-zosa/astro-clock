function toRad(grad) {
  return (Math.PI * grad) / 180;
}

function toGrad(rad) {
  return (180 * rad) / Math.PI;
}

let time = new Date().getTime() - 946728000000;
let t = time / 3155760000000;
let longitude = 8.222566666666667;
const siderealEpoch = 100.46061837500001;

// const eclipticAngle =
//   42190703 / 1800000 -
//   (46.836769 * t - 0.0001831 * t * t + 0.0020034 * t * t * t) / 3600;
const xCenter = 1600;
const yCenter = 1600;
const eclipticAngle = 23.436206;
const eclipticRadAngle = toRad(eclipticAngle);
const equatorRadius = 1000;
const tropicalFactor =
  Math.cos(eclipticRadAngle) / (1 - Math.sin(eclipticRadAngle));
const innerTropic = equatorRadius / tropicalFactor;
const outerTropic = equatorRadius * tropicalFactor;
const eclipticRadius = (outerTropic + innerTropic) / 2;
const eclipticCenter = yCenter + innerTropic - eclipticRadius;
let siderealTime = (0 + 0 + 0 / 239344.69591898023) % 360;

export default function calculations() {
  console.log(siderealTime);
}
