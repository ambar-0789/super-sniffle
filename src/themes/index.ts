import type { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'purple',
    // name: 'MYSTIC',
    emoji: ['💜', '🌙'],
    heartEmoji: '💜',
    preview: '/assets/themes/purple-preview.svg',
    avatar: '/assets/themes/purple-avatar.svg',
    icon: '/assets/themes/purple-icon.svg',
    vars: {
  '--bg': '#6F5B95',
  '--bg-dark': '#564476',
  '--bg-darker': '#342847',

  '--panel': '#EADBBF',
  '--panel-border': '#C79B6B',

  '--accent': '#FF6B81',
  '--accent2': '#6BCB77',

  '--text': '#241335',
  '--text-light': '#F7F0FF',
  '--text-muted': '#A998C1',

  '--bubble-self': '#CDB8F2',
  '--bubble-other': '#F7EEDC',

  '--window-title': '#8CC7E8',
  '--heart': '#FF5C8A',
    },
  },
  {
    id: 'green',
    // name: 'FOREST',
    emoji: ['🍃', '🌿'],
    heartEmoji: '💚',
    preview: '/assets/themes/green-preview.svg',
    avatar: '/assets/themes/green-avatar.svg',
    icon: '/assets/themes/green-icon.svg',
    vars: {
      '--bg': '#4a7c59',
      '--bg-dark': '#2d5a3d',
      '--bg-darker': '#1a3d28',
      '--panel': '#d4e8c2',
      '--panel-border': '#8ab87a',
      '--accent': '#ff9f43',
      '--accent2': '#48dbfb',
      '--text': '#0a1f0f',
      '--text-light': '#e8f5e2',
      '--text-muted': '#7ab88a',
      '--bubble-self': '#a8d8a8',
      '--bubble-other': '#f0f7e8',
      '--window-title': '#6db88a',
      '--heart': '#ff6b6b',
    },
  },
  {
    id: 'amber',
    // name: 'DESERT',
    emoji: ['🔥', '🌵'],
    heartEmoji: '🧡',
    preview: '/assets/themes/amber-preview.svg',
    avatar: '/assets/themes/amber-avatar.svg',
    icon: '/assets/themes/amber-icon.svg',
    vars: {
      '--bg': '#6f5b95',
      '--bg-dark': '#564476',
      '--bg-darker': '#5c3810',
      '--panel': '#f5e6c8',
      '--panel-border': '#d4a860',
      '--accent': '#ff6b6b',
      '--accent2': '#48dbfb',
      '--text': '#2a1500',
      '--text-light': '#fff8ee',
      '--text-muted': '#c8a878',
      '--bubble-self': '#f5d08a',
      '--bubble-other': '#fff5e0',
      '--window-title': '#e8a840',
      '--heart': '#ff4757',
    },
  },
  {
    id: 'blue',
    // name: 'OCEAN',
    emoji: ['🌊', '🐚'],
    heartEmoji: '💙',
    preview: '/assets/themes/blue-preview.svg',
    avatar: '/assets/themes/blue-avatar.svg',
    icon: '/assets/themes/blue-icon.svg',
    vars: {
      '--bg': '#2c4a7c',
      '--bg-dark': '#1a2f5a',
      '--bg-darker': '#0d1a3a',
      '--panel': '#c8dff5',
      '--panel-border': '#7ab0e0',
      '--accent': '#ffd32a',
      '--accent2': '#2ed573',
      '--text': '#0a1530',
      '--text-light': '#e8f2ff',
      '--text-muted': '#7a9ac8',
      '--bubble-self': '#a8c8f0',
      '--bubble-other': '#e8f4ff',
      '--window-title': '#5a9fd4',
      '--heart': '#ff6b9d',
    },
  },
  {
    id: 'pink',
    // name: 'non',
    emoji: ['🌸', '🍥'],
    heartEmoji: '💗',
    preview: '/assets/themes/pink-preview.svg',
    avatar: '/assets/themes/pink-avatar.svg',
    icon: '/assets/themes/pink-icon.svg',
    vars: {
      '--bg': '#c97ba8',
      '--bg-dark': '#a05880',
      '--bg-darker': '#7a3860',
      '--panel': '#ffe8f5',
      '--panel-border': '#f0a8d0',
      '--accent': '#ff4757',
      '--accent2': '#a8e6cf',
      '--text': '#3a0a20',
      '--text-light': '#fff0f8',
      '--text-muted': '#d098b8',
      '--bubble-self': '#f8c8e8',
      '--bubble-other': '#fff5fb',
      '--window-title': '#f08ab8',
      '--heart': '#ff4757',
    },
  },
];

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  if (theme.preview) root.style.setProperty('--theme-preview', `url(${theme.preview})`);
  if (theme.avatar) root.style.setProperty('--theme-avatar', `url(${theme.avatar})`);
  if (theme.icon) root.style.setProperty('--theme-icon', `url(${theme.icon})`);
  if (theme.emoji?.[0]) root.style.setProperty('--theme-emoji', theme.emoji[0]);
}
