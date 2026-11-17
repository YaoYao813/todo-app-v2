import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-pressed={isDark}
      aria-label={isDark ? '切换到浅色主题' : '切换到深色主题'}
      onClick={toggleTheme}
    >
      {isDark ? '☀️ 浅色' : '🌙 深色'}
    </button>
  );
}
