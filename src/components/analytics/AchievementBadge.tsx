import type { Achievement } from '../../types';

interface Props { achievement: Achievement; index: number; }

const BADGE_COLORS = [
  { bg: '#3d1a6e', border: '#a29bfe', glow: '#a29bfe' },
  { bg: '#1a3a1a', border: '#2ed573', glow: '#2ed573' },
  { bg: '#3a1a1a', border: '#ff4757', glow: '#ff4757' },
  { bg: '#1a2e3a', border: '#7fb3d3', glow: '#7fb3d3' },
  { bg: '#3a2a00', border: '#ffd32a', glow: '#ffd32a' },
  { bg: '#2a1a3a', border: '#fd79a8', glow: '#fd79a8' },
  { bg: '#1a3a2a', border: '#ff9f43', glow: '#ff9f43' },
];

export function AchievementBadge({ achievement, index }: Props) {
  const theme = BADGE_COLORS[index % BADGE_COLORS.length];

  return (
    <div
      className="badge-card"
      style={{
        background: theme.bg,
        borderColor: theme.border,
        boxShadow: `0 0 10px ${theme.glow}44, 2px 2px 0 rgba(0,0,0,0.5)`,
      }}
    >
      {/* Pixel corner decorations */}
      <div className="badge-corner badge-corner--tl" style={{ background: theme.border }} />
      <div className="badge-corner badge-corner--tr" style={{ background: theme.border }} />
      <div className="badge-corner badge-corner--bl" style={{ background: theme.border }} />
      <div className="badge-corner badge-corner--br" style={{ background: theme.border }} />

      <div className="badge-icon">{achievement.icon}</div>
      <div className="badge-label" style={{ color: theme.border }}>{achievement.label}</div>
      <div className="badge-desc">{achievement.desc}</div>
      <div className="badge-divider" style={{ background: theme.border }} />
      <div className="badge-winner-label">AWARDED TO</div>
      <div className="badge-winner" style={{ color: theme.glow }}>
        {achievement.winner}
      </div>
    </div>
  );
}
