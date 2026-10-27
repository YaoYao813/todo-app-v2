import { expect, test } from 'vitest';
import { addTodo, toggleTodo } from './todo';
import type { Todo } from './todo';

test('addTodo 正常添加：长度 +1，文本内容正确', () => {
  const todos: Todo[] = [];
  addTodo(todos, '学习TS');
  expect(todos.length).toBe(1);
  expect(todos[0].text).toBe('学习TS');
  expect(todos[0].completed).toBe(false);
});

test('addTodo 纯空格：拦截，不入库', () => {
  const todos: Todo[] = [];
  addTodo(todos, '   ');
  expect(todos.length).toBe(0);
});

test('addTodo 空字符串：拦截，不入库', () => {
  const todos: Todo[] = [];
  addTodo(todos, '');
  expect(todos.length).toBe(0);
});

test('toggleTodo 正常切换：目标翻转，其他用例不受影响', () => {
  const todos: Todo[] = [
    { id: 1, text: '学习TS', completed: false },
    { id: 2, text: '写单测', completed: false },
  ];
  toggleTodo(todos, 1);
  expect(todos[0].completed).toBe(true);
  expect(todos[1].completed).toBe(false);
});

test('toggleTodo 不存在的 ID：不崩溃，数据不变', () => {
  const todos: Todo[] = [{ id: 1, text: '学习TS', completed: false }];
  toggleTodo(todos, 999);
  expect(todos.length).toBe(1);
  expect(todos[0].completed).toBe(false);
});
