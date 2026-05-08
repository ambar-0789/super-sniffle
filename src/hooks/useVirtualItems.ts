import { useMemo } from 'react';
import type { ParsedMessage } from '../types';

export interface VirtualItem {
  type: 'date' | 'message';
  key: string;
  timestamp?: number;
  msg?: ParsedMessage;
  isSelf?: boolean;
  showAvatar?: boolean;
}

function sameDay(a: number, b: number) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

export function useVirtualItems(
  messages: ParsedMessage[],
  selfName: string,
  searchQuery: string,
  searchSender: string,
): VirtualItem[] {
  return useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = messages.filter(m => {
      if (searchSender && m.sender !== searchSender) return false;
      if (q && !m.content.toLowerCase().includes(q) && !m.sender.toLowerCase().includes(q)) return false;
      return true;
    });

    const items: VirtualItem[] = [];
    let lastTs = 0;
    let lastSender = '';

    for (const msg of filtered) {
      if (!sameDay(lastTs, msg.timestamp)) {
        items.push({ type: 'date', key: `date_${msg.timestamp}`, timestamp: msg.timestamp });
      }
      const showAvatar = msg.sender !== lastSender;
      items.push({
        type: 'message',
        key: msg.id,
        msg,
        isSelf: msg.sender === selfName,
        showAvatar,
      });
      lastTs = msg.timestamp;
      lastSender = msg.sender;
    }
    return items;
  }, [messages, selfName, searchQuery, searchSender]);
}
