import { useStore } from '../../store';
import { THEMES } from '../../themes';
import type { ThemeId } from '../../types';

export function ThemeSwitcher() {
  const { themeId, setTheme } = useStore();
  return (
    <div className="theme-switcher">
      {THEMES.map(t => (
        <button
          key={t.id}
          className={`theme-card ${themeId === t.id ? 'active' : ''}`}
          onClick={() => setTheme(t.id as ThemeId)}
          // title={t.name}
          type="button"
        >
          <div className="theme-card__preview">
            <img
              src={t.preview}
              // alt={`${t.name} preview`}
              className="theme-card__icon"
            />
          </div>
          <div className="theme-card__label">
            {/* <span className="theme-card__name">{t.name}</span> */}
            <span className="theme-card__emoji">{t.emoji?.join(' ')}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
