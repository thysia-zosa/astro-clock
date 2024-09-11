import { useEffect, useState } from "react";
import { xCenter, yCenter } from "../../../utils/constants";
import { getSiderealTime } from "../../../utils/math";
import constellations from "../../../data/constellations";
import Constellation from "./Constellation";

const Rete = () => {
  let longitude = 7.849444444444444;

  const [siderealTime, setSiderealTime] = useState(getSiderealTime(longitude));

  useEffect(() => {
    const interval = setInterval(
      () => setSiderealTime(getSiderealTime(longitude)),
      5000
    );
    return () => clearInterval(interval);
  });

  return (
    <g id="rete" transform={`rotate(${siderealTime},${xCenter},${yCenter})`}>
      <g id="eclipticCircle">
        <circle
          id="ecliptic"
          cx={xCenter + 433.48909539567853}
          cy={yCenter}
          r="1089.9141231431786"
          strokeWidth="3"
        />
      </g>
      <g id="constellations">
        {constellations.map(({ name, stars, asterism }) => (
          <Constellation
            key={name}
            name={name}
            stars={stars}
            asterism={asterism}
          />
        ))}
      </g>
    </g>
  );
};

export default Rete;
