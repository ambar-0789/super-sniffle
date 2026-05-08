const BAR_COLORS = [
  'var(--accent)', 'var(--accent2)', 'var(--window-title)',
  '#ffd32a', '#ff9f43', '#a29bfe', '#fd79a8',
];

interface Bar { label: string; value: number; color?: string; }

interface Props {
  bars: Bar[];
  height?: number;
  showValues?: boolean;
  colorIndex?: number;
}

export function PixelBarChart({ bars, height = 80, showValues = true, colorIndex = 0 }: Props) {
  const max = Math.max(...bars.map(b => b.value), 1);
  return (
    <div className="px-bar-chart" style={{ height }}>
      {bars.map((b, i) => {
        const pct = (b.value / max) * 100;
        const color = b.color ?? BAR_COLORS[(i + colorIndex) % BAR_COLORS.length];
        return (
          <div key={b.label} className="px-bar-col" title={`${b.label}: ${b.value.toLocaleString()}`}>
            <div className="px-bar-wrap">
              <div className="px-bar-fill" style={{ height: `${pct}%`, background: color }} />
            </div>
            {showValues && <div className="px-bar-val">{b.value > 999 ? `${(b.value / 1000).toFixed(1)}k` : b.value}</div>}
            <div className="px-bar-label">{b.label}</div>
          </div>
        );
      })}
    </div>
  );
}
