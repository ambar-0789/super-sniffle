import { useStore } from '../../store';
import { THEMES } from '../../themes';

export function HeartBorder({ position }: { position: 'top' | 'bottom' }) {
  const { themeId } = useStore();
  const theme = THEMES.find(t => t.id === themeId);
  const heart = theme?.heartEmoji ?? '<3';
  const hearts = Array.from({ length: 1000 }, (_, i) => i);

  return (
    <div className={`heart-border heart-border--${position}`}>
      {hearts.map(i => (
        <span key={i} className="heart-px">{heart}</span>
      ))}
    </div>
  );
}
