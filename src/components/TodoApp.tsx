import { useEffect, useState } from 'react';
import {
  addTodo,
  clearCompleted,
  editTodo,
  filterTodos,
  loadTodos,
  MAX_TEXT_LENGTH,
  normalizeText,
  removeTodo,
  toggleTodo,
} from '../todo';
import type { Filter, Todo } from '../todo';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

const STORAGE_KEY = 'todos';

const FILTERS: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'done', label: '已完成' },
];

function readInitialTodos(): Todo[] {
  return loadTodos(localStorage.getItem(STORAGE_KEY));
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(readInitialTodos);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (text: string): boolean => {
    const content = normalizeText(text);
    if (content.length === 0 || content.length > MAX_TEXT_LENGTH) return false;
    setTodos((prev) => addTodo(prev, text));
    return true;
  };

  const handleToggle = (id: number): void => {
    setTodos((prev) => toggleTodo(prev, id));
  };

  const handleDelete = (id: number): void => {
    setTodos((prev) => removeTodo(prev, id));
  };

  const handleEdit = (id: number): void => {
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;
    const nextText = prompt('修改任务内容：', target.text);
    if (nextText === null) return;
    setTodos((prev) => editTodo(prev, id, nextText));
  };

  const shownTodos = filterTodos(todos, filter);
  const hasCompleted = todos.some((todo) => todo.completed);

  return (
    <main className="todo-container">
      <h1>Todo 列表 V4.0</h1>
      <TodoForm onAdd={handleAdd} />
      <p className="input-hint">内容会自动去除首尾空格，最多 200 字。</p>

      <div className="filter-area">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            className={`filter-btn${filter === value ? ' active' : ''}`}
            type="button"
            data-filter={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <TodoList
        todos={shownTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <div className="footer-area">
        <span>共 {todos.length} 项</span>
        <button
          className="clear-btn"
          type="button"
          disabled={!hasCompleted}
          onClick={() => setTodos((prev) => clearCompleted(prev))}
        >
          清除已完成
        </button>
      </div>
    </main>
  );
}
