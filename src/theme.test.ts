import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, isTheme, loadTheme } from './theme';

describe('loadTheme 安全读取主题', () => {
  it('从未保存过时使用浅色', () => {
    expect(loadTheme(null)).toBe(DEFAULT_THEME);
  });

  it('读取已保存的深色 / 浅色', () => {
    expect(loadTheme('dark')).toBe('dark');
    expect(loadTheme('light')).toBe('light');
  });

  it('非法值回退到浅色，不抛异常', () => {
    expect(loadTheme('blue')).toBe('light');
    expect(loadTheme('')).toBe('light');
    expect(loadTheme('"dark"')).toBe('light');
  });
});

describe('isTheme 类型守卫', () => {
  it('只接受 light / dark', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('DARK')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});
