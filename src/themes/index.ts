// Suggested border emoji ideas (optional future replacements)
// Tulip theme  -> 🌷 ✿ ❀
// Mario theme  -> ⭐ 🍄 🧱
// Among Us     -> 🚀 👾 🛰
// Pikachu      -> ⚡ ⭐ 🟡
// Heart theme  -> ❤️ 💖 ✨

import type { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'purple',
    heartEmoji: '🌸',
    preview: '/assets/themes/purple-preview.svg',
    avatar: '/assets/themes/purple-avatar.svg',
    icon: '/assets/themes/purple-icon.svg',
    vars: {
      // Tulip Theme
      '--bg': '#7D5A8C',
      '--bg-dark': '#684774',
      '--bg-darker': '#4D3457',

      '--panel': '#F6E6D3',
      '--panel-border': '#E8A87C',

      '--accent': '#FF7A9E',
      '--accent2': '#9ED9B5',

      '--text': '#2F1B3A',
      '--text-light': '#FFF7FC',
      '--text-muted': '#B380A3',

      '--bubble-self': '#FFD1DC',
      '--bubble-other': '#FFF2E8',

      '--window-title': '#8CC7E8',
      '--heart': '#FF5C8A',
    },
  },

  {
    id: 'green',
    heartEmoji: ' 🍄 ',
    preview: '/assets/themes/green-preview.svg',
    avatar: '/assets/themes/green-avatar.svg',
    icon: '/assets/themes/green-icon.svg',
    vars: {
      // Mario Theme
      '--bg': '#5C2C2C',
      '--bg-dark': '#3E1B1B',
      '--bg-darker': '#241010',

      '--panel': '#F6E7C1',
      '--panel-border': '#D89B3C',

      '--accent': '#E63946',
      '--accent2': '#4CAF50',

      '--text': '#2A120A',
      '--text-light': '#FFF8EE',
      '--text-muted': '#B88351',

      '--bubble-self': '#FFCCB3',
      '--bubble-other': '#FFF3DD',

      '--window-title': '#5DA9E9',
      '--heart': '#FFCC00',
    },
  },

  {
    id: 'amber',
    heartEmoji: '👾',
    preview: '/assets/themes/amber-preview.svg',
    avatar: '/assets/themes/amber-avatar.svg',
    icon: '/assets/themes/amber-icon.svg',
    vars: {
      // Among Us Theme
      '--bg': '#3A0F1A',
      '--bg-dark': '#260812',
      '--bg-darker': '#14040A',

      '--panel': '#F1DCC5',
      '--panel-border': '#B97A56',

      '--accent': '#D7263D',
      '--accent2': '#5BC0EB',

      '--text': '#240B12',
      '--text-light': '#FFF5F7',
      '--text-muted': '#BB7787',

      '--bubble-self': '#FFB3C1',
      '--bubble-other': '#FFE5E9',

      '--window-title': '#7ED6DF',
      '--heart': '#FF4757',
    },
  },

  {
    id: 'blue',
    heartEmoji: '⭐',
    preview: '/assets/themes/blue-preview.svg',
    avatar: '/assets/themes/blue-avatar.svg',
    icon: '/assets/themes/blue-icon.svg',
    vars: {
      // Pikachu Theme
      '--bg': '#F5D547',
      '--bg-dark': '#957043',
      '--bg-darker': '#9E7E10',

      '--panel': '#FFF4C2',
      '--panel-border': '#E2A93B',

      '--accent': '#FF3B30',
      '--accent2': '#FFE066',

      '--text': '#3A2500',
      '--text-light': '#FFFBEF',
      '--text-muted': '#B88A00',

      '--bubble-self': '#FFE680',
      '--bubble-other': '#FFF9E0',

      '--window-title': '#FFCB05',
      '--heart': '#D62828',
    },
  },

  {
    id: 'pink',
    heartEmoji: '💌',
    preview: '/assets/themes/pink-preview.svg',
    avatar: '/assets/themes/pink-avatar.svg',
    icon: '/assets/themes/pink-icon.svg',
    vars: {
      // Heart Theme
      '--bg': '#C65B7C',
      '--bg-dark': '#A64565',
      '--bg-darker': '#70263F',

      '--panel': '#FFE6EC',
      '--panel-border': '#F59CB5',

      '--accent': '#FF3366',
      '--accent2': '#FFB3C6',

      '--text': '#3A0D1F',
      '--text-light': '#FFF5F8',
      '--text-muted': '#CB7C99',

      '--bubble-self': '#FFC2D1',
      '--bubble-other': '#FFF0F4',

      '--window-title': '#FF7AA2',
      '--heart': '#FF1744',
    },
  },
];

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  Object.entries(theme.vars).forEach(([k, v]) =>
    root.style.setProperty(k, v)
  );

  if (theme.preview)
    root.style.setProperty('--theme-preview', `url(${theme.preview})`);

  if (theme.avatar)
    root.style.setProperty('--theme-avatar', `url(${theme.avatar})`);

  if (theme.icon)
    root.style.setProperty('--theme-icon', `url(${theme.icon})`);

  if (theme.emoji?.[0])
    root.style.setProperty('--theme-emoji', theme.emoji[0]);
}