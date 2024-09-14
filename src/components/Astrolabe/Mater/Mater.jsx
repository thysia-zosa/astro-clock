import {
  kBorder,
  kLimbus,
  kRadius,
  kTropicalFactor,
  xCenter,
  yCenter,
} from "../../../utils/constants";

const Mater = () => {
  return (
    <g id="mater" strokeWidth="3">
      <circle id="equator" cx={xCenter} cy={yCenter} r={kRadius} />
      <circle
        id="innerTropic"
        cx={xCenter}
        cy={yCenter}
        r={kRadius * kTropicalFactor}
      />
      <circle
        id="outerTropic"
        cx={xCenter}
        cy={yCenter}
        r={kRadius / kTropicalFactor}
      />
      <circle id="border" cx={xCenter} cy={yCenter} r={kBorder} strokeOpacity="1" />
      <circle id="limbus" cx={xCenter} cy={yCenter} r={kLimbus} strokeOpacity="1" />
      <line
        x1={xCenter}
        y1={yCenter - kBorder}
        x2={xCenter}
        y2={yCenter + kBorder}
      />
    </g>
  );
};

export default Mater;
