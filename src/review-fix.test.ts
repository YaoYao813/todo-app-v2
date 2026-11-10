import { expect, test } from 'vitest';
import { addTodo, MAX_TEXT_LENGTH } from './todo';
import type { Todo } from './todo';

// 维度1（空值）：null 应被拦截
test('维度1 空值：null 被拦截', () => {
  const todos: Todo[] = [];
  const next = addTodo(todos, null);
  expect(next).toBe(todos);
  expect(next.length).toBe(0);
});

// 维度2（格式拓展）：超长文本应被拦截
test('维度2 格式：超长文本被拦截', () => {
  const todos: Todo[] = [];
  const next = addTodo(todos, 'a'.repeat(MAX_TEXT_LENGTH + 1));
  expect(next).toBe(todos);
  expect(next.length).toBe(0);
});

// 维度2（格式边界）：恰好达到上限仍可添加
test('维度2 边界：恰好 200 字允许添加', () => {
  const next = addTodo([], 'a'.repeat(MAX_TEXT_LENGTH));
  expect(next.length).toBe(1);
  expect(next[0].text.length).toBe(MAX_TEXT_LENGTH);
});

// 维度6（重复）：相同文本允许重复添加，且 id 不重复
test('维度6 重复：相同文本可重复添加', () => {
  const first = addTodo([], '学习TS');
  const second = addTodo(first, '学习TS');
  expect(second.length).toBe(2);
  expect(second[0].text).toBe('学习TS');
  expect(second[1].text).toBe('学习TS');
  expect(second[0].id).not.toBe(second[1].id);
});
