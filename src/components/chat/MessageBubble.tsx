import { memo } from 'react';
import type { ParsedMessage } from '../../types';
import { PixelAvatar } from '../ui/PixelAvatar';

interface Props {
  msg: ParsedMessage;
  isSelf: boolean;
  showAvatar: boolean;
  highlight: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  photo: '📷',
  video: '📹',
  audio: '🎵',
  gif: '🎞',
  sticker: '🏷',
  share: '🔗',
  unsent: '🚫',
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const MessageBubble = memo(function MessageBubble({ msg, isSelf, showAvatar, highlight }: Props) {
  const icon = TYPE_ICONS[msg.type];

  return (
    <div className={`msg-row ${isSelf ? 'msg-row--self' : 'msg-row--other'} ${highlight ? 'msg-row--highlight' : ''}`}
      data-msgid={msg.id}
    >
      {!isSelf && (
        <div className="msg-avatar">
          {showAvatar ? <PixelAvatar name={msg.sender} size={20} /> : <span style={{ width: 28 }} />}
        </div>
      )}
      <div className="msg-bubble">
        {showAvatar && !isSelf && <div className="msg-sender">{msg.sender}</div>}
        <div className={`msg-content ${msg.type !== 'text' ? 'msg-content--media' : ''}`}>
          {icon && <span className="msg-type-icon">{icon}</span>}
          <span>{msg.content}</span>
        </div>
        {msg.reactions?.length ? (
          <div className="msg-reactions">
            {msg.reactions.map((r, i) => <span key={i} title={r.actor}>{r.reaction}</span>)}
          </div>
        ) : null}
        <div className="msg-time">{formatTime(msg.timestamp)}</div>
      </div>
      {isSelf && (
        <div className="msg-avatar">
          {showAvatar ? <PixelAvatar name={msg.sender} size={28} /> : <span style={{ width: 28 }} />}
        </div>
      )}
    </div>
  );
});
