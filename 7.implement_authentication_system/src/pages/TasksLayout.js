import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * TasksLayout Component
 * Serves as nested route container for /tasks, /tasks/add, /tasks/:id, /tasks/:id/edit
 */
const TasksLayout = () => {
  return (
    <div className="tasks-layout-view">
      <Outlet />
    </div>
  );
};

export default TasksLayout;

