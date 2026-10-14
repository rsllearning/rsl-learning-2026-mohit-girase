# Todo List App

A simple Todo List application built with React and Vite.

## Features

- **Add Todo**: Enter a task description and click "Add new task". New tasks are added at the end of the list.
- **Task Ordering**: Completed tasks appear first at the top, followed by pending tasks.
- **Edit Todo**: Click "Edit" to modify a task with inline Confirm and Cancel buttons.
- **Todo Completion**: Check the checkbox to mark a task as completed (turns green with a strikethrough). Completed tasks cannot be unchecked or edited.
- **Delete Todo**: Only completed tasks can be deleted. A confirmation dialog appears before deleting.
- **Filters**: Filter tasks by All, Done, or Todo. The active filter button has an opacity of 0.6. Filters are only visible when tasks exist.
- **Empty State**: Displays "No todo is available" when there are no tasks in the list.

## Project Structure

```text
03-reactjs-assignment/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── TodoInput.jsx
│   │   ├── TodoItem.jsx
│   │   └── TodoList.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## How to Run

1. Navigate to the project directory:
   ```bash
   cd 03-reactjs-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Run lint:
   ```bash
   npm run lint
   ```

## Video Demonstration

Link - [Google Drive](https://drive.google.com/file/d/126knQhSBpVn0F14DyMEKentN5874NmRT/view?usp=sharing)
