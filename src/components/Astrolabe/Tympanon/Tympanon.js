import Altitude from "./Altitude";
import Azimuth from "./Azimuth";
import TemporalHours from "./TemporalHours";

const Tympanon = () => {
  return (
    <g id="tympanon">
      <Altitude />
      <Azimuth />
      <TemporalHours />
    </g>
  );
};

export default Tympanon;
