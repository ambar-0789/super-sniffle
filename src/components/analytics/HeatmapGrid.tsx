interface Props {
  data: { dow: number; hour: number; count: number }[];
}

const DOW_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? '12a' : i < 12 ? `${i}a` : i === 12 ? '12p' : `${i - 12}p`
);

export function HeatmapGrid({ data }: Props) {
  const max = Math.max(...data.map(d => d.count), 1);

  const getColor = (count: number) => {
    if (count === 0) return 'var(--bg-darker)';
    const intensity = count / max;
    if (intensity < 0.25) return 'rgba(255,71,87,0.25)';
    if (intensity < 0.5)  return 'rgba(255,71,87,0.5)';
    if (intensity < 0.75) return 'rgba(255,71,87,0.75)';
    return 'var(--accent)';
  };

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-hour-labels">
        <div className="heatmap-corner" />
        {HOUR_LABELS.map((l, i) => (
          <div key={i} className="heatmap-h-label">{i % 3 === 0 ? l : ''}</div>
        ))}
      </div>
      <div className="heatmap-body">
        {Array.from({ length: 7 }, (_, dow) => (
          <div key={dow} className="heatmap-row">
            <div className="heatmap-dow-label">{DOW_LABELS[dow]}</div>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.find(d => d.dow === dow && d.hour === hour);
              const count = cell?.count ?? 0;
              return (
                <div
                  key={hour}
                  className="heatmap-cell"
                  style={{ background: getColor(count) }}
                  title={`${DOW_LABELS[dow]} ${HOUR_LABELS[hour]}: ${count} msgs`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
