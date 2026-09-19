# TaskFlow - Task Manager with Routing

A modern single-page Task Management web application built with **React 18** and **React Router v6**. This application allows users to create, view, update, complete, filter, and delete tasks across dedicated views with nested layouts, dynamic parameter resolution, and route authentication protection.

**Live Demo:** [https://6task-manager-with-routing.vercel.app](https://6task-manager-with-routing.vercel.app)

## ✨ Core Features

- **Nested Route Architecture:** Uses React Router `<Outlet />` sub-routing under `/tasks` to modularize views (`/tasks`, `/tasks/add`, `/tasks/:id`, `/tasks/:id/edit`).
- **Dynamic Routing & URL Parameters:** Dedicated task detail and edit views parameterized by dynamic route IDs (`/tasks/:id`) using the `useParams` hook.
- **Basic Route Protection:** Implements a custom `<ProtectedRoute />` wrapper that intercepts unauthenticated requests, redirecting users to `/login` while saving intent in location state.
- **Task Lifecycle & Fields:**
  - **Task Header:** Headline identifier for the task.
  - **Task Description:** Detailed objectives and context.
  - **Priority:** Color-coded `High`, `Medium`, and `Low` priority badges.
  - **Category:** Segmented into `Academic`, `Personal`, and `Work`.
  - **Raised Date and Time:** Automatically captured and timestamped when the task is logged.
  - **Due Date:** Target completion date.
  - **Status:** Lifecycle states (`Raised`, `Pending`, `Closed`).
- **Real-Time Filtering & Search:** Filter active tasks by priority, category, or status, or search across headers and descriptions.
- **Dashboard & Analytics:** Overview metrics showing total, raised, pending, and closed task tallies with category distribution indicators.
- **Completed Tasks Archive:** Dedicated archive page for closed tasks with one-click reopening and permanent removal.

## 🚀 Routes Overview

| Route | Access | Description |
| :--- | :--- | :--- |
| `/login` | Public | Sign-in portal with one-click demo credentials |
| `/` | Protected | Dashboard overview with real-time stats and recent tasks |
| `/tasks` | Protected | Active tasks directory with multi-criteria filtering and search |
| `/tasks/add` | Protected | Task creation form with auto-stamped raised date |
| `/tasks/:id` | Protected | Dynamic task details page with status transitions |
| `/tasks/:id/edit` | Protected | Task modification view |
| `/completed` | Protected | Archive of all closed and completed tasks |

## 🛠️ Tech Stack

- **Framework:** React 18
- **Routing:** React Router v6 (`react-router-dom`)
- **State Management:** React Context API & Custom Hooks (`useTasks`, `useAuth`)
- **Styling:** Modular CSS3 with Custom Design Tokens & Flex/Grid layouts

## 💻 Getting Started

1. Navigate to the project directory:
   ```bash
   cd 6.task-manager-with-routing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

