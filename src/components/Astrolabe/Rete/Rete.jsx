import { useEffect, useState } from "react";
import { xCenter, yCenter } from "../../../utils/constants";

const Rete = () => {
  let longitude = 8.222566666666667;
  
  /**
   * sidereal Time (in degrees) at J2000.0
   */
  const siderealEpoch = 280.46061837500001;

  /**
   * J2000.0 epoch in Unix-miliseconds
   */
  const unixJ2000 = 946728000000

  /**
   * Miliseconds for a sidereal movement of 1 degree.
   */
  const siderealDegree = 239344.69591898023;

  /**
   * Simplified calculation of sidereal time in degrees
   * 
   * Calculates the degrees passed since J2000.0 according to the 
   * middle apparent movement of the sky
   * 
   * @returns the current sidereal time of [longitude] in degrees
   */
  function getSiderealTime() {
    let time = new Date().getTime() - unixJ2000;
    return (longitude + siderealEpoch + time / siderealDegree) % 360;
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
          cx={xCenter + 433.48909539567853}
          cy={yCenter}
          r="1089.9141231431786"
          strokeWidth="3"
        />
      </g>
    </g>
  );
};

export default Rete;
