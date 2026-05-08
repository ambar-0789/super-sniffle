import { useStore } from '../../store';
import { PixelAvatar } from '../ui/PixelAvatar';
import { PixelWindow } from '../ui/PixelWindow';
import { HeartBorder } from '../ui/HeartBorder';

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mini-bar">
      <div className="mini-bar__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

const BAR_COLORS = ['var(--accent)', 'var(--accent2)', 'var(--window-title)', '#ffd32a', '#ff9f43'];

export function AnalyticsView() {
  const { analytics, conversation, setView } = useStore();
  if (!analytics || !conversation) return null;

  const maxDay = Math.max(...analytics.dailyActivity.map(d => d.count), 1);
  const last30 = analytics.dailyActivity.slice(-30);

  return (
    <div className="screen analytics-screen">
      <HeartBorder position="top" />

      <div className="chat-topbar">
        <button className="px-btn" onClick={() => setView('chat')}>◀ CHAT</button>
        <span className="chat-topbar__title">STATS & ANALYTICS</span>
        <div style={{ width: 80 }} />
      </div>

      <div className="analytics-grid">
        <PixelWindow title="OVERVIEW" className="analytics-panel">
          <div className="stat-row">
            <span className="stat-label">TOTAL MSGS</span>
            <span className="stat-val">{analytics.totalMessages.toLocaleString()}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">AVG / DAY</span>
            <span className="stat-val">{analytics.avgPerDay}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">PEAK HOUR</span>
            <span className="stat-val">{analytics.topHour}:00</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">DAYS ACTIVE</span>
            <span className="stat-val">{analytics.dailyActivity.length}</span>
          </div>
        </PixelWindow>

        <PixelWindow title="PARTICIPANTS" className="analytics-panel">
          {analytics.participantStats.map((p, i) => (
            <div key={p.name} className="participant-stat">
              <PixelAvatar name={p.name} size={24} />
              <div className="participant-info">
                <div className="participant-name">{p.name}</div>
                <MiniBar value={p.count} max={analytics.totalMessages} color={BAR_COLORS[i % BAR_COLORS.length]} />
                <div className="participant-pct">{p.count.toLocaleString()} ({p.percentage}%)</div>
              </div>
            </div>
          ))}
        </PixelWindow>

        <PixelWindow title={`ACTIVITY (LAST ${last30.length} DAYS)`} className="analytics-panel analytics-panel--wide">
          <div className="activity-chart">
            {last30.map(d => (
              <div key={d.date} className="activity-col" title={`${d.date}: ${d.count}`}>
                <div className="activity-bar" style={{ height: `${(d.count / maxDay) * 100}%` }} />
                <div className="activity-date">{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </PixelWindow>
      </div>

      <HeartBorder position="bottom" />
    </div>
  );
}
