// import logo from "./logo.svg";
import "./App.css";
// import calculations from "./calculations";
function toRad(grad) {
  return (Math.PI * grad) / 180;
}

function toGrad(rad) {
  return (180 * rad) / Math.PI;
}

function stereoProject(radAngle) {
  radAngle = Math.PI / 2 - radAngle;
  return Math.sin(radAngle) / (1 + Math.cos(radAngle));
}

function App() {
  let time = new Date().getTime() - 946728000000;
  let t = time / 3155760000000;
  let longitude = 8.222566666666667;
  let latitude = /* 0.01; // */ 47.4756694444444445;
  const siderealEpoch = 10.46061837500001;

  // const eclipticAngle =
  //   42190703 / 1800000 -
  //   (46.836769 * t - 0.0001831 * t * t + 0.0020034 * t * t * t) / 3600;
  const xCenter = 1600;
  const yCenter = 1600;
  const eclipticAngle = 23.436206;
  const eclipticRadAngle = toRad(eclipticAngle);
  const equatorRadius = 1000;
  const tropicalFactor =
    Math.cos(eclipticRadAngle) / (1 - Math.sin(eclipticRadAngle));
  const innerTropic = equatorRadius / tropicalFactor;
  const outerTropic = equatorRadius * tropicalFactor;
  const eclipticRadius = (outerTropic + innerTropic) / 2;
  const eclipticCenter = yCenter + innerTropic - eclipticRadius;
  let siderealTime =
    (longitude + siderealEpoch + time / 239344.69591898023) % 360;

  const horizontalLines = [];
  let temporalHourAngle;
  let eqHorizon;
  for (let i = 5; i <= 90; i += 5) {
    const netherLine = equatorRadius * stereoProject(toRad(latitude - i));
    const upperLine = equatorRadius * stereoProject(toRad(latitude + i));
    const radius = (netherLine - upperLine) / 2;
    const center = yCenter - radius - upperLine;
    if (i - latitude > eclipticAngle) {
      /**
       * <path stroke-width="5" d="M 2942.485383091737 , 879.9372510401744 a 1356.8698103488061,1356.8698103488061 0 0,1 -2684.9707661834736 ,0"></path><rect y="879.9372510401744" height="100" fill-opacity="1" x="257.5146169082632" width="2684.9707661834736 "></rect>
       *
       * find y (879...):
       * cy1 = 1600 (y of center outerTropic)
       * r1 = 1523... (radius outerTropic)
       * cy2 = (y of center horizontalLine)
       * r2 = (radius horizontalLine, 1356....)
       * y = (r1^2 - r2^2 - cy1^2 + cy2^2) / (2 * (cy2 - cy1))
       *
       * find starting x (2942...):
       * x1 = 1600 + sqrt(r1^2 - (1600 - y)^2)
       *
       * find distance (-2684...):
       * distance = 2*x1 - 3200
       */
      const yLine =
        (outerTropic * outerTropic -
          radius * radius -
          yCenter * yCenter +
          center * center) /
        (2 * (center - yCenter));
      const startingX =
        1600 +
        Math.sqrt(
          outerTropic * outerTropic - (yCenter - yLine) * (yCenter - yLine)
        );
      const distance = 2 * (startingX - xCenter);
      horizontalLines.push(
        <path
          key={i}
          d={`M ${startingX} , ${yLine} a ${radius},${radius} 0 ${
            yLine > center ? 0 : 1
          },1 -${distance} ,0`}
          strokeWidth={i === 90 ? "3" : 1}
        />
      );
      if (i === 90) {
        temporalHourAngle = Math.asin((yCenter - yLine) / outerTropic) / 6;
        eqHorizon = yLine;
      }
    } else {
      horizontalLines.push(
        <circle
          key={i}
          cx="1600"
          cy={center.toString()}
          r={radius.toString()}
        />
      );
    }
  }
  // const horizontalMax = horizontalLines[horizontalLines.length - 1];
  // const horizontalClip = `circle(1523.403218538857px at ${
  //   horizontalMax.radius
  // } ${yCenter + horizontalMax.radius - horizontalMax.center})`;

  const temporalHours = [];
  const hour = Math.PI / 12;
  for (let i = 1; i <= 5; i++) {
    // Night
    const nightHourData = nightHours(i);
    // const dayHourData = dayHours(i);
    temporalHours.push(
      ...[
        // <line
        //   key={`n${6 - i}`}
        //   x1={nightHourData.startX}
        //   y1={nightHourData.startY}
        //   x2={nightHourData.endX}
        //   y2={nightHourData.endY}
        // />,
        // <line
        //   key={`n${6 + i}`}
        //   x1={3200 - nightHourData.startX}
        //   y1={nightHourData.startY}
        //   x2={3200 - nightHourData.endX}
        //   y2={nightHourData.endY}
        // />,
        <path
          key={`n${6 - i}`}
          d={`M ${nightHourData.startX},${nightHourData.startY} a ${nightHourData.radius},${nightHourData.radius},0 0 1 ${nightHourData.xDistance},${nightHourData.yDistance}`}
        />,
        <path
          key={`n${6 + i}`}
          d={`M ${3200 - nightHourData.startX},${nightHourData.startY} a ${
            nightHourData.radius
          },${nightHourData.radius},0 0 0 ${0 - nightHourData.xDistance},${
            nightHourData.yDistance
          }`}
        />,
        // <path
        //   key={`d${6 + i}`}
        //   d={`M ${dayHourData.startX},${dayHourData.startY} a ${nightHourData.radius},${nightHourData.radius},0 0 0 ${dayHourData.xDistance},${dayHourData.yDistance}`}
        // />,
        // <path
        //   key={`d${6 - i}`}
        //   d={`M ${3200 - dayHourData.startX},${dayHourData.startY} a ${
        //     nightHourData.radius
        //   },${nightHourData.radius},0 0 1 ${0 - dayHourData.xDistance},${
        //     dayHourData.yDistance
        //   }`}
        // />,
        // <line
        //   key={`d${6 + i}`}
        //   x1={dayHourData.startX}
        //   y1={dayHourData.startY}
        //   x2={dayHourData.endX}
        //   y2={dayHourData.endY}
        // />,
        // <line
        //   key={`d${6 - i}`}
        //   x1={3200 - dayHourData.startX}
        //   y1={dayHourData.startY}
        //   x2={3200 - dayHourData.endX}
        //   y2={dayHourData.endY}
        // />,
      ]
      //   <path
      //     key={i}
      //     d={`M ${startX} , ${startY} a ${radius},${radius} 0 0,1 ${xDistance} ,${yDistance}`}
      //   />
    );
  }

  function nightHours(i) {
    const startX =
      1600 + outerTropic * Math.sin(i * (temporalHourAngle + hour));
    const startY =
      1600 + outerTropic * Math.cos(i * (temporalHourAngle + hour));
    const endX = 1600 - innerTropic * Math.sin(i * (temporalHourAngle - hour));
    const endY = 1600 + innerTropic * Math.cos(i * (temporalHourAngle - hour));
    const radiusAngle = (6 - i) * hour;
    const radiusCenterDistance =
      (outerTropic - innerTropic) / Math.sin(i * temporalHourAngle) / 2;
    // const radiusX = 1600 + radiusCenterDistance * Math.cos(radiusAngle);
    // const radiusY = 1600 - radiusCenterDistance * Math.sin(radiusAngle);
    const radius = Math.sqrt(
      1000000 + radiusCenterDistance * radiusCenterDistance
    );
    //   (radiusX - startX) * (radiusX - startX) +
    //     (radiusY - startY) * (radiusY - startY)
    // );
    // console.log(radius);
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

  // function dayHours(i) {
  //   const startX =
  //     1600 + outerTropic * Math.sin(i * (temporalHourAngle - hour));
  //   const startY =
  //     1600 - outerTropic * Math.cos(i * (temporalHourAngle - hour));
  //   const endX = 1600 - innerTropic * Math.sin(i * (temporalHourAngle + hour));
  //   const endY = 1600 - innerTropic * Math.cos(i * (temporalHourAngle + hour));
  //   return {
  //     startX: startX,
  //     startY: startY,
  //     endX: endX,
  //     endY: endY,
  //     xDistance: endX - startX,
  //     yDistance: endY - startY,
  //   };
  // }

  /**
   * directional Lines:
   * arctan(cos(neigung)*tan(10°)) +abrunden((10°+90°)/180°)*180°
   * <circle cx="1600" cy="682.8873121387942" r="1356.8698103488061"></circle>
   */
  const tenDegrees = toRad(10);
  const horizontalCenter =
    yCenter - equatorRadius * stereoProject(toRad(latitude));
  const cosHorizontal = Math.cos(toRad(90 - latitude));
  const upperRange =
    Math.asin((yCenter - eqHorizon) / outerTropic) + Math.PI / 2;
  const directionalLines = [];
  for (let i = 1; i < 18; i++) {
    const angleCorrection =
      Math.atan(cosHorizontal * Math.tan(i * tenDegrees)) +
      Math.floor((i + 8) / 18) * Math.PI;
    const cy = 682.8873121387942;
    let x2;
    let y2;

    if (angleCorrection > upperRange) {
      // console.log("to big", i);
      x2 = xCenter + Math.sin(angleCorrection) * outerTropic;
      y2 = yCenter + Math.cos(angleCorrection) * outerTropic;
      // directionalLines.push(
      //   <line
      //     key={`d${i}`}
      //     x1={xCenter}
      //     y1={horizontalCenter}
      //     x2={xCenter + Math.sin(angleCorrection) * outerTropic}
      //     y2={yCenter + Math.cos(angleCorrection) * outerTropic}
      //   />
      // );
    } else {
      const r = 1356.8698103488061;
      const gamma = Math.asin(
        ((1600 - cy) * Math.sin(Math.PI - angleCorrection)) / r
      );
      const beta = angleCorrection - gamma;
      // if (i > 9) {
      //   beta = Math.PI - beta;
      // }
      // const a = angleCorrection * angleCorrection + 1;
      // const b =
      //   2 * angleCorrection * xCenter -
      //   2 * angleCorrection * angleCorrection * xCenter -
      //   2 * cy;
      // const c =
      //   angleCorrection * angleCorrection * xCenter * xCenter +
      //   xCenter * xCenter -
      //   2 * angleCorrection * xCenter * xCenter +
      //   cy * cy +
      //   2 * xCenter +
      //   xCenter * xCenter -
      //   2 * angleCorrection * xCenter * xCenter -
      //   r * r;
      //   const pqTerm = Math.sqrt(b*b-4*a*c);
      //   const sol1 = (-b+pqTerm)/(2*a);
      //   const sol2 = (-b-pqTerm)/(2*a);
      // console.log(i, sol1, sol2);
      // directionalLines.push(
      //   <line
      //     key={`d${i}`}
      //     x1={xCenter}
      //     y1={horizontalCenter}
      //     x2={xCenter + Math.sin(beta) * r}
      //     y2={cy + Math.cos(beta) * r}
      //   />
      // );
      x2 = xCenter + Math.sin(beta) * r;
      y2 = cy + Math.cos(beta) * r;
    }

    const xDistance = x2 - xCenter;
    const yDistance = y2 - horizontalCenter;
    const spiegelAngle = Math.atan2(xDistance, yDistance)+((9-i)*tenDegrees);
    const radius = Math.sqrt(xDistance*xDistance+yDistance*yDistance)*Math.sin(spiegelAngle)/Math.sin(Math.PI-2*spiegelAngle);
    console.log(radius);
    directionalLines.push(
      <path
        key={`d${360 - i * 10}`}
        d={`M ${xCenter},${horizontalCenter} a ${radius},${radius},0 0 1 ${xDistance},${yDistance}`}
      />
    );
  }

  const test = [];
  for (let i = 0; i < 24; i++) {
    const x2 = 1600 + 1600 * Math.sin((i * Math.PI) / 12);
    const y2 = 1600 - 1600 * Math.cos((i * Math.PI) / 12);
    test.push(<line x1="1600" y1="1600" x2={x2} y2={y2} />);
  }

  return (
    // <img src={logo} />
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3200 3200">
      <g stroke="#61DAFB" strokeWidth="1" fillOpacity="0">
        <g id="latitudinal" strokeWidth="3">
          <circle id="equator" cx="1600" cy="1600" r="1000" />
          <circle id="innerTropic" cx="1600" cy="1600" r="656.4250277475" />
          <circle id="outerTropic" cx="1600" cy="1600" r="1523.403218538857" />
          <line
            x1="1600"
            y1="76.596781461143"
            x2="1600"
            y2="3123.403218538857"
          />
        </g>
        <g
          id="horizontal"
          // style={{ clipPath: horizontalClip }}
        >
          <g id="horizontalLines">{horizontalLines}</g>
          <g id="directionalLines">{directionalLines}</g>
          {/* <g id="temporalLines">{temporalHours}</g> */}
        </g>
        {/* <g id="fixed">
          <g id="ecliptic" transform={`rotate(${siderealTime},1600,1600)`}>
            <circle
              id="ecliptic"
              cx="1600"
              cy="1166.5109046043215"
              r="1089.9141231431786"
              strokeWidth="3"
            />
          </g>
        </g> */}
      </g>
    </svg>
  );
}

export default App;

/**
 * <path d="M 2942.4853830917373,879.9372510401747 a 836.3206874681908,836.3206874681908,0 0 1 -764.0167320330688,1030.333335377021" stroke="red"></path>
 * <path d="M 2942.485383091737 , 879.9372510401744 a 1356.8698103488061,1356.8698103488061 0 0,1 -2684.9707661834736 ,0" stroke-width="3"></path>
 */
