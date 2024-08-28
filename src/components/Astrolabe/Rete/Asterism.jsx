const Asterism = ({ lines }) => {
  return (
    <g className="asterism" stroke="white" strokeOpacity="0.5" strokeWidth="1">
      {lines.map((line, index) => (
        <path key={index} d={line} />
      ))}
    </g>
  );
};

export default Asterism;
