import { create } from 'zustand';
import type { ParsedConversation, AnalyticsData, ThemeId } from '../types';
import { computeAnalytics } from '../lib/parser';
import { THEMES, applyTheme } from '../themes';

interface AppState {
  conversation: ParsedConversation | null;
  analytics: AnalyticsData | null;
  themeId: ThemeId;
  searchQuery: string;
  searchSender: string;
  activeView: 'chat' | 'analytics';
  error: string | null;

  loadConversation: (conv: ParsedConversation) => void;
  setTheme: (id: ThemeId) => void;
  setSearch: (q: string, sender?: string) => void;
  setView: (v: 'chat' | 'analytics') => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  conversation: null,
  analytics: null,
  themeId: 'purple',
  searchQuery: '',
  searchSender: '',
  activeView: 'chat',
  error: null,

  loadConversation: (conv) => {
    const analytics = computeAnalytics(conv);
    set({ conversation: conv, analytics, activeView: 'chat', error: null });
  },

  setTheme: (id) => {
    const theme = THEMES.find(t => t.id === id);
    if (theme) applyTheme(theme);
    set({ themeId: id });
  },

  setSearch: (searchQuery, searchSender = '') => set({ searchQuery, searchSender }),

  setView: (activeView) => set({ activeView }),

  setError: (error) => set({ error }),

  reset: () => set({ conversation: null, analytics: null, searchQuery: '', searchSender: '', activeView: 'chat', error: null }),
}));
