import Mater from "./Mater/Mater";
import Rete from "./Rete/Rete";
import Tympanon from "./Tympanon/Tympanon";

const Astrolabe = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3200 3200">
      <g stroke="#61DAFB" strokeWidth="1" fillOpacity="0">
        <Mater />
        <Tympanon />
        <Rete />
      </g>
    </svg>
  );
};

export default Astrolabe;
