import { useStore } from '../../store';
import { HeartBorder } from '../ui/HeartBorder';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { OverviewPanel } from './OverviewPanel';
import { ParticipantCard } from './ParticipantCard';
import { ActivityCharts } from './ActivityCharts';
import { WordCloud } from './WordCloud';
import { AchievementBadge } from './AchievementBadge';
import type { AnalyticsTab } from '../../types';

const TABS: { id: AnalyticsTab; label: string; icon: string }[] = [
  { id: 'overview',     label: 'OVERVIEW',     icon: '📊' },
  { id: 'participants', label: 'PLAYERS',       icon: '👤' },
  { id: 'activity',    label: 'ACTIVITY',      icon: '📈' },
  { id: 'words',       label: 'WORDS',         icon: '💬' },
  { id: 'badges',      label: 'BADGES',        icon: '🏅' },
];

export function AnalyticsView() {
  const { analytics, conversation, setView, analyticsTab, setAnalyticsTab } = useStore();
  if (!analytics || !conversation) return null;

  const title = (conversation.title ?? conversation.participants.join(' & ')).toUpperCase();

  return (
    <div className="screen analytics-screen">
      <HeartBorder position="top" />

      {/* Top bar */}
      <div className="chat-topbar">
        <button className="px-btn" onClick={() => setView('chat')}>◀ CHAT</button>
        <span className="chat-topbar__title">{title} — INTEL</span>
        <div className="chat-topbar__right">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Tab bar */}
      <div className="analytics-tabbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`analytics-tab ${analyticsTab === tab.id ? 'analytics-tab--active' : ''}`}
            onClick={() => setAnalyticsTab(tab.id)}
          >
            <span className="analytics-tab__icon">{tab.icon}</span>
            <span className="analytics-tab__label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="analytics-content">
        {analyticsTab === 'overview' && <OverviewPanel data={analytics} />}

        {analyticsTab === 'participants' && (
          <div className="participants-grid">
            {analytics.participantStats.map((p, i) => (
              <ParticipantCard
                key={p.name}
                p={p}
                rank={i + 1}
                totalMessages={analytics.totalMessages}
              />
            ))}
          </div>
        )}

        {analyticsTab === 'activity' && <ActivityCharts data={analytics} />}

        {analyticsTab === 'words' && <WordCloud data={analytics} />}

        {analyticsTab === 'badges' && (
          <div className="badges-section">
            <div className="badges-header">
              <div className="badges-title">✦ ACHIEVEMENT BOARD ✦</div>
              <div className="badges-subtitle">Earned through {analytics.totalMessages.toLocaleString()} messages</div>
            </div>
            <div className="badges-grid">
              {analytics.achievements.map((a, i) => (
                <AchievementBadge key={a.id} achievement={a} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <HeartBorder position="bottom" />
    </div>
  );
}
