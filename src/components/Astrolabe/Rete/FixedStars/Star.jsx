const Star = ({ starid, radius, x, y, name }) => {
  return (
    <circle
      className="star"
      id={starid}
      r={radius}
      cx={x}
      cy={y}
      name={name}
      fill="white"
      stroke="white"
      fillOpacity="1"
    />
  );
};

export default Star;
