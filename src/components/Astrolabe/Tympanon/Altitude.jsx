import { kRadius, xCenter, yCenter } from "../../../utils/constants";
import { stereoProject, toRad } from "../../../utils/math";

const Altitude = () => {
  let latitude = 47.4756694444444445;

  // const xCenter = 1600;
  // const yCenter = 1600;
  const eclipticAngle = 23.436206;
  const eclipticRadAngle = toRad(eclipticAngle);
  const equatorRadius = kRadius;
  const tropicalFactor =
    Math.cos(eclipticRadAngle) / (1 - Math.sin(eclipticRadAngle));
  const outerTropic = equatorRadius * tropicalFactor;

  const altitudeCircles = [];
  for (let i = 2; i <= 90; i += 2) {
    const netherLine = equatorRadius * stereoProject(toRad(latitude - i));
    const upperLine = equatorRadius * stereoProject(toRad(latitude + i));
    const radius = (netherLine - upperLine) / 2;
    const center = yCenter - radius - upperLine;
    if (i - latitude > eclipticAngle) {
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
      const yLine =
        (outerTropic * outerTropic -
          radius * radius -
          yCenter * yCenter +
          center * center) /
        (2 * (center - yCenter));
      const startingX =
        xCenter +
        Math.sqrt(
          outerTropic * outerTropic - (yCenter - yLine) * (yCenter - yLine)
        );
      const distance = 2 * (startingX - xCenter);
      altitudeCircles.push(
        <path
          key={i}
          d={`M ${startingX} , ${yLine} a ${radius},${radius} 0 ${
            yLine > center ? 0 : 1
          },1 -${distance} ,0`}
          strokeWidth={i === 90 ? "3" : 1}
        />
      );
    } else {
      altitudeCircles.push(
        <circle
          key={i}
          cx={xCenter}
          cy={center.toString()}
          r={radius.toString()}
        />
      );
    }
  }

  return <g id="altitude">{altitudeCircles}</g>;
};

export default Altitude;
