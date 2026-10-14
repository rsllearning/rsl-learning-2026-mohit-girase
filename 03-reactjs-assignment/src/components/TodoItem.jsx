import { useState } from 'react';
import Button from './Button';

function TodoItem({ todo, onToggleComplete, onEditTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleConfirmEdit = () => {
    onEditTodo(todo.id, editText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
        />
        <div className="edit-actions">
          <Button variant="silver" size="sm" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button variant="teal" size="sm" onClick={handleConfirmEdit}>
            Confirm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
      <span className="todo-text">{todo.text}</span>

      <div className="todo-actions">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.isCompleted}
          disabled={todo.isCompleted}
          onChange={() => onToggleComplete(todo.id)}
          title={todo.isCompleted ? 'Completed task cannot be undone' : 'Mark as complete'}
        />

        <Button
          variant="silver"
          size="sm"
          disabled={todo.isCompleted}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          size="sm"
          disabled={!todo.isCompleted}
          onClick={() => onDeleteTodo(todo.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default TodoItem;
