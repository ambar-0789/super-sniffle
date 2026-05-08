import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function StatCounter({ value, duration = 900, suffix = '', prefix = '' }: Props) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    startRef.current = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className="stat-counter">
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}
