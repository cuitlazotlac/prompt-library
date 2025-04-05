export type Theme = 'dark' | 'light' | 'system';

export const themes: Theme[] = ['dark', 'light', 'system'];

export function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
} 