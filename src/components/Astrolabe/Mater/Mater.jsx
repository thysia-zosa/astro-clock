import { kBorder, xCenter, yCenter } from "../../../utils/constants";

const Mater = () => {
  return (
    <g id="mater" strokeWidth="3">
      <circle id="equator" cx={xCenter} cy={yCenter} r="1000" />
      <circle id="innerTropic" cx={xCenter} cy={yCenter} r="656.4250277475" />
      <circle
        id="outerTropic"
        cx={xCenter}
        cy={yCenter}
        r="1523.403218538857"
      />
      <circle id="border" cx={xCenter} cy={yCenter} r={kBorder} />
      <circle id="limbus" cx={xCenter} cy={yCenter} r="1780" />
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
