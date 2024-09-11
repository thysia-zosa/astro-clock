import {
  kEclipticCenterX,
  kEclipticRadius,
  yCenter,
} from "../../../utils/constants";

const Ecliptic = () => {
  return (
    <g id="eclipticCircle">
      <circle
        id="ecliptic"
        cx={kEclipticCenterX}
        cy={yCenter}
        r={kEclipticRadius}
        strokeWidth="3"
      />
    </g>
  );
};

export default Ecliptic;
