import { PixelAvatar } from '../ui/PixelAvatar';
import { StatCounter } from './StatCounter';
import type { ParticipantStats } from '../../types';

interface Props {
  p: ParticipantStats;
  rank: number;
  totalMessages: number;
}

const BAR_COLORS = ['var(--accent)', 'var(--accent2)', 'var(--window-title)', '#ffd32a', '#ff9f43', '#a29bfe', '#fd79a8'];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mini-bar">
      <div className="mini-bar__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function fmtMs(ms: number) {
  if (!ms) return '—';
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(ms / 3600000)}h`;
}

export function ParticipantCard({ p, rank, totalMessages }: Props) {
  const color = BAR_COLORS[(rank - 1) % BAR_COLORS.length];
  const rankEmojis = ['🥇', '🥈', '🥉'];
  const rankLabel = rankEmojis[rank - 1] ?? `#${rank}`;

  const mediaTotal = p.totalPhotos + p.totalVideos + p.totalGifs;

  return (
    <div className="p-card">
      {/* Header */}
      <div className="p-card__header" style={{ borderColor: color }}>
        <div className="p-card__rank">{rankLabel}</div>
        <PixelAvatar name={p.name} size={36} />
        <div className="p-card__name-block">
          <div className="p-card__name">{p.name}</div>
          <div className="p-card__pct" style={{ color }}>{p.percentage}% of conversation</div>
        </div>
        <div className="p-card__total">
          <StatCounter value={p.count} />
          <div className="p-card__total-label">MSGS</div>
        </div>
      </div>

      {/* Message bar */}
      <div className="p-card__bar-row">
        <MiniBar value={p.count} max={totalMessages} color={color} />
      </div>

      {/* Stats grid */}
      <div className="p-card__stats">
        <div className="p-card__stat">
          <span className="p-card__stat-label">AVG LEN</span>
          <span className="p-card__stat-val">{p.avgMessageLength} chars</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">TOTAL WORDS</span>
          <span className="p-card__stat-val">{p.totalWords.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">EMOJIS</span>
          <span className="p-card__stat-val">{p.totalEmojis.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">LINKS</span>
          <span className="p-card__stat-val">{p.totalLinks.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">PHOTOS</span>
          <span className="p-card__stat-val">{p.totalPhotos.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">VIDEOS</span>
          <span className="p-card__stat-val">{p.totalVideos.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">GIFS</span>
          <span className="p-card__stat-val">{p.totalGifs.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">MEDIA TOTAL</span>
          <span className="p-card__stat-val">{mediaTotal.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">PEAK HOUR</span>
          <span className="p-card__stat-val">{p.mostActiveHour}:00</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">AVG RESP</span>
          <span className="p-card__stat-val">{fmtMs(p.avgResponseTimeMs)}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">NIGHT MSGS</span>
          <span className="p-card__stat-val">{p.nightMessages.toLocaleString()}</span>
        </div>
        <div className="p-card__stat">
          <span className="p-card__stat-label">LONGEST MSG</span>
          <span className="p-card__stat-val">{p.longestMessageLength} chars</span>
        </div>
      </div>

      {/* Top emojis */}
      {p.topEmojis.length > 0 && (
        <div className="p-card__section">
          <div className="p-card__section-title">TOP EMOJIS</div>
          <div className="p-card__emoji-row">
            {p.topEmojis.map(([emoji, count]) => (
              <div key={emoji} className="p-card__emoji-chip">
                <span className="p-card__emoji">{emoji}</span>
                <span className="p-card__emoji-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top words */}
      {p.topWords.length > 0 && (
        <div className="p-card__section">
          <div className="p-card__section-title">TOP WORDS</div>
          <div className="p-card__word-row">
            {p.topWords.slice(0, 8).map(([word, count]) => (
              <div key={word} className="p-card__word-chip" style={{ borderColor: color }}>
                <span className="p-card__word">{word}</span>
                <span className="p-card__word-count" style={{ color }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Longest message preview */}
      {p.longestMessage && (
        <div className="p-card__section">
          <div className="p-card__section-title">LONGEST MESSAGE</div>
          <div className="p-card__longest">
            &ldquo;{p.longestMessage.length > 120 ? p.longestMessage.slice(0, 120) + '…' : p.longestMessage}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}
