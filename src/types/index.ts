export interface RawMessage {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  photos?: { uri: string; creation_timestamp: number }[];
  videos?: { uri: string; creation_timestamp: number }[];
  audio_files?: { uri: string; creation_timestamp: number }[];
  gifs?: { uri: string }[];
  sticker?: { uri: string };
  reactions?: { reaction: string; actor: string }[];
  is_unsent?: boolean;
  share?: { link: string; share_text?: string };
}

export interface ParsedMessage {
  id: string;
  sender: string;
  timestamp: number;
  content: string;
  type: 'text' | 'photo' | 'video' | 'audio' | 'gif' | 'sticker' | 'share' | 'unsent';
  mediaUri?: string;
  reactions?: { reaction: string; actor: string }[];
}

export interface ParsedConversation {
  title?: string;
  participants: string[];
  messages: ParsedMessage[];
  threadType?: string;
}

export interface ParticipantStats {
  name: string;
  count: number;
  percentage: number;
  firstMessage: number;
  lastMessage: number;
}

export interface DailyActivity {
  date: string;
  count: number;
}

export interface AnalyticsData {
  totalMessages: number;
  participantStats: ParticipantStats[];
  dailyActivity: DailyActivity[];
  topHour: number;
  avgPerDay: number;
}

export type ThemeId = 'purple' | 'green' | 'amber' | 'blue' | 'pink';

export interface Theme {
  id: ThemeId;
  name: string;
  vars: Record<string, string>;
}
