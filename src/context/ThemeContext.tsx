import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loadTheme, saveTheme, THEME_STORAGE_KEY } from '../theme';
import type { Theme } from '../theme';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // 惰性初始化：首次渲染前就从 localStorage 读出主题，避免先浅色后深色闪烁
  const [theme, setTheme] = useState<Theme>(() =>
    loadTheme(localStorage.getItem(THEME_STORAGE_KEY)),
  );

  // 单 Effect：主题变化时同时同步到 <html data-theme> 和 localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  }
  return context;
}
