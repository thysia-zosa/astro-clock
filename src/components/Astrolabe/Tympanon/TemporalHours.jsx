import { kRadius, kWidth, xCenter, yCenter } from "../../../utils/constants";
import { stereoProject, toRad } from "../../../utils/math";

const TemporalHours = () => {
  let latitude = 47.4756694444444445;
  // const eclipticAngle =
  //   42190703 / 1800000 -
  //   (46.836769 * t - 0.0001831 * t * t + 0.0020034 * t * t * t) / 3600;
  const eclipticAngle = 23.436206;
  const eclipticRadAngle = toRad(eclipticAngle);
  const equatorRadius = kRadius;
  const tropicalFactor =
    Math.cos(eclipticRadAngle) / (1 - Math.sin(eclipticRadAngle));
  const innerTropic = equatorRadius / tropicalFactor;
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
  const temporalHourAngle = Math.asin((yCenter - eqHorizon) / outerTropic) / 6;

  const temporalHourLines = [];
  const hour = Math.PI / 12;
  for (let i = 1; i <= 5; i++) {
    const nightHourData = nightHours(i);
    temporalHourLines.push(
      ...[
        <path
          key={`n${6 - i}`}
          d={`M ${nightHourData.startX},${nightHourData.startY} a ${nightHourData.radius},${nightHourData.radius},0 0 1 ${nightHourData.xDistance},${nightHourData.yDistance}`}
        />,
        <path
          key={`n${6 + i}`}
          d={`M ${kWidth - nightHourData.startX},${nightHourData.startY} a ${
            nightHourData.radius
          },${nightHourData.radius},0 0 0 ${0 - nightHourData.xDistance},${
            nightHourData.yDistance
          }`}
        />,
      ]
    );
  }

  function nightHours(i) {
    const startX =
      xCenter + outerTropic * Math.sin(i * (temporalHourAngle + hour));
    const startY =
      yCenter + outerTropic * Math.cos(i * (temporalHourAngle + hour));
    const endX =
      xCenter - innerTropic * Math.sin(i * (temporalHourAngle - hour));
    const endY =
      yCenter + innerTropic * Math.cos(i * (temporalHourAngle - hour));
    const radiusCenterDistance =
      (outerTropic - innerTropic) / Math.sin(i * temporalHourAngle) / 2;
    const radius = Math.sqrt(
      kRadius * kRadius + radiusCenterDistance * radiusCenterDistance
    );
    return {
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      xDistance: endX - startX,
      yDistance: endY - startY,
      radius: radius,
    };
  }

  return <g id="temporalHours">{temporalHourLines}</g>;
};

export default TemporalHours;
