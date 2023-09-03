import {
  kBorder,
  kRadius,
  kWidth,
  xCenter,
  yCenter,
} from "../../../utils/constants";
import {
  getStereoCircle,
  getYOfHorizontalIntersection,
  stereoProject,
  toRad,
} from "../../../utils/math";

const Azimuth = () => {
  let latitude = 47.4756694444444445;

  // data of horizon line crossing the north-south-line
  // const netherLine = kRadius * stereoProject(toRad(latitude - 90));
  // const upperLine = kRadius * stereoProject(toRad(latitude + 90));
  // const radius = (netherLine - upperLine) / 2;
  // const center = yCenter - radius - upperLine;
  const { center: horizontalCenter, radius: horizontalRadius } =
    getStereoCircle(latitude, 90);

  // y of where the horizon crosses the outerTropic
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

  // ???
  const cosHorizontal = Math.cos(toRad(90 - latitude));

  function getAllLines() {
    const azimuthLines = [];
    for (let i = 1; i < 36; i++) {
      azimuthLines.push(getAzimuthLine(i));
    }
    return azimuthLines;
  }

  /**
   * directional Lines:
   * arctan(cos(neigung)*tan(10°)) +abrunden((10°+90°)/180°)*180°
   * <circle cx="1600" cy="682.8873121387942" r="1356.8698103488061"></circle>
   */
  function getAzimuthLine(i) {
    const firstPoint = getAzimuthPoint(i);
    let secondPoint = getAzimuthPoint(36 - i, false);
    const {x,y,radius} = getAzimuthRadius(firstPoint, secondPoint, i);

    if (secondPoint.angle > upperRange){
      secondPoint = getBorderPoint(secondPoint,x,y,radius);
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

  function getAzimuthPoint(i, right = true) {
    const angleCorrection =
      Math.atan(cosHorizontal * Math.tan(i * interval)) +
      Math.floor((i + 17) / 36) * Math.PI;
    let x;
    let y;
    // if (angleCorrection > upperRange) {
    //   x = xCenter + Math.sin(angleCorrection) * kBorder;
    //   y = yCenter + Math.cos(angleCorrection) * kBorder;
    // } else {
      const gamma = Math.asin(
        ((yCenter /* oder ?*/ - horizontalCenter) *
          Math.sin(Math.PI - angleCorrection)) /
          horizontalRadius
      );
      const beta = angleCorrection - gamma;
      x = xCenter + Math.sin(beta) * horizontalRadius;
      y = horizontalCenter + Math.cos(beta) * horizontalRadius;
    // }
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
    return {x,y,radius};
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
  function getBorderPoint(uncorrected, x,y,radius){
    return {...uncorrected}
  }

  return <g id="azimuth">{getAllLines()}</g>;
};

export default Azimuth;
