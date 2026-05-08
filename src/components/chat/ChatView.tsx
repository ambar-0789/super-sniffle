import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useStore } from '../../store';
import { useVirtualItems } from '../../hooks/useVirtualItems';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './DateSeparator';
import { SearchBar } from './SearchBar';
import { PixelWindow } from '../ui/PixelWindow';
import { HeartBorder } from '../ui/HeartBorder';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';

export function ChatView() {
  const { conversation, searchQuery, searchSender, setView, reset } = useStore();
  const parentRef = useRef<HTMLDivElement>(null);

  if (!conversation) return null;

  const selfName = conversation.participants[0] ?? '';
  const items = useVirtualItems(conversation.messages, selfName, searchQuery, searchSender);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 20,
  });

  // Scroll to bottom on load
  useEffect(() => {
    if (items.length > 0) {
      virtualizer.scrollToIndex(items.length - 1, { align: 'end' });
    }
  }, [conversation.messages.length]);

  // Scroll to search result
  useEffect(() => {
    if (searchQuery || searchSender) {
      virtualizer.scrollToIndex(0, { align: 'start' });
    }
  }, [searchQuery, searchSender]);

  const title = conversation.title ?? conversation.participants.join(' & ');

  return (
    <div className="screen chat-screen">
      <HeartBorder position="top" />

      <div className="chat-topbar">
        <button className="px-btn" onClick={reset}>◀ BACK</button>
        <span className="chat-topbar__title">{title.toUpperCase()}</span>
        <div className="chat-topbar__right">
          <button className="px-btn" onClick={() => setView('analytics')}>STATS TYPE SHI</button>
          {/* <ThemeSwitcher /> */}
        </div>
      </div>

      <PixelWindow title={`MESSAGES (${items.length})`} className="chat-window">
        <SearchBar participants={conversation.participants} />

        <div ref={parentRef} className="chat-scroll">
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map(vItem => {
              const item = items[vItem.index];
              return (
                <div
                  key={item.key}
                  data-index={vItem.index}
                  ref={virtualizer.measureElement}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${vItem.start}px)` }}
                >
                  {item.type === 'date' ? (
                    <DateSeparator timestamp={item.timestamp!} />
                  ) : (
                    <MessageBubble
                      msg={item.msg!}
                      isSelf={item.isSelf!}
                      showAvatar={item.showAvatar!}
                      highlight={!!(searchQuery && item.msg!.content.toLowerCase().includes(searchQuery.toLowerCase()))}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PixelWindow>

      <HeartBorder position="bottom" />
    </div>
  );
}
