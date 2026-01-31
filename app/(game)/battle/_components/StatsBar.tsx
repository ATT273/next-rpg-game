interface Props {
  stat: number;
  maxStat: number;
}
function StatsBar(props: Props) {
  const { stat, maxStat } = props;

  return (
    <div style={{ position: "relative" }}>
      <div className="w-37.5 h-3.75 bg-stone-300 rounded-full"></div>
      <div
        style={{
          height: "15px",
          width: `${(stat / maxStat) * 150}px`,
          position: "absolute",
          top: "0px",
          left: "0px",
        }}
        className="rounded-full bg-stone-700"
      ></div>
    </div>
  );
}

export default StatsBar;
