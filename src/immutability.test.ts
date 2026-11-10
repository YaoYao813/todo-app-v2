import { expect, test } from 'vitest';
import { addTodo, clearCompleted, editTodo, removeTodo, toggleTodo } from './todo';
import type { Todo } from './todo';

const seed = (): Todo[] => [
  { id: 1, text: '学习React', completed: false },
  { id: 2, text: '写单测', completed: true },
];

test('addTodo 不修改原数组，返回新数组', () => {
  const todos = seed();
  const next = addTodo(todos, '复习State');
  expect(next).not.toBe(todos);
  expect(todos.length).toBe(2);
  expect(next.length).toBe(3);
  expect(next[2].text).toBe('复习State');
});

test('toggleTodo 只替换目标项，原数组和原对象都不变', () => {
  const todos = seed();
  const next = toggleTodo(todos, 1);
  expect(next).not.toBe(todos);
  expect(next[0]).not.toBe(todos[0]);
  expect(next[1]).toBe(todos[1]);
  expect(todos[0].completed).toBe(false);
  expect(next[0].completed).toBe(true);
});

test('removeTodo 和 clearCompleted 返回新数组，不修改原数据', () => {
  const todos = seed();
  const removed = removeTodo(todos, 1);
  const cleared = clearCompleted(todos);
  expect(removed.map((todo) => todo.id)).toEqual([2]);
  expect(cleared.map((todo) => todo.id)).toEqual([1]);
  expect(todos.length).toBe(2);
});

test('editTodo 合法输入返回新数组，非法输入原样返回', () => {
  const todos = seed();
  const edited = editTodo(todos, 1, '  复习React  ');
  expect(edited).not.toBe(todos);
  expect(edited[0].text).toBe('复习React');
  expect(todos[0].text).toBe('学习React');

  const rejected = editTodo(todos, 1, '   ');
  expect(rejected).toBe(todos);
});
