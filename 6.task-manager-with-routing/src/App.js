import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TasksLayout from './pages/TasksLayout';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import TaskDetails from './pages/TaskDetails';
import EditTask from './pages/EditTask';
import CompletedTasks from './pages/CompletedTasks';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Application Tree */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Index */}
              <Route index element={<Dashboard />} />

              {/* Nested Routes for Tasks: /tasks */}
              <Route path="tasks" element={<TasksLayout />}>
                <Route index element={<Tasks />} />
                <Route path="add" element={<AddTask />} />
                <Route path=":id" element={<TaskDetails />} />
                <Route path=":id/edit" element={<EditTask />} />
              </Route>

              {/* Completed Tasks Route */}
              <Route path="completed" element={<CompletedTasks />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Global Redirect fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;

