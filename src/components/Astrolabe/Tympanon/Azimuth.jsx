import {
  kBorder,
  kRadius,
  kWidth,
  xCenter,
  yCenter,
} from "../../../utils/constants";
import {
  getCirclesIntersection,
  getStereoCircle,
  getYOfHorizontalIntersection,
  stereoProject,
  toRad,
} from "../../../utils/math";

const Azimuth = () => {
  let latitude = 47.4756694444444445;

  // center and radius of horizon circle
  const { center: horizontalCenter, radius: horizontalRadius } =
    getStereoCircle(latitude, 90);

  // y of where the horizon crosses the border
  const eqHorizon = getYOfHorizontalIntersection(
    kBorder,
    yCenter,
    horizontalRadius,
    horizontalCenter
  );

  // angle of Intersection horizon/border
  const upperRange = Math.asin((yCenter - eqHorizon) / kBorder) + Math.PI / 2;

  const interval = toRad(5);
  const zenith = yCenter - kRadius * stereoProject(toRad(latitude));

  function getAllLines() {
    const azimuthLines = [];
    for (let i = 1; i < 36; i++) {
      azimuthLines.push(getAzimuthLine(i));
    }
    return azimuthLines;
  }

  /**
   * Returns the horizontal part of a azimuthal circle
   *
   * directional Lines:
   * arctan(cos(neigung)*tan(10°)) +abrunden((10°+90°)/180°)*180°
   * <circle cx="1600" cy="682.8873121387942" r="1356.8698103488061"></circle>
   */
  function getAzimuthLine(i) {
    // calculate the two intersections of azimuthal circle with horizontal circle
    let firstPoint = getAzimuthPoint(i);
    let secondPoint = getAzimuthPoint(36 - i, false);
    // calculate azimuth circle data
    const { x, y, radius } = getAzimuthRadius(firstPoint, secondPoint, i);

    // correct points if outside border
    if (firstPoint.angle > upperRange) {
      firstPoint = getBorderPoint(firstPoint, x, y, radius);
    }
    if (secondPoint.angle > upperRange) {
      secondPoint = getBorderPoint(secondPoint, x, y, radius);
    }

    const xDistance = secondPoint.x - firstPoint.x;
    const yDistance = secondPoint.y - firstPoint.y;
    return (
      <path
        key={`d${i * 5}`}
        d={`M ${firstPoint.x},${firstPoint.y} a ${radius},${radius},0 0 0 ${xDistance},${yDistance}`}
      />
    );
  }

  // ???
  const cosHorizontal = Math.cos(toRad(90 - latitude));

  /**
   * Transforms the horizontal angle of a horizontal point to
   * an equatorial angle
   *
   * horizontal point: Point on the horizon / horizontal circle
   * horizontal angle: Angle of horizontal point as seen from
   * horizontal center
   * equatorial angle: Angle of horizontal point as seen from
   * equatorial center / north pole
   *
   * cos(alpha) = tan(b) / tan(c)
   * alpha is the horizon's inclination towards the equator,
   * b is the (searched for) equatorial angle from
   * c, the horizontal angle
   * @param {*} angle
   * @param {*} addPi
   * @returns
   */
  function getAzimuthalAngleCorrection(angle, addPi) {
    let result = Math.atan(cosHorizontal * Math.tan(angle));
    if (addPi) {
      result += Math.PI;
    }
    return result;
  }

  /**
   *
   * @param {double} i count of intervals
   * @param {boolean} right on the right side of astrolabe (x>xCenter)
   * @returns
   */
  function getAzimuthPoint(i, right = true) {
    let angleCorrection = getAzimuthalAngleCorrection(
      i * interval,
      Math.floor((i + 17) / 36)
    );
    /**
     * sin(180°-alpha)/c = sin(gamma)/b
     * alpha: angleCorrection
     * gamma: angle between north Pole and horizontal center seen from azimuthal Point
     * b: distance between north Pole and horizontal center
     * c: horizontal Radius
     */
    const gamma = Math.asin(
      ((yCenter - horizontalCenter) * Math.sin(Math.PI - angleCorrection)) /
        horizontalRadius
    );

    // projected horizontal angle
    const beta = angleCorrection - gamma;
    const x = xCenter + Math.sin(beta) * horizontalRadius;
    const y = horizontalCenter + Math.cos(beta) * horizontalRadius;
    // }
    return { x: right ? x : kWidth - x, y: y, angle: angleCorrection };
  }

  /**
   * Calculates the center coordinates of the azimuthal circle
   *
   * The center is at the intersection of the median lines between
   * each Point and the zenith, as the azimuthal circle touches
   * all these three points
   *
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
  function getAzimuthRadius({ x: x1, y: y1 }, { x: x2, y: y2 }, i) {
    const firstFactor = (xCenter - x1) / (y1 - zenith);
    const firstCoefficient =
      (y1 + zenith) / 2 - (firstFactor * (x1 + xCenter)) / 2;
    const secondFactor = (xCenter - x2) / (y2 - zenith);
    const secondCoefficient =
      (y2 + zenith) / 2 - (secondFactor * (x2 + xCenter)) / 2;
    const x =
      (secondCoefficient - firstCoefficient) / (firstFactor - secondFactor);
    const y = firstFactor * x + firstCoefficient;
    const radius = Math.sqrt(
      Math.pow(y - zenith, 2) + Math.pow(x - xCenter, 2)
    );
    return { x, y, radius };
  }

  /**
   * Calculates the intersection of border circle and azimuthal circle.
   *
   * used when the second point of an azimuthal line lies outside the border cirlce
   * @param {{float,float,float}} uncorrected : Azimuthal Point with x,y,angleCorrection
   * @param {*} x center-x of azimuthal Circle
   * @param {*} y center-y of azimuthal Circle
   * @param {*} radius of azimuthal Circle
   * @returns Azimuthal Point of azimuthal Circle on Border
   */
  function getBorderPoint(uncorrected, x, y, radius) {
    const intersections = getCirclesIntersection(
      x,
      y,
      radius,
      xCenter,
      yCenter,
      kBorder
    );
    const lowerIS =
      intersections.results[0].y < intersections.results[1].y
        ? intersections.results[0]
        : intersections.results[1];
    return { ...uncorrected, x: lowerIS.x, y: lowerIS.y };
  }

  return <g id="azimuth">{getAllLines()}</g>;
};

export default Azimuth;
