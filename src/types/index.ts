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
  avgMessageLength: number;
  longestMessage: string;
  longestMessageLength: number;
  totalWords: number;
  totalEmojis: number;
  topEmojis: [string, number][];
  totalLinks: number;
  totalPhotos: number;
  totalVideos: number;
  totalGifs: number;
  mostActiveHour: number;
  topWords: [string, number][];
  firstMessage: number;
  lastMessage: number;
  avgResponseTimeMs: number;
  nightMessages: number;
}

export interface Achievement {
  id: string;
  label: string;
  desc: string;
  icon: string;
  winner: string;
}

export interface AnalyticsData {
  totalMessages: number;
  totalParticipants: number;
  firstDate: number;
  lastDate: number;
  activeDays: number;
  avgPerDay: number;
  peakDay: string;
  peakDayCount: number;
  peakHour: number;
  peakHourCount: number;

  participantStats: ParticipantStats[];

  dailyActivity: { date: string; count: number }[];
  hourlyActivity: { hour: number; count: number }[];
  weeklyHeatmap: { dow: number; hour: number; count: number }[];
  monthlyActivity: { month: string; count: number }[];

  topWords: [string, number][];
  topPhrases: [string, number][];
  avgSentenceLength: number;
  longestMessage: { sender: string; content: string; length: number };

  rankings: {
    mostActive: string;
    biggestSpammer: string;
    longestTexter: string;
    mostMediaShared: string;
    mostLinksShared: string;
    nightOwl: string;
    fastestResponder: string;
  };

  achievements: Achievement[];
  longestStreak: { days: number; start: string; end: string };
  longestGap: { days: number; start: string; end: string };
}

export type ThemeId = 'purple' | 'green' | 'amber' | 'blue' | 'pink';
export type AnalyticsTab = 'overview' | 'participants' | 'activity' | 'words' | 'badges';

export interface Theme {
  id: ThemeId;
  // name: string;
  vars: Record<string, string>;
  emoji?: string[];
  heartEmoji?: string;
  preview?: string;
  avatar?: string;
  icon?: string;
}
