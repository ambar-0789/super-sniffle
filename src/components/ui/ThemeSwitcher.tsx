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
          className={`theme-dot ${themeId === t.id ? 'active' : ''}`}
          onClick={() => setTheme(t.id as ThemeId)}
          title={t.name}
          style={{ background: t.vars['--bg'] }}
        />
      ))}
    </div>
  );
}
