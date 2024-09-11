import Star from "./Star";
import Asterism from "./Asterism";

const Constellation = ({ name, stars, asterism }) => {
  return (
    <g className="constellation" id={name}>
      <g className="stars">
        {stars.map((star, index) => (
          <Star
            key={index}
            starid={star.id}
            radius={star.rad}
            x={star.x}
            y={star.y}
            name={star.name}
          />
        ))}
      </g>
      {asterism && <Asterism lines={asterism} />}
    </g>
  );
};

export default Constellation;
