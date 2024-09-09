import {
  kRadius,
  kTropicalFactor,
  kWidth,
  xCenter,
  yCenter,
} from "../../../utils/constants";
import {
  getStereoCircle,
  getYOfHorizontalIntersection,
} from "../../../utils/math";

const TemporalHours = () => {
  let latitude = 47.252222222222;

  const innerTropic = kRadius / kTropicalFactor;
  const outerTropic = kRadius * kTropicalFactor;

  const { center: horizontalCenter, radius: horizontalRadius } =
    getStereoCircle(latitude, 90);

  const eqHorizon = getYOfHorizontalIntersection(
    outerTropic,
    yCenter,
    horizontalRadius,
    horizontalCenter
  );

  const temporalHourAngle = Math.asin((yCenter - eqHorizon) / outerTropic) / 6;
  const hour = Math.PI / 12;

  function getAllHourLines() {
    const temporalHourLines = [];
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
    return temporalHourLines;
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

  return <g id="temporalHours">{getAllHourLines()}</g>;
};

export default TemporalHours;
