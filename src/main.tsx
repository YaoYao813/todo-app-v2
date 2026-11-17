import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TodoApp } from './components/TodoApp';
import { ThemeProvider } from './context/ThemeContext';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('缺少 #root 挂载点');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <TodoApp />
    </ThemeProvider>
  </StrictMode>,
);
