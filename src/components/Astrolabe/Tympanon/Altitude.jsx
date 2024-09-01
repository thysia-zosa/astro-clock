import { kBorder, kRadius, xCenter, yCenter } from "../../../utils/constants";
import {
  getStereoCircle,
  getXOfHorizontalIntersection,
  getYOfHorizontalIntersection,
  toGrad,
} from "../../../utils/math";

const Altitude = () => {
  // TODO: Move to store
  let latitude = 47.4756694444444445;

  // hypothetical latitude of border circle (27°33'47.5" south / north)
  const borderAngle = toGrad(2 * Math.atan(kBorder / kRadius)) - 90;

  function getAllCircles() {
    const circles = [];
    for (let i = 2; i <= 90; i += 2) {
      circles.push(getAltitudeCircle(i));
    }
    return circles;
  }

  function getAltitudeCircle(i) {
    const { radius, center } = getStereoCircle(latitude, i);
    if (i - latitude > borderAngle) {
      // altitude circle overflows border limit, no complete circle
      return getIncompleteCircle(i, center, radius);
    }
    return (
      <circle
        key={i}
        cx={xCenter}
        cy={center.toString()}
        r={radius.toString()}
        strokeWidth={i % 10 === 0 ? "2" : 1}
      />
    );
  }

  /**
   * <path stroke-width="5" d="M 2942.485383091737 , 879.9372510401744 a 1356.8698103488061,1356.8698103488061 0 0,1 -2684.9707661834736 ,0"></path><rect y="879.9372510401744" height="100" fill-opacity="1" x="257.5146169082632" width="2684.9707661834736 "></rect>
   *
   * find y (879...):
   * cy1 = 1600 (y of center outerTropic)
   * r1 = 1523... (radius outerTropic)
   * cy2 = (y of center horizontalLine)
   * r2 = (radius horizontalLine, 1356....)
   * y = (r1^2 - r2^2 - cy1^2 + cy2^2) / (2 * (cy2 - cy1))
   *
   * find starting x (2942...):
   * x1 = 1600 + sqrt(r1^2 - (1600 - y)^2)
   *
   * find distance (-2684...):
   * distance = 2*x1 - 3200
   */
  function getIncompleteCircle(i, center, radius) {
    // yCoordinate of starting and ending point of the incomplete circle
    // calculated as intersection of border circle and altitude circle
    // r1: kBorder, r2: radius, y1; yCenter, y2: center
    const yLine = getYOfHorizontalIntersection(
      kBorder,
      yCenter,
      radius,
      center
    );
    const startingX =
      xCenter + getXOfHorizontalIntersection(kBorder, yCenter, yLine);
    const distance = 2 * (startingX - xCenter);
    return (
      <path
        key={i}
        d={`M ${startingX} , ${yLine} a ${radius},${radius} 0 ${
          yLine > center ? 0 : 1
        },1 -${distance} ,0`}
        strokeWidth={i % 10 === 0 ? "2" : 1}
      />
    );
  }

  return <g id="altitude">{getAllCircles()}</g>;
};

export default Altitude;
