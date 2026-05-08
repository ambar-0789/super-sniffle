import { StatCounter } from './StatCounter';
import { PixelWindow } from '../ui/PixelWindow';
import type { AnalyticsData } from '../../types';

interface Props { data: AnalyticsData; }

const RANK_ICONS: Record<string, string> = {
  mostActive:       '🏆',
  biggestSpammer:   '💬',
  longestTexter:    '📖',
  mostMediaShared:  '🎞️',
  mostLinksShared:  '🔗',
  nightOwl:         '🌙',
  fastestResponder: '⚡',
};

const RANK_LABELS: Record<string, string> = {
  mostActive:       'MOST ACTIVE',
  biggestSpammer:   'SPAM KING',
  longestTexter:    'LONGEST TEXTER',
  mostMediaShared:  'MEDIA KING',
  mostLinksShared:  'LINK DROPPER',
  nightOwl:         'NIGHT OWL',
  fastestResponder: 'FAST REPLIER',
};

function fmtDate(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function OverviewPanel({ data }: Props) {
  const stats: { label: string; value: number; suffix?: string }[] = [
    { label: 'TOTAL MESSAGES', value: data.totalMessages },
    { label: 'PARTICIPANTS',   value: data.totalParticipants },
    { label: 'ACTIVE DAYS',    value: data.activeDays },
    { label: 'AVG / DAY',      value: data.avgPerDay },
    { label: 'PEAK DAY COUNT', value: data.peakDayCount },
    { label: 'PEAK HOUR MSGS', value: data.peakHourCount },
  ];

  return (
    <div className="overview-grid">
      {/* Hero stats */}
      <PixelWindow title="OVERVIEW" className="ov-panel">
        <div className="ov-stats-grid">
          {stats.map(s => (
            <div key={s.label} className="ov-stat-card">
              <div className="ov-stat-label">{s.label}</div>
              <div className="ov-stat-val">
                <StatCounter value={s.value} suffix={s.suffix} />
              </div>
            </div>
          ))}
        </div>
        <div className="ov-dates">
          <div className="ov-date-row">
            <span className="ov-date-label">FIRST MSG</span>
            <span className="ov-date-val">{fmtDate(data.firstDate)}</span>
          </div>
          <div className="ov-date-row">
            <span className="ov-date-label">LATEST MSG</span>
            <span className="ov-date-val">{fmtDate(data.lastDate)}</span>
          </div>
          <div className="ov-date-row">
            <span className="ov-date-label">PEAK DAY</span>
            <span className="ov-date-val">{data.peakDay || '—'}</span>
          </div>
          <div className="ov-date-row">
            <span className="ov-date-label">PEAK HOUR</span>
            <span className="ov-date-val">{data.peakHour}:00 – {data.peakHour}:59</span>
          </div>
        </div>
      </PixelWindow>

      {/* Rankings */}
      <PixelWindow title="RANKINGS" className="ov-panel">
        <div className="rankings-list">
          {Object.entries(data.rankings).map(([key, winner]) => (
            <div key={key} className="ranking-row">
              <span className="ranking-icon">{RANK_ICONS[key]}</span>
              <div className="ranking-info">
                <div className="ranking-label">{RANK_LABELS[key]}</div>
                <div className="ranking-winner">{winner || '—'}</div>
              </div>
            </div>
          ))}
        </div>
      </PixelWindow>

      {/* Streaks */}
      <PixelWindow title="STREAKS" className="ov-panel ov-panel--wide">
        <div className="streak-row">
          <div className="streak-card streak-card--good">
            <div className="streak-icon">🔥</div>
            <div className="streak-days"><StatCounter value={data.longestStreak.days} /> DAYS</div>
            <div className="streak-label">LONGEST STREAK</div>
            <div className="streak-dates">{data.longestStreak.start} → {data.longestStreak.end}</div>
          </div>
          <div className="streak-card streak-card--bad">
            <div className="streak-icon">👻</div>
            <div className="streak-days"><StatCounter value={data.longestGap.days} /> DAYS</div>
            <div className="streak-label">LONGEST SILENCE</div>
            <div className="streak-dates">{data.longestGap.start} → {data.longestGap.end}</div>
          </div>
        </div>
      </PixelWindow>
    </div>
  );
}
