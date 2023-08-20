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

  const temporalHours = [];
  const hour = Math.PI / 12;
  for (let i = 1; i <= 5; i++) {
    const nightHourData = nightHours(i);
    temporalHours.push(
      ...[
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
      ]
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
    const radius = Math.sqrt(
      1000000 + radiusCenterDistance * radiusCenterDistance
    );
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
  const cy = 682.8873121387942;
  const r = 1356.8698103488061;
  for (let i = 1; i < 18; i++) {
    const firstPoint = getDirectionalPoint(i);
    const secondPoint = getDirectionalPoint(18 - i, false);
    const radius = getDirectionalRadius(firstPoint, secondPoint, i);

    const xDistance = secondPoint.x - firstPoint.x;
    const yDistance = secondPoint.y - firstPoint.y;
    // const spiegelAngle =
    //   Math.atan2(xDistance, yDistance) + (9 - i) * tenDegrees;
    // const radius =
    //   (Math.sqrt(xDistance * xDistance + yDistance * yDistance) *
    //     Math.sin(spiegelAngle)) /
    //   Math.sin(Math.PI - 2 * spiegelAngle);
    // console.log(radius);
    directionalLines.push(
      // <line
      //   x1={firstPoint.x}
      //   y1={firstPoint.y}
      //   x2={secondPoint.x}
      //   y2={secondPoint.y}
      // />
      <path
        key={`d${i * 10}`}
        d={`M ${firstPoint.x},${firstPoint.y} a ${radius},${radius},0 0 0 ${xDistance},${yDistance}`}
      />
    );
  }

  function getDirectionalPoint(i, right = true) {
    const angleCorrection =
      Math.atan(cosHorizontal * Math.tan(i * tenDegrees)) +
      Math.floor((i + 8) / 18) * Math.PI;
    let x;
    let y;
    if (angleCorrection > upperRange) {
      x = xCenter + Math.sin(angleCorrection) * outerTropic;
      y = yCenter + Math.cos(angleCorrection) * outerTropic;
    } else {
      const gamma = Math.asin(
        ((1600 - cy) * Math.sin(Math.PI - angleCorrection)) / r
      );
      const beta = angleCorrection - gamma;
      x = xCenter + Math.sin(beta) * r;
      y = cy + Math.cos(beta) * r;
    }
    return { x: right ? x : 3200 - x, y: y, angle: angleCorrection };
  }

  /**
   * y = ax+b
   * y = cx+d
   * ax+b = cx+d
   * ax-cx = d-b
   * x(a-c) = d-b
   * x = (d-b)/(a-c)
   * y = tan(-i)x+y0-tan(-i)*x0
   * b = y0-a*x0
   * a = (yb-ya)/(xb-xa)
   * @param {Object{x: double, y: double}} firstPoint
   * @param {Object{x: double, y: double}} secondPoint
   */
  function getDirectionalRadius({ x: x1, y: y1 }, { x: x2, y: y2 }, i) {
    // const firstFactor = Math.tan(-i * tenDegrees);
    // const firstCoefficient = horizontalCenter - firstFactor * xCenter;
    const firstFactor = (xCenter - x1) / (y1 - horizontalCenter);
    const firstCoefficient =
      (y1 + horizontalCenter) / 2 - (firstFactor * (x1 + xCenter)) / 2;
    const secondFactor = (xCenter - x2) / (y2 - horizontalCenter);
    const secondCoefficient =
      (y2 + horizontalCenter) / 2 - (secondFactor * (x2 + xCenter)) / 2;
    // const secondFactor = (x2 - x1) / (y1 - y2);
    // const secondCoefficient = (y1 + y2) / 2 - (secondFactor * (x1 + x2)) / 2;
    const x =
      (secondCoefficient - firstCoefficient) / (firstFactor - secondFactor);
    const y = firstFactor * x + firstCoefficient;
    console.log(x,x1,y,y1);
    // directionalLines.push(...[
    //   <line
    //     x1={0}
    //     y1={firstCoefficient}
    //     x2={3200}
    //     y2={3200 * firstFactor + firstCoefficient}
    //   />,
    //   <line
    //     x1={0}
    //     y1={secondCoefficient}
    //     x2={3200}
    //     y2={3200 * secondFactor + secondCoefficient}
    //   />,
    //   <line
    //     x1={x1}
    //     y1={y1}
    //     x2={x2}
    //     y2={y2}
    //   />,
    // ]);
    const radius = Math.sqrt(
      Math.pow(y - horizontalCenter, 2) + Math.pow(x - xCenter, 2)
    );
    return radius;
  }

  // directionalLines.push([
  //   <line x1={0} y1={horizontalCenter} x2={3200} y2={horizontalCenter} />,
  // ]);
  // for (let i = 0; i < 24; i++) {
  //   const x2 = 1600 + 1600 * Math.sin((i * Math.PI) / 12);
  //   const y2 = 1600 - 1600 * Math.cos((i * Math.PI) / 12);
  //   test.push(<line x1="1600" y1="1600" x2={x2} y2={y2} />);
  // }

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
