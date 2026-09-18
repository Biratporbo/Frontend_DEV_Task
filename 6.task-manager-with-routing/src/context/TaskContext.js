import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

const initialSeedTasks = [
  {
    id: 'tsk-101',
    header: 'Finalize Thesis Literature Review',
    description: 'Synthesize research papers on deep learning architectures for modern vision transformers and submit draft to advisor.',
    priority: 'High',
    category: 'Academic',
    raisedDate: '15 Aug 2026, 10:30 AM',
    dueDate: '2026-08-28',
    status: 'Pending',
  },
  {
    id: 'tsk-102',
    header: 'Renew Health Insurance Policy',
    description: 'Review updated policy terms, compare premium options for the upcoming fiscal year, and complete online renewal payment.',
    priority: 'Medium',
    category: 'Personal',
    raisedDate: '16 Aug 2026, 02:15 PM',
    dueDate: '2026-09-05',
    status: 'Raised',
  },
  {
    id: 'tsk-103',
    header: 'Database Schema Migration for Analytics',
    description: 'Execute indexing strategy and partition legacy event tables to enhance query throughput across the reporting pipeline.',
    priority: 'High',
    category: 'Work',
    raisedDate: '12 Aug 2026, 09:00 AM',
    dueDate: '2026-08-20',
    status: 'Closed',
  },
  {
    id: 'tsk-104',
    header: 'Prepare Computational Biology Seminar Slides',
    description: 'Create diagrams for protein folding simulations and rehearse timing for the department colloquium next week.',
    priority: 'Medium',
    category: 'Academic',
    raisedDate: '17 Aug 2026, 11:45 AM',
    dueDate: '2026-08-28',
    status: 'Raised',
  },
  {
    id: 'tsk-105',
    header: 'Annual Vehicle Safety Inspection',
    description: 'Book mechanic appointment for brake check, tire rotation, and state emissions certification.',
    priority: 'Low',
    category: 'Personal',
    raisedDate: '10 Aug 2026, 04:20 PM',
    dueDate: '2026-08-25',
    status: 'Closed',
  }
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialSeedTasks;
      }
    }
    return initialSeedTasks;
  });

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTaskData) => {
    // Automatically pick raised date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const raisedDate = `${formattedDate}, ${formattedTime}`;

    const newTask = {
      ...newTaskData,
      id: `tsk-${Date.now().toString().slice(-4)}`,
      raisedDate,
      status: newTaskData.status || 'Raised',
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask.id;
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
    );
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTaskById = (id) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

