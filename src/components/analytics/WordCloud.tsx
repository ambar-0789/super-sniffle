import { PixelWindow } from '../ui/PixelWindow';
import type { AnalyticsData } from '../../types';

interface Props { data: AnalyticsData; }

const PILL_COLORS = [
  'var(--accent)', 'var(--accent2)', 'var(--window-title)',
  '#ffd32a', '#ff9f43', '#a29bfe', '#fd79a8',
];

function WordPill({ word, count, max, idx }: { word: string; count: number; max: number; idx: number }) {
  const size = 6 + Math.round((count / max) * 6);
  const color = PILL_COLORS[idx % PILL_COLORS.length];
  return (
    <div className="word-pill" style={{ borderColor: color, fontSize: `${size}px` }} title={`${word}: ${count}`}>
      <span className="word-pill__text">{word}</span>
      <span className="word-pill__count" style={{ color }}>{count}</span>
    </div>
  );
}

export function WordCloud({ data }: Props) {
  const topWords  = data.topWords.slice(0, 30);
  const maxCount  = topWords[0]?.[1] ?? 1;
  const topPhrases = data.topPhrases.slice(0, 15);

  return (
    <div className="words-panels">
      {/* Global top words */}
      <PixelWindow title="MOST USED WORDS" className="words-panel words-panel--wide">
        <div className="word-pills-wrap">
          {topWords.map(([word, count], i) => (
            <WordPill key={word} word={word} count={count} max={maxCount} idx={i} />
          ))}
        </div>
      </PixelWindow>

      {/* Top phrases */}
      <PixelWindow title="TOP PHRASES" className="words-panel">
        <div className="phrases-list">
          {topPhrases.map(([phrase, count], i) => (
            <div key={phrase} className="phrase-row">
              <span className="phrase-rank">#{i + 1}</span>
              <span className="phrase-text">{phrase}</span>
              <span className="phrase-count">{count}×</span>
            </div>
          ))}
        </div>
      </PixelWindow>

      {/* Per-participant top words */}
      <PixelWindow title="VOCAB COMPARISON" className="words-panel">
        {data.participantStats.map((p, pi) => (
          <div key={p.name} className="vocab-row">
            <div className="vocab-name" style={{ color: PILL_COLORS[pi % PILL_COLORS.length] }}>
              {p.name.split(' ')[0].toUpperCase()}
            </div>
            <div className="vocab-pills">
              {p.topWords.slice(0, 6).map(([w, c]) => (
                <span
                  key={w}
                  className="vocab-pill"
                  style={{ borderColor: PILL_COLORS[pi % PILL_COLORS.length] }}
                  title={`${w}: ${c}`}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        ))}
      </PixelWindow>

      {/* Text stats */}
      <PixelWindow title="TEXT INTELLIGENCE" className="words-panel">
        <div className="text-stat-list">
          <div className="text-stat-row">
            <span className="text-stat-label">AVG SENTENCE LENGTH</span>
            <span className="text-stat-val">{data.avgSentenceLength} words</span>
          </div>
          <div className="text-stat-row">
            <span className="text-stat-label">LONGEST MESSAGE BY</span>
            <span className="text-stat-val">{data.longestMessage.sender || '—'}</span>
          </div>
          <div className="text-stat-row">
            <span className="text-stat-label">LONGEST MSG LENGTH</span>
            <span className="text-stat-val">{data.longestMessage.length} chars</span>
          </div>
          {data.longestMessage.content && (
            <div className="text-longest-preview">
              &ldquo;{data.longestMessage.content.slice(0, 160)}{data.longestMessage.content.length > 160 ? '…' : ''}&rdquo;
            </div>
          )}
        </div>
      </PixelWindow>
    </div>
  );
}
