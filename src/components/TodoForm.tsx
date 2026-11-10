import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

export interface TodoFormProps {
  onAdd: (text: string) => boolean;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (onAdd(text)) setText('');
    inputRef.current?.focus();
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        id="todoInput"
        type="text"
        value={text}
        placeholder="输入待办事项"
        onChange={(event) => setText(event.target.value)}
      />
      <button id="addBtn" type="submit">
        添加
      </button>
    </form>
  );
}
