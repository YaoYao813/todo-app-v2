export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'done';

export const MAX_TEXT_LENGTH = 200;

export function normalizeText(text: string | null | undefined): string {
  return text?.trim() ?? '';
}

/**
 * 添加任务：返回新数组；内容非法时原样返回旧数组（引用不变）。
 */
export function addTodo(todos: Todo[], text: string | null | undefined): Todo[] {
  const content = normalizeText(text);
  if (content.length === 0 || content.length > MAX_TEXT_LENGTH) return todos;
  return [...todos, { id: createId(todos), text: content, completed: false }];
}

/**
 * 切换完成状态：只替换目标项，其余对象保持原引用。
 */
export function toggleTodo(todos: readonly Todo[], id: number): Todo[] {
  return todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
}

export function removeTodo(todos: readonly Todo[], id: number): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

/**
 * 编辑任务：返回新数组；ID 不存在或内容非法时原样返回旧数组。
 */
export function editTodo(todos: Todo[], id: number, text: string | null | undefined): Todo[] {
  const content = normalizeText(text);
  if (content.length === 0 || content.length > MAX_TEXT_LENGTH) return todos;
  if (!todos.some((todo) => todo.id === id)) return todos;
  return todos.map((todo) => (todo.id === id ? { ...todo, text: content } : todo));
}

export function clearCompleted(todos: readonly Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}

export function filterTodos(todos: readonly Todo[], filter: Filter): Todo[] {
  if (filter === 'done') return todos.filter((todo) => todo.completed);
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  return [...todos];
}

export function loadTodos(raw: string | null): Todo[] {
  if (raw === null) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const todos: Todo[] = [];
  for (const item of parsed) {
    if (isTodo(item)) todos.push({ ...item });
  }
  return todos;
}

function createId(todos: readonly Todo[]): number {
  let maxId = 0;
  for (const todo of todos) {
    if (Number.isSafeInteger(todo.id) && todo.id > maxId) maxId = todo.id;
  }
  return maxId + 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasTodoFields(value: Record<string, unknown>): boolean {
  return 'id' in value && 'text' in value && 'completed' in value;
}

function isValidId(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value);
}

function isValidText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isTodo(value: unknown): value is Todo {
  if (!isRecord(value) || !hasTodoFields(value)) return false;
  return isValidId(value.id) && isValidText(value.text) && typeof value.completed === 'boolean';
}
