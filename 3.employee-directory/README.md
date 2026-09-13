# Farm Employee Directory

A responsive and functional React web application built for managing farm staff records, employee details, and departmental allocation. The directory features full CRUD capabilities (Add, Edit, Delete), multi-criteria search, department filtering, and address management using React `useState()`, event handling, and conditional rendering.

---

## 🌾 Overview

The Farm Employee Directory provides an intuitive portal for farm administrators to track and manage staff information across multiple agricultural departments. Every employee record contains comprehensive professional and residential details.

### Employee Data Schema
Each employee record maintains:
- **Employee ID** (e.g. `EMP-101`)
- **Name** (Full staff name)
- **Department Name** (e.g. Crop Production, Dairy & Livestock, Farm Machinery, Horticulture, Harvesting & Storage, Administration)
- **Gender** (Male, Female, Other)
- **Phone Number** (10-digit contact number)
- **Local Address** (Current farm quarter or local residence)
- **Permanent Address** (Home town / permanent residential address)

---

## ⚡ Key Features

- **➕ Add Employee**: Register new farm workers with validated inputs for all personal, departmental, and residential fields. Includes an option to mirror local address to permanent address.
- **✏️ Edit Employee Details**: Edit existing employee information with pre-populated form fields and instantaneous roster updates.
- **🗑️ Delete Employee**: Remove employee records with a confirmation prompt.
- **🔍 Search Employee**: Real-time multi-field search querying Name, Employee ID, or Phone Number simultaneously.
- **🏢 Department Filter**: Filter staff by specific departments or view all departments combined.
- **📊 Employee Counts**: Dynamic metrics bar displaying Total Staff Count, Current Filtered Count, and Department Breakdown.
- **👁️ View Full Addresses**: Modal view for reviewing complete local and permanent address records.

---

## 🧱 Component Architecture & State Management

The application is structured into modular components:

```text
App (State Management)
 ├── Navbar (Branding & Add Employee toggle button)
 ├── FeedbackBanner (Conditional rendering for status messages)
 ├── StatsBar (Total count, filtered count, department counts)
 ├── SearchFilter (Search input, department select, reset action)
 ├── EmployeeForm (Conditional rendering: Add / Edit modes with validation)
 ├── EmployeeList (Table view, row actions: View, Edit, Delete, Empty states)
 ├── EmployeeDetailModal (Conditional rendering: Full address & staff profile view)
 └── Footer (Branding and copyright)
```

### State & Event Flow
- **`useState` Hooks**:
  - `employees`: Core list of farm employees initialized with seed data.
  - `searchTerm`: Tracks live user input in the search bar.
  - `selectedDepartment`: Tracks active department filter selection.
  - `isFormOpen`: Controls conditional rendering of the Add/Edit form.
  - `editingEmployee`: Holds the employee object currently being edited, or `null`.
  - `viewingEmployee`: Holds the employee object selected for detailed address modal view.
  - `feedbackMessage`: Controls transient success/warning banner notifications.
- **Event Handling**:
  - `onChange`: Captures controlled input and dropdown changes in search, filter, and form controls.
  - `onSubmit`: Handles form submission, validation error checks, and payload dispatch.
  - `onClick`: Handles toggles, modal open/close, edit triggers, and delete actions.
- **Conditional Rendering**:
  - Toggle between Add Employee form and Edit Employee form modes.
  - Show/hide form panel based on user interaction.
  - Show empty search result placeholder when no records match filter criteria.
  - Render address detail modal when an employee is selected for inspection.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Local Setup

1. Open a terminal and navigate to this folder:
   ```bash
   cd 3.employee-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

4. Run unit tests:
   ```bash
   npm test -- --watchAll=false
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
3.employee-directory/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── EmployeeDetailModal.css
│   │   ├── EmployeeDetailModal.js
│   │   ├── EmployeeForm.css
│   │   ├── EmployeeForm.js
│   │   ├── EmployeeList.css
│   │   ├── EmployeeList.js
│   │   ├── Navbar.css
│   │   ├── Navbar.js
│   │   ├── SearchFilter.css
│   │   ├── SearchFilter.js
│   │   ├── StatsBar.css
│   │   └── StatsBar.js
│   ├── data/
│   │   └── initialEmployees.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── setupTests.js
├── .gitignore
├── package.json
└── README.md
```

