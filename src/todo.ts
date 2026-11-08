export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const MAX_TEXT_LENGTH = 200;

export function normalizeText(text: string | null | undefined): string {
  return text?.trim() ?? '';
}

export function addTodo(todos: Todo[], text: string | null | undefined): void {
  const content = normalizeText(text);
  if (content.length === 0 || content.length > MAX_TEXT_LENGTH) return;
  todos.push({ id: createId(todos), text: content, completed: false });
}

export function toggleTodo(todos: Todo[], id: number): void {
  const target = todos.find((todo) => todo.id === id);
  if (!target) return;
  target.completed = !target.completed;
}

export function removeTodo(todos: Todo[], id: number): void {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return;
  todos.splice(index, 1);
}

export function editTodo(todos: Todo[], id: number, text: string | null | undefined): boolean {
  const target = todos.find((todo) => todo.id === id);
  if (!target) return false;
  const content = normalizeText(text);
  if (content.length === 0 || content.length > MAX_TEXT_LENGTH) return false;
  target.text = content;
  return true;
}

export function clearCompleted(todos: Todo[]): void {
  for (let i = todos.length - 1; i >= 0; i -= 1) {
    const todo = todos[i];
    if (todo !== undefined && todo.completed) todos.splice(i, 1);
  }
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
