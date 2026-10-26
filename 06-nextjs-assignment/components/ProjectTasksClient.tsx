'use client';

import React, { useState } from 'react';
import { ProjectTask, TaskStatus } from '@/lib/types';
import { Check, Plus } from 'lucide-react';

interface ProjectTasksClientProps {
  initialTasks: ProjectTask[];
}

export default function ProjectTasksClient({
  initialTasks,
}: ProjectTasksClientProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [newTaskTitle, setNewTitle] = useState('');

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus: TaskStatus = t.status === 'done' ? 'todo' : 'done';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: 'Added via client interactivity.',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: 'Current User',
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
  };

  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>Tasks ({doneCount}/{tasks.length} completed)</span>
        <span className="text-zinc-500">Click item to toggle status</span>
      </div>

      {/* Add Task input */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-600"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Task List */}
      <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/40">
        {tasks.map((task) => {
          const isDone = task.status === 'done';
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between p-3 hover:bg-zinc-900/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isDone
                      ? 'border-zinc-400 bg-zinc-200 text-zinc-950'
                      : 'border-zinc-600 bg-transparent'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="space-y-0.5">
                  <span
                    className={`text-xs ${
                      isDone ? 'line-through text-zinc-500' : 'text-zinc-200'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="text-[11px] text-zinc-500">
                    Assigned to: {task.assignedTo} • Due: {task.dueDate}
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-1.5 py-0.2 rounded border border-zinc-800 text-zinc-500 capitalize">
                {task.priority}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
