# 🚀 Frontend Development Tasks & Projects

A centralized repository containing frontend development projects, interactive web applications, and modular UI components built using **React 19**, modern **JavaScript (ES6+)**, and responsive **CSS3**.

Each project is designed with a focus on clean architecture, component reusability, unidirectional data flow, responsive design, and production readiness, deployed live via **Vercel**.

---

## 📑 Projects Directory

| # | Project Name | Directory | Live Demo | Core Concepts & Highlights |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Personal Portfolio** | [`/1.my-portfolio`](./1.my-portfolio) | [Live Demo 🌐](https://my-portfolio-eight-rust-78.vercel.app/) | Responsive single-page layout, modular sections, semantic HTML, modern CSS styling |
| **02** | **Student Information Portal** | [`/2.student-information`](./2.student-information) | [Live Demo 🌐](https://2student-information.vercel.app/) | Props-driven architecture, CGPA sorting, real-time search & filtering, performance tiers, image fallbacks |
| **03** | **Farm Employee Directory** | [`/3.employee-directory`](./3.employee-directory) | [Live Demo 🌐](https://3employee-directory.vercel.app) | State management (`useState`), Event handling, Conditional rendering, CRUD operations, Department filters |
| **04** | **Weather Dashboard** | [`/4.weather-dashboard`](./4.weather-dashboard) | [Live Demo 🌐](https://4weather-dashboard.vercel.app) | API Integration (`fetch`), Async/Await, `useEffect`, Error Handling, OpenWeatherMap API |

---

## 🌟 Project Overviews

### 1. [Personal Portfolio Website](./1.my-portfolio)

A clean, responsive personal portfolio website designed to showcase developer background, academic qualifications, technical skills, and contact channels in an intuitive single-page interface.

- **Live URL:** [https://my-portfolio-eight-rust-78.vercel.app/](https://my-portfolio-eight-rust-78.vercel.app/)
- **Key Features:**
  - 📱 **Mobile-First Responsive Layout:** Adapts seamlessly across mobile, tablet, and desktop viewports.
  - 🧭 **Structured Section Navigation:** Quick navigation between About, Education, Skills, and Contact sections.
  - 🧩 **Modular Component Design:** Clean separation of concerns with standalone components for each section (`Header`, `About`, `Education`, `Skills`, `Contact`, `Footer`).
  - ⚡ **Optimized Performance:** Fast load times with zero bloat and clean CSS styling.

#### Quick Run:
```bash
cd 1.my-portfolio
npm install
npm start
```

---

### 2. [Student Information Management Portal](./2.student-information)

An interactive student directory portal demonstrating advanced **React Props passing**, **state orchestration**, **unidirectional data flow**, and **data manipulation** (sorting & filtering).

- **Live URL:** [https://2student-information.vercel.app/](https://2student-information.vercel.app/)
- **Key Features:**
  - 🧱 **Hierarchical Props Flow:** Strict prop-drilling architecture from root state (`App`) down through `Header`, `StudentList`, and individual `StudentCard` components.
  - 📊 **Dynamic CGPA Sorting:**
    - High-to-Low (↓) with automated real-time rank computation (`Rank #1`, `Rank #2`, etc.).
    - Low-to-High (↑) sorting.
    - Default roster reset (↺).
  - 🔍 **Real-Time Filtering & Search:** Instant multi-field search (by student name or roll number) coupled with department dropdown filtering.
  - 🎨 **Visual Performance Indicators:** Color-coded CGPA badges and progress meters indicating performance tiers (Outstanding / Dean's List, Very Good, Good, Satisfactory).
  - 🛡️ **Graceful Fallbacks:** SVG avatar fallback mechanism for handling broken or missing profile images without layout shifts.
  - 🧪 **Unit Tested:** Comprehensive test suite validating sorting, filtering, and component rendering using Jest & React Testing Library.

#### Quick Run:
```bash
cd 2.student-information
npm install
npm start
```

---

### 3. [Farm Employee Directory](./3.employee-directory)

A practical, clean, state-driven employee directory designed for a farm management system. It showcases robust **state management (`useState`)**, **event handling**, and **conditional rendering** to manage staff across diverse agricultural departments.

- **Live URL:** [https://3employee-directory.vercel.app](https://3employee-directory.vercel.app)
- **Key Features:**
  - 🌾 **Comprehensive Farm Staff Data:** Maintains Employee Name, ID, Department, Gender, Phone Number, Local Address, and Permanent Address.
  - ➕ **Add & Edit Records:** Interactive form with input validation, duplicate ID prevention, and an option to mirror local address to permanent address.
  - 🗑️ **Delete with Confirmation:** Safe deletion workflow with browser confirmation prompts and feedback messages.
  - 🔍 **Real-time Search:** Instant search across employee names, IDs, and phone numbers.
  - 🏢 **Department Filtering:** Quick filter dropdown to isolate staff by agricultural departments or view all departments combined.
  - 📊 **Dynamic Employee Counters:** Live status counters showing total staff, matching records, and active departments.
  - 👁️ **Full Address Inspector:** Modal dialog to view complete local and permanent addresses without cluttering table rows.

#### Quick Run:
```bash
cd 3.employee-directory
npm install
npm start
```

---

### 4. [Weather Dashboard](./4.weather-dashboard)

A modern, stunning "glassmorphism" weather application demonstrating asynchronous API integration. It uses **`fetch`**, **`async/await`**, and the **`useEffect`** hook to retrieve live weather data from the OpenWeatherMap API.

- **Live URL:** [https://4weather-dashboard.vercel.app](https://4weather-dashboard.vercel.app)
- **Key Features:**
  - 🌡️ **Live Metrics:** Displays Temperature (Celsius), Humidity, Wind Speed, Sunrise, and Sunset times.
  - 🔍 **City Search:** Dynamic search bar to fetch weather for any valid city.
  - 🖼️ **Dynamic Icons:** Renders official OpenWeatherMap image icons based on current weather conditions.
  - ⏳ **Loading State:** Includes a clean CSS loading spinner during network requests.
  - 🛡️ **Error Handling:** Robust error management for invalid cities, network failures, or missing API keys.

#### Quick Run:
```bash
cd 4.weather-dashboard
npm install
npm start
```

---

## 📁 Repository Structure

```text
Frontend_DEV_Task/
├── 1.my-portfolio/                 # Project 1: Personal Portfolio
│   ├── public/                     # Public assets & HTML template
│   ├── src/
│   │   ├── components/             # Modular UI components
│   │   ├── App.css / .js
│   │   ├── index.css / .js
│   │   └── ...
│   ├── package.json
│   └── README.md
│
├── 2.student-information/          # Project 2: Student Information Portal
│   ├── public/                     # Public assets & HTML template
│   ├── src/
│   │   ├── components/             # Reusable UI components & styles
│   │   ├── data/                   # Student dataset source
│   │   ├── App.css / .js / .test.js
│   │   ├── index.css / .js
│   │   └── ...
│   ├── package.json
│   └── README.md
│
├── 3.employee-directory/           # Project 3: Farm Employee Directory
│   ├── public/                     # Public assets & HTML template
│   ├── src/
│   │   ├── components/             # Modular UI components & styles
│   │   │   ├── EmployeeDetailModal.css / .js
│   │   │   ├── EmployeeForm.css / .js
│   │   │   ├── EmployeeList.css / .js
│   │   │   ├── Navbar.css / .js
│   │   │   ├── SearchFilter.css / .js
│   │   │   └── StatsBar.css / .js
│   │   ├── data/                   # Initial farm employee records
│   │   │   └── initialEmployees.js
│   │   ├── App.css / .js / .test.js
│   │   ├── index.css / .js
│   │   └── setupTests.js
│   ├── package.json
│   └── README.md
│
└── README.md                       # Main repository README (this file)
```

---

## 🛠️ Technology Stack

- **Frontend Library:** [React 19](https://react.dev/)
- **Language:** JavaScript (ES6+ / Modern ECMAScript)
- **Styling:** CSS3 (Flexbox, CSS Grid, Custom Properties, Media Queries)
- **Tooling:** Create React App (`react-scripts`)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Hosting & CI/CD:** [Vercel](https://vercel.com/)
- **Version Control:** Git & [GitHub](https://github.com/Biratporbo/Frontend_DEV_Task)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **yarn**

### Cloning the Repository

```bash
git clone https://github.com/Biratporbo/Frontend_DEV_Task.git
cd Frontend_DEV_Task
```

### Running a Project Locally

Choose the project you wish to explore and run the following commands:

#### For Portfolio:
```bash
cd 1.my-portfolio
npm install
npm start
```
The app will launch at `http://localhost:3000`.

#### For Student Information Portal:
```bash
cd 2.student-information
npm install
npm start
```
The app will launch at `http://localhost:3000`.

#### For Farm Employee Directory:
```bash
cd 3.employee-directory
npm install
npm start
```
The app will launch at `http://localhost:3000`.

To run tests in the Farm Employee Directory:
```bash
npm test -- --watchAll=false
```

---

## 👤 Author

- **Developer:** Birat Dey
- **GitHub:** [@Biratporbo](https://github.com/Biratporbo)
- **Repository:** [Frontend_DEV_Task](https://github.com/Biratporbo/Frontend_DEV_Task)

---

## 📄 License

This repository and its projects are created for educational and frontend development assignment purposes.