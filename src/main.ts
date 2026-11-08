import {
  addTodo,
  clearCompleted,
  editTodo,
  loadTodos,
  removeTodo,
  toggleTodo,
  type Todo,
} from './todo';

type Filter = 'all' | 'active' | 'done';

const STORAGE_KEY = 'todos';

function isFilter(value: string | undefined): value is Filter {
  return value === 'all' || value === 'active' || value === 'done';
}

function findTodoId(item: Element): number | null {
  if (!(item instanceof HTMLElement)) return null;
  const id = Number(item.dataset.id);
  return Number.isSafeInteger(id) ? id : null;
}

function getAction(actionEl: Element | null, item: Element): string | null {
  if (!(actionEl instanceof HTMLElement) || !item.contains(actionEl)) return null;
  return actionEl.dataset.action ?? null;
}

function bootstrap(): void {
  const todoInput = document.getElementById('todoInput');
  const addBtn = document.getElementById('addBtn');
  const todoListEl = document.getElementById('todoList');
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');

  if (
    !(todoInput instanceof HTMLInputElement) ||
    !(addBtn instanceof HTMLButtonElement) ||
    !(todoListEl instanceof HTMLUListElement)
  ) {
    console.error('Todo列表初始化失败：页面缺少关键DOM元素');
    return;
  }

  const todos: Todo[] = loadTodos(localStorage.getItem(STORAGE_KEY));
  let filter: Filter = 'all';

  const save = (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  };

  const render = (): void => {
    todoListEl.replaceChildren();
    const fragment = document.createDocumentFragment();
    const shown = todos.filter((todo) => {
      if (filter === 'done') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return true;
    });

    for (const todo of shown) {
      const li = document.createElement('li');
      li.dataset.id = String(todo.id);
      if (todo.completed) li.classList.add('done');

      const textEl = document.createElement('span');
      textEl.className = 'task-text';
      textEl.textContent = todo.text;
      li.appendChild(textEl);

      const actionsEl = document.createElement('span');
      actionsEl.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = '编辑';
      editBtn.className = 'edit-btn';
      editBtn.dataset.action = 'edit';
      actionsEl.appendChild(editBtn);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.textContent = '×';
      delBtn.className = 'del-btn';
      delBtn.dataset.action = 'delete';
      actionsEl.appendChild(delBtn);

      li.appendChild(actionsEl);
      fragment.appendChild(li);
    }
    todoListEl.appendChild(fragment);
  };

  const commit = (): void => {
    save();
    render();
  };

  const handleAdd = (): void => {
    const before = todos.length;
    addTodo(todos, todoInput.value);
    if (todos.length === before) {
      todoInput.focus();
      return;
    }
    commit();
    todoInput.value = '';
    todoInput.focus();
  };

  const handleEdit = (id: number): void => {
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;
    const next = prompt('修改任务内容：', target.text);
    if (next === null) return;
    if (editTodo(todos, id, next)) commit();
  };

  const applyFilter = (next: Filter): void => {
    filter = next;
    for (const btn of filterBtns) {
      btn.classList.toggle('active', btn.dataset.filter === next);
    }
    render();
  };

  addBtn.addEventListener('click', handleAdd);

  todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleAdd();
  });

  for (const btn of filterBtns) {
    btn.addEventListener('click', () => {
      const next = btn.dataset.filter;
      if (isFilter(next)) applyFilter(next);
    });
  }

  todoListEl.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const item = event.target.closest('li');
    if (!item || !todoListEl.contains(item)) return;

    const id = findTodoId(item);
    if (id === null) return;

    const action = getAction(event.target.closest('[data-action]'), item);
    if (action === 'delete') {
      removeTodo(todos, id);
      commit();
      return;
    }
    if (action === 'edit') {
      handleEdit(id);
      return;
    }
    toggleTodo(todos, id);
    commit();
  });

  window.clearCompleted = (): void => {
    clearCompleted(todos);
    commit();
  };

  render();
  todoInput.focus();
}

declare global {
  interface Window {
    clearCompleted?: () => void;
  }
}

bootstrap();
