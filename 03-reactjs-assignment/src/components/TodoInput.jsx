import { useState } from 'react';
import Button from './Button';

function TodoInput({ onAddTodo }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTodo(text);
    setText('');
  };

  return (
    <div className="card">
      <h2 className="section-title">TodoInput</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <span className="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <input
            type="text"
            className="todo-input"
            placeholder="New Todo"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <Button type="submit" variant="teal" className="btn-block">
          Add new task
        </Button>
      </form>
    </div>
  );
}

export default TodoInput;
