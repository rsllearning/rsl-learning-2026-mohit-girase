import TodoItem from './TodoItem';
import Button from './Button';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'done', label: 'Done' },
  { id: 'todo', label: 'Todo' },
];

function TodoList({
  todos,
  hasAnyTodos,
  activeFilter,
  onFilterChange,
  onToggleComplete,
  onEditTodo,
  onDeleteTodo,
}) {
  return (
    <div className="card">
      <h2 className="section-title">TodoList</h2>

      {hasAnyTodos && (
        <div className="filter-buttons">
          {FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant="teal"
              className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      )}

      <div className="todo-items-list">
        {!hasAnyTodos ? (
          <p className="empty-message">No todo is available</p>
        ) : todos.length === 0 ? (
          <p className="empty-message">No {activeFilter === 'done' ? 'completed' : 'pending'} todos available</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onEditTodo={onEditTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
