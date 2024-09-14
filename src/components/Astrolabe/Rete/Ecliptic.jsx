// import { useEffect, useState } from "react";
import {
  kEclipticCenterX,
  kEclipticRadius,
  yCenter,
} from "../../../utils/constants";
import {
  getSunLocation,
  getSunCoords,
  getPlanet,
  getMoonCoords,
} from "../../../utils/math";
import planets from "../../../data/planets";

const Ecliptic = () => {
  // const [sunLocation, setSunLocation] = useState(getSunLocation());

  // useEffect(() => {
  //   const interval = setInterval(
  //     () => setSunLocation(getSunLocation()),
  //     600000
  //   );
  //   return () => clearInterval(interval);
  // });

  const { meanAnomaly, ecclipticLongitude } = getSunLocation();
  const sunCoords = getSunCoords(ecclipticLongitude);
  const planetPart = planets.map((p) => getPlanet(p, ecclipticLongitude));
  const moonCoords = getMoonCoords(meanAnomaly, ecclipticLongitude);

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
        cx={sunCoords.x}
        cy={sunCoords.y}
        r="20"
        name="sun"
        fill="yellow"
        stroke="yellow"
        fillOpacity="1"
      />
      {planetPart.map((p) => (
        <circle
          key={p.name}
          id={p.name}
          cx={p.x}
          cy={p.y}
          r={p.rad}
          fill={p.color}
          stroke={p.color}
          fillOpacity="1"
        />
      ))}
      <circle
        id="moon"
        cx={moonCoords.x}
        cy={moonCoords.y}
        r="20"
        name="moon"
        fill="lightgrey"
        stroke="lightgrey"
        fillOpacity="1"
      />
    </g>
  );
};

export default Ecliptic;
