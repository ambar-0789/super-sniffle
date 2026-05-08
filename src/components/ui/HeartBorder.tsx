export function HeartBorder({ position }: { position: 'top' | 'bottom' }) {
  const hearts = Array.from({ length: 1000 }, (_, i) => i);
  return (
    <div className={`heart-border heart-border--${position}`}>
      {hearts.map(i => (
        <span key={i} className="heart-px">❤</span>
      ))}
    </div>
  );
}
