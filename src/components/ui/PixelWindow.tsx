import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export function PixelWindow({ title, children, className = '', onClose }: Props) {
  return (
    <div className={`pixel-window ${className}`}>
      <div className="pixel-window__titlebar">
        <div className="pixel-window__controls">
          <span className="pixel-btn red" onClick={onClose} />
          <span className="pixel-btn yellow" />
          <span className="pixel-btn green" />
        </div>
        <span className="pixel-window__title">{title}</span>
        <div style={{ width: 54 }} />
      </div>
      <div className="pixel-window__body">{children}</div>
    </div>
  );
}
