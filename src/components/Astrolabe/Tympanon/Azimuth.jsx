import { kRadius, kWidth, xCenter, yCenter } from "../../../utils/constants";
import { stereoProject, toRad } from "../../../utils/math";

const Azimuth = () => {
  let latitude = /* 0.01; // */ 47.4756694444444445;

  const eclipticAngle = 23.436206;
  const eclipticRadAngle = toRad(eclipticAngle);
  const equatorRadius = kRadius;
  const tropicalFactor =
    Math.cos(eclipticRadAngle) / (1 - Math.sin(eclipticRadAngle));
  const outerTropic = equatorRadius * tropicalFactor;

  const netherLine = equatorRadius * stereoProject(toRad(latitude - 90));
  const upperLine = equatorRadius * stereoProject(toRad(latitude + 90));
  const radius = (netherLine - upperLine) / 2;
  const center = yCenter - radius - upperLine;
  const eqHorizon =
    (outerTropic * outerTropic -
      radius * radius -
      yCenter * yCenter +
      center * center) /
    (2 * (center - yCenter));

  /**
   * directional Lines:
   * arctan(cos(neigung)*tan(10°)) +abrunden((10°+90°)/180°)*180°
   * <circle cx="1600" cy="682.8873121387942" r="1356.8698103488061"></circle>
   */
  const tenDegrees = toRad(5);
  const horizontalCenter =
    yCenter - equatorRadius * stereoProject(toRad(latitude));
  const cosHorizontal = Math.cos(toRad(90 - latitude));
  const upperRange =
    Math.asin((yCenter - eqHorizon) / outerTropic) + Math.PI / 2;
  const azimuthLines = [];
  const cy = yCenter - 917.1126878612058;
  const r = 1356.8698103488061;
  for (let i = 1; i < 36; i++) {
    const firstPoint = getDirectionalPoint(i);
    const secondPoint = getDirectionalPoint(36 - i, false);
    const radius = getDirectionalRadius(firstPoint, secondPoint, i);

    const xDistance = secondPoint.x - firstPoint.x;
    const yDistance = secondPoint.y - firstPoint.y;
    azimuthLines.push(
      <path
        key={`d${i * 5}`}
        d={`M ${firstPoint.x},${firstPoint.y} a ${radius},${radius},0 0 0 ${xDistance},${yDistance}`}
      />
    );
  }

  function getDirectionalPoint(i, right = true) {
    const angleCorrection =
      Math.atan(cosHorizontal * Math.tan(i * tenDegrees)) +
      Math.floor((i + 17) / 36) * Math.PI;
    let x;
    let y;
    if (angleCorrection > upperRange) {
      x = xCenter + Math.sin(angleCorrection) * outerTropic;
      y = yCenter + Math.cos(angleCorrection) * outerTropic;
    } else {
      const gamma = Math.asin(
        ((yCenter /* oder ?*/ - cy) * Math.sin(Math.PI - angleCorrection)) / r
      );
      const beta = angleCorrection - gamma;
      x = xCenter + Math.sin(beta) * r;
      y = cy + Math.cos(beta) * r;
    }
    return { x: right ? x : kWidth - x, y: y, angle: angleCorrection };
  }

  /**
   * y = ax+b
   * y = cx+d
   * ax+b = cx+d
   * ax-cx = d-b
   * x(a-c) = d-b
   * x = (d-b)/(a-c)
   * y = tan(-i)x+y0-tan(-i)*x0
   * b = y0-a*x0
   * a = (yb-ya)/(xb-xa)
   * @param {Object{x: double, y: double}} firstPoint
   * @param {Object{x: double, y: double}} secondPoint
   */
  function getDirectionalRadius({ x: x1, y: y1 }, { x: x2, y: y2 }, i) {
    const firstFactor = (xCenter - x1) / (y1 - horizontalCenter);
    const firstCoefficient =
      (y1 + horizontalCenter) / 2 - (firstFactor * (x1 + xCenter)) / 2;
    const secondFactor = (xCenter - x2) / (y2 - horizontalCenter);
    const secondCoefficient =
      (y2 + horizontalCenter) / 2 - (secondFactor * (x2 + xCenter)) / 2;
    const x =
      (secondCoefficient - firstCoefficient) / (firstFactor - secondFactor);
    const y = firstFactor * x + firstCoefficient;
    const radius = Math.sqrt(
      Math.pow(y - horizontalCenter, 2) + Math.pow(x - xCenter, 2)
    );
    return radius;
  }

  return <g id="azimuth">{azimuthLines}</g>;
};

export default Azimuth;
