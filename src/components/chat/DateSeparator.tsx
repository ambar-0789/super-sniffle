import { memo } from 'react';

export const DateSeparator = memo(function DateSeparator({ timestamp }: { timestamp: number }) {
  const label = new Date(timestamp).toLocaleDateString([], {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
  return (
    <div className="date-sep">
      <span className="date-sep__line" />
      <span className="date-sep__label">[ {label.toUpperCase()} ]</span>
      <span className="date-sep__line" />
    </div>
  );
});
