import type { MouseEvent } from 'react';
import type { Todo } from '../todo';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const stopAndRun = (event: MouseEvent<HTMLButtonElement>, action: () => void): void => {
    event.stopPropagation();
    action();
  };

  return (
    <li
      className={todo.completed ? 'done' : undefined}
      data-id={todo.id}
      onClick={() => onToggle(todo.id)}
    >
      <span className="task-text">{todo.text}</span>
      <span className="task-actions">
        <button
          className="edit-btn"
          type="button"
          onClick={(event) => stopAndRun(event, () => onEdit(todo.id))}
        >
          编辑
        </button>
        <button
          className="del-btn"
          type="button"
          aria-label={`删除任务：${todo.text}`}
          onClick={(event) => stopAndRun(event, () => onDelete(todo.id))}
        >
          ×
        </button>
      </span>
    </li>
  );
}
