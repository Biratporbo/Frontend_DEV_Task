# Student Information Management Portal (Assignment 2)

A modular, responsive React application built to demonstrate **Props**, **Component Reusability**, and **Hierarchical Data Passing**, featuring dynamic **CGPA Sorting** and real-time filtering.

## Link

- **GitHub:** [Frontend_DEV_Task](https://github.com/Biratporbo/Frontend_DEV_Task)

---

## 📋 Overview & Problem Statement

This project implements **Assignment 2: Student Information Management using Props**. The application displays a directory of student cards containing essential academic details, with all information routed cleanly from the root component through reusable sub-components via React props.

### Key Card Information
Each student card displays:
- 👤 **Name**
- 🆔 **Roll Number**
- 🏛️ **Department**
- 📅 **Semester**
- 📊 **CGPA** (with color-coded performance tiers and a visual progress meter)
- 🖼️ **Photo** (with automatic avatar fallback for broken image links)

---

## 🧱 Component Architecture & Props Flow

The application is structured into modular components:

```text
App (Root Component)
 ├── Header (Props: title, subtitle, stats)
 ├── StudentList (Props: students, sortOrder, onSortChange, searchQuery, etc.)
 │    └── StudentCard (Props: name, rollNumber, department, semester, cgpa, photo, rank)
 └── Footer (Props: portalName, developer, academicYear, course)
```

### Props Passing Breakdown

| Component | Props Received | Purpose |
| :--- | :--- | :--- |
| **`Header`** | `title`, `subtitle`, `stats` | Renders branding, header title, and quick portal metrics (Total Enrolled, Avg CGPA, Top CGPA). |
| **`StudentList`** | `students`, `sortOrder`, `onSortChange`, `searchQuery`, `onSearchChange`, `selectedDepartment`, `onDepartmentChange`, `departments`, `totalCount` | Houses toolbar controls (CGPA sort buttons, search bar, department selector) and iterates through students to render cards. |
| **`StudentCard`** | `name`, `rollNumber`, `department`, `semester`, `cgpa`, `photo`, `rank`, `email` | Reusable card rendering individual student information with CGPA progress bar, honors badges, and image fallback. |
| **`Footer`** | `portalName`, `developer`, `academicYear`, `course` | Renders attribution, copyright, and assignment details. |

---

## ⚡ Sorting Mechanism by CGPA

The portal provides an interactive CGPA sorting mechanism:

1. **High to Low (↓)**:
   - Sorts students in descending order of CGPA (`b.cgpa - a.cgpa`).
   - Automatically computes and displays rank badges (`Rank #1`, `Rank #2`, etc.) on each card.
2. **Low to High (↑)**:
   - Sorts students in ascending order of CGPA (`a.cgpa - b.cgpa`).
   - Displays rank indicators in ascending order.
3. **Reset (↺)**:
   - Restores the natural roll-call order of the student roster.

---

## 🎨 Design & Accessibility Features

- **Responsive Grid**: Built with modern CSS Grid (`repeat(auto-fill, minmax(280px, 1fr))`) ensuring seamless display across mobile, tablet, and widescreen monitors.
- **CGPA Tiers & Progress Meter**:
  - **Outstanding (>= 9.0)**: Emerald badge & Dean's List honor tag
  - **Very Good (8.0 - 8.99)**: Blue accent
  - **Good (7.0 - 7.99)**: Violet accent
  - **Satisfactory (< 7.0)**: Amber accent
- **Image Error Handling**: If a photo URL fails to load, the card gracefully falls back to an SVG initials avatar without layout shifts.
- **Accessible & Semantic**: Uses semantic HTML5 (`<header>`, `<main>`, `<article>`, `<figure>`, `<footer>`, progress bars with `aria-valuenow`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Running

1. Navigate to the project directory:
   ```bash
   cd 2.student-information
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portal in your browser.

4. Run automated test suite:
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
2.student-information/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Footer.css
│   │   ├── Footer.js
│   │   ├── Header.css
│   │   ├── Header.js
│   │   ├── StudentCard.css
│   │   ├── StudentCard.js
│   │   ├── StudentList.css
│   │   └── StudentList.js
│   ├── data/
│   │   └── studentsData.js
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

