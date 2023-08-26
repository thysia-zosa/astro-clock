import { useEffect, useState } from "react";
import { xCenter, yCenter } from "../../../utils/constants";

const Rete = () => {
  let longitude = 8.222566666666667;
  const siderealEpoch = 10.46061837500001;

  function getSiderealTime() {
    let time = new Date().getTime() - 946728000000;
    return (longitude + siderealEpoch + time / 239344.69591898023) % 360;
  }
  const [siderealTime, setSiderealTime] = useState(getSiderealTime());

  useEffect(() => {
    const interval = setInterval(
      () => setSiderealTime(getSiderealTime()),
      5000
    );
    return () => clearInterval(interval);
  });

  return (
    <g id="rete" transform={`rotate(${siderealTime},${xCenter},${yCenter})`}>
      <g id="eclipticCircle">
        <circle
          id="ecliptic"
          cx={xCenter}
          cy={yCenter - 433.48909539567853}
          r="1089.9141231431786"
          strokeWidth="3"
        />
      </g>
    </g>
  );
};

export default Rete;
