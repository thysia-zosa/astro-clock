const Star = ({ starid, radius, x, y }) => {
  return (
    <circle
      className="star"
      starid={starid}
      r={radius}
      cx={x}
      cy={y}
      fill="white"
      stroke="white"
      fillOpacity="1"
    />
  );
};

export default Star;
