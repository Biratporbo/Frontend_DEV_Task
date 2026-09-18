# AuthGuard - Authentication System & Task Workspace

A secure enterprise-grade single-page application built with **React 18** and **React Router v6**. Demonstrates a complete authentication system with simulated **JSON Web Tokens (JWT - RFC 7519)**, route protection, interactive password strength analytics, session management with Local and Session Storage, and an integrated Task Management workspace.

**Live Demo:** [https://7implementauthenticationsystem.vercel.app](https://7implementauthenticationsystem.vercel.app)

## ✨ Security & Authentication Features

- **Simulated JWT Token Architecture (RFC 7519):**
  - Realistic 3-part Base64Url-encoded tokens: `[header].[payload].[signature]`.
  - Header: Algorithm (`HS256`) and Token Type (`JWT`).
  - Payload Claims: Subject (`sub`), Username, Name, Email, Role, Issued At (`iat`), and Expiration Timestamp (`exp`).
  - Cryptographic signature simulation.
- **JWT Token Claims Inspector:**
  - Interactive modal accessible from the top navigation bar.
  - Live inspection of raw encoded tokens with colored parts (Header, Payload, Signature).
  - Decoded JSON preview of claims and live countdown timer until token expiration.
  - Test feature to simulate token expiration and verify route protection behavior.
- **Interactive Password Strength Meter:**
  - Real-time password entropy calculation with color-coded score indicators (`Weak`, `Fair`, `Good`, `Strong`).
  - Dynamic criteria checklist:
    - &check; Minimum 8 characters
    - &check; Lowercase letters (`a-z`)
    - &check; Uppercase letters (`A-Z`)
    - &check; Numeric digits (`0-9`)
    - &check; Special characters (`!@#$%^&*`)
- **Username & Password Validation:**
  - Required field enforcement with inline validation feedback and touch state tracking.
  - Password visibility toggle (Show/Hide with SVG eye icons).
- **Remember User & Dual Storage Strategy:**
  - **Remember Me Enabled:** JWT token and username are stored in persistent `localStorage` for long-term session survival across browser restarts.
  - **Remember Me Disabled:** JWT token is scoped strictly to `sessionStorage`, auto-purging on tab or browser closure.
- **Route Protection & Session Verification:**
  - Custom `<ProtectedRoute />` wrapper checks token presence and validity before granting route access.
  - Unauthenticated navigation attempts are redirected to `/login` while capturing the intended destination in location state.
  - Automatic background verification checks token expiration and invalidates expired sessions.

---

## 📋 Integrated Task Management Workspace

- **Dashboard:** Overview metrics showing Total, Raised, Pending, Closed, and High Priority tasks with category distributions.
- **Active Tasks Directory (`/tasks`):** Filter by status, priority, and category with real-time title and description search.
- **Add Task (`/tasks/add`):** Task creation form with automatically captured creation timestamp.
- **Task Details (`/tasks/:id`):** Dynamic route parameterized by task ID with one-click status transitions (`Raised`, `Pending`, `Closed`) and deletion.
- **Task Editing (`/tasks/:id/edit`):** Full inline editing of task header, description, priority, category, and due date.
- **Completed Archive (`/completed`):** Dedicated view of completed/closed tasks with one-click reopening.

---

## 🛠️ Technology Stack

- **Framework:** React 18
- **Routing:** React Router v6 (`react-router-dom`)
- **State Management:** React Context API (`AuthContext`, `TaskContext`)
- **Security:** Simulated JWT (Base64Url, RFC 7519), Regex-based Password Strength Analysis
- **Storage:** LocalStorage & SessionStorage API
- **Styling:** Modern CSS3 with Design Tokens, Flexbox, and CSS Grid

---

## 💻 Getting Started

1. Navigate to the project directory:
   ```bash
   cd 7.implement_authentication_system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to test the authentication flow.

