import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

const initialSeedTasks = [
  {
    id: 'tsk-201',
    header: 'Security Audit & Penetration Testing',
    description: 'Execute vulnerability scan on authentication endpoints and review simulated JWT signing keys.',
    priority: 'High',
    category: 'Work',
    raisedDate: '18 Sep 2026, 09:30 AM',
    dueDate: '2026-08-28',
    status: 'Pending',
  },
  {
    id: 'tsk-202',
    header: 'Review Cryptography & Token RFC Specs',
    description: 'Study RFC 7519 standards for claims validation, token refresh routines, and local storage safety.',
    priority: 'Medium',
    category: 'Academic',
    raisedDate: '17 Sep 2026, 02:15 PM',
    dueDate: '2026-09-02',
    status: 'Raised',
  },
  {
    id: 'tsk-203',
    header: 'Setup Two-Factor Authentication Backup Codes',
    description: 'Print emergency recovery codes and store securely in offline password vault.',
    priority: 'Low',
    category: 'Personal',
    raisedDate: '15 Sep 2026, 04:00 PM',
    dueDate: '2026-08-25',
    status: 'Closed',
  },
  {
    id: 'tsk-204',
    header: 'Deploy Route Protection Integration Tests',
    description: 'Validate redirection behavior when tokens expire or are tampered with in storage.',
    priority: 'High',
    category: 'Work',
    raisedDate: '18 Sep 2026, 11:00 AM',
    dueDate: '2026-08-30',
    status: 'Raised',
  },
  {
    id: 'tsk-205',
    header: 'Update Academic Research Bibliography',
    description: 'Format references for the upcoming symposium submission according to APA standards.',
    priority: 'Medium',
    category: 'Academic',
    raisedDate: '14 Sep 2026, 03:45 PM',
    dueDate: '2026-08-28',
    status: 'Closed',
  },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('authguard_tasks');
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
    localStorage.setItem('authguard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTaskData) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
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

