export default function MiniSparkline({
  data = [3, 5, 4, 7, 6, 9, 8, 12],
  className = "",
}: {
  data?: number[];
  className?: string;
}) {
  const w = 120;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  const points = data
    .map((d, i) => `${i * step},${h - ((d - min) / range) * (h - 6) - 3}`)
    .join(" ");

  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="v-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#v-spark)" />
      <polyline
        points={points}
        fill="none"
        stroke="#34D399"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
