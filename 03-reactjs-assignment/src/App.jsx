import { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import DeleteModal from './components/DeleteModal';
import './App.css';

const INITIAL_TODOS = [
  { id: 1, text: 'Learn ReactJS basics', isCompleted: true },
  { id: 2, text: 'Practice ReactJS', isCompleted: false },
  { id: 3, text: 'Learn Redux', isCompleted: false },
  { id: 4, text: 'Code portfolio in React', isCompleted: false },
  { id: 5, text: 'Learn React Native', isCompleted: false },
];

function App() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [todoToDelete, setTodoToDelete] = useState(null);

  const handleAddTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      isCompleted: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      })
    );
  };

  const handleEditTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText };
        }
        return todo;
      })
    );
  };

  const handleDeleteRequest = (id) => {
    setTodoToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoToDelete));
      setTodoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTodoToDelete(null);
  };

  // Completed tasks must be displayed first, followed by pending tasks
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? -1 : 1;
  });

  const filteredTodos = sortedTodos.filter((todo) => {
    if (activeFilter === 'done') return todo.isCompleted;
    if (activeFilter === 'todo') return !todo.isCompleted;
    return true;
  });

  return (
    <div className="app-container">
      <TodoInput onAddTodo={handleAddTodo} />
      <TodoList
        todos={filteredTodos}
        hasAnyTodos={todos.length > 0}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onToggleComplete={handleToggleComplete}
        onEditTodo={handleEditTodo}
        onDeleteTodo={handleDeleteRequest}
      />
      <DeleteModal
        isOpen={Boolean(todoToDelete)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default App;
