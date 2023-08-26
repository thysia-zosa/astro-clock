import { xCenter, yCenter } from "../../../utils/constants";

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
      <circle
        id="border"
        cx={xCenter}
        cy={yCenter}
        r="1732.0508075688767"
      />
      <line
        x1={xCenter}
        y1="467.94919243112327"
        x2={xCenter}
        y2="3932.0508075688767"
      />
    </g>
  );
};

export default Mater;
