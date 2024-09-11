import { useEffect, useState } from "react";
import {
  kEclipticCenterX,
  kEclipticRadius,
  yCenter,
} from "../../../utils/constants";
import { getSunLocation } from "../../../utils/math";

const Ecliptic = () => {
  const [sunLocation, setSunLocation] = useState(getSunLocation());

  useEffect(() => {
    const interval = setInterval(
      () => setSunLocation(getSunLocation()),
      600000
    );
    return () => clearInterval(interval);
  });

  return (
    <g id="eclipticCircle">
      <circle
        id="ecliptic"
        cx={kEclipticCenterX}
        cy={yCenter}
        r={kEclipticRadius}
        strokeWidth="3"
      />
      <circle
        id="sun"
        cx={sunLocation.x}
        cy={sunLocation.y}
        r="12"
        name="sun"
        fill="yellow"
        stroke="yellow"
        fillOpacity="1"
      />
    </g>
  );
};

export default Ecliptic;
