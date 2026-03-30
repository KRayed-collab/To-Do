import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

// Initial default tasks for new users
const initialTasks = [
  { id: uuidv4(), title: 'Plan project architecture', description: 'Draft out components and state.', priority: 'High', status: 'Pending', dueDate: new Date().toISOString() },
  { id: uuidv4(), title: 'Setup Vite React App', description: 'Run create-vite and install deps.', priority: 'Medium', status: 'Completed', dueDate: new Date().toISOString() },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error('Failed to parse tasks', e);
        return initialTasks;
      }
    }
    return initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: uuidv4(), status: 'Pending' }]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedFields } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const reorderTasks = (newTasks) => {
    setTasks(newTasks);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, reorderTasks, stats }}>
      {children}
    </TaskContext.Provider>
  );
};
