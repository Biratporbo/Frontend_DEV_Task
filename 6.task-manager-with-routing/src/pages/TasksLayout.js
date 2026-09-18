import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * TasksLayout acts as the parent layout for all nested /tasks routes:
 * - /tasks (index -> Tasks list)
 * - /tasks/add (AddTask)
 * - /tasks/:id (TaskDetails)
 * - /tasks/:id/edit (EditTask)
 * This directly demonstrates React Router's nested route architecture with <Outlet />.
 */
const TasksLayout = () => {
  return (
    <div className="tasks-layout-container">
      <Outlet />
    </div>
  );
};

export default TasksLayout;

