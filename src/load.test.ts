import { expect, test } from 'vitest';
import { loadTodos } from './todo';

test('loadTodos 空数据：null 返回空数组', () => {
  expect(loadTodos(null)).toEqual([]);
});

test('loadTodos 坏 JSON：返回空数组，不崩溃', () => {
  expect(loadTodos('{not-json')).toEqual([]);
});

test('loadTodos 脏数据：只保留合法任务', () => {
  const raw = JSON.stringify([
    { id: 1, text: '学习TS', completed: false },
    { id: '2', text: '字符串 id', completed: false },
    { id: 3, text: '   ', completed: false },
    { id: 4, text: '缺 completed 字段' },
    { id: 5, text: '状态不是布尔值', completed: 'yes' },
    { id: 6, text: '写单测', completed: true },
  ]);

  const todos = loadTodos(raw);

  expect(todos.length).toBe(2);
  expect(todos[0].id).toBe(1);
  expect(todos[1].id).toBe(6);
});
