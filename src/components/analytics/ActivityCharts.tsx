import { PixelWindow } from '../ui/PixelWindow';
import { PixelBarChart } from './PixelBarChart';
import { HeatmapGrid } from './HeatmapGrid';
import type { AnalyticsData } from '../../types';

interface Props { data: AnalyticsData; }

export function ActivityCharts({ data }: Props) {
  // Last 60 days for daily chart
  const last60 = data.dailyActivity.slice(-60);

  // Monthly bars
  const monthBars = data.monthlyActivity.map(m => ({
    label: m.month.slice(5), // "MM"
    value: m.count,
  }));

  // Hourly bars — all 24 hours
  const hourBars = data.hourlyActivity.map(h => ({
    label: h.hour % 6 === 0 ? `${h.hour}h` : '',
    value: h.count,
  }));

  const maxDaily = Math.max(...last60.map(d => d.count), 1);

  return (
    <div className="activity-panels">
      {/* Daily activity */}
      <PixelWindow title={`DAILY ACTIVITY — LAST ${last60.length} DAYS`} className="act-panel act-panel--wide">
        <div className="act-daily-chart">
          {last60.map(d => (
            <div key={d.date} className="act-daily-col" title={`${d.date}: ${d.count}`}>
              <div
                className="act-daily-bar"
                style={{ height: `${(d.count / maxDaily) * 100}%` }}
              />
              <div className="act-daily-date">{d.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </PixelWindow>

      {/* Hourly breakdown */}
      <PixelWindow title="MESSAGES BY HOUR" className="act-panel">
        <div className="act-chart-wrap">
          <PixelBarChart bars={hourBars} height={100} showValues={false} colorIndex={2} />
        </div>
        <div className="act-hint">Peak: {data.peakHour}:00 ({data.peakHourCount.toLocaleString()} msgs)</div>
      </PixelWindow>

      {/* Monthly trends */}
      <PixelWindow title="MONTHLY TRENDS" className="act-panel">
        <div className="act-chart-wrap">
          <PixelBarChart bars={monthBars} height={100} showValues colorIndex={1} />
        </div>
      </PixelWindow>

      {/* Weekly heatmap */}
      <PixelWindow title="WEEKLY HEATMAP (DAY × HOUR)" className="act-panel act-panel--wide">
        <div className="act-heatmap-wrap">
          <HeatmapGrid data={data.weeklyHeatmap} />
        </div>
        <div className="act-hint">
          Brighter = more messages at that day/time
        </div>
      </PixelWindow>
    </div>
  );
}
