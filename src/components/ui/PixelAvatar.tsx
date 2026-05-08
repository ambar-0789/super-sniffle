import { useEffect, useRef } from 'react';
import { drawAvatar } from '../../lib/avatar';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export function PixelAvatar({ name, size = 32, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) drawAvatar(ref.current, name, size);
  }, [name, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      title={name}
      className={className}
      style={{ imageRendering: 'pixelated', flexShrink: 0 }}
    />
  );
}
