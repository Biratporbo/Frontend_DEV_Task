# SpendWise - Responsive Expense Tracker SPA

A clean, responsive Single Page Application (SPA) built with **React** to record, manage, categorize, search, filter, and visually analyze personal income and expenses. The application includes controlled forms with instant input validation, local storage persistence, CSV data export, interactive SVG analytics charts (Pie, Bar, Line), and product picture / receipt attachment previews.

---

## ✨ Features

- **Record Income & Expenses:**
  - Controlled form inputs with validation for Title, Amount, Category, Date, Payment Method, Product Picture, and Notes.
  - One-click toggle between Expense (-) and Income (+) modes.
  - Inline error feedback and touched state indicators.
- **Product & Receipt Picture Attachments:**
  - Attach item photos or receipts via device file upload (Base64), quick preset product photos (Groceries, Coffee, Electronics, Footwear, Dining, etc.), or image URLs.
  - Interactive thumbnail preview directly in the transaction list.
  - Dedicated Receipt / Product Inspector modal with full resolution view and transaction details.
- **Monthly Summary Cards:**
  - Real-time calculations of Net Balance, Total Income, Total Expenses, and Net Savings Rate.
  - Dynamic monthly selector to isolate metrics by specific month or view all-time totals.
- **Data Filtering, Search & Sorting:**
  - Instant live search across transaction titles, categories, notes, and payment methods.
  - Multi-category dropdown filter.
  - Transaction type filter (All, Expenses Only, Income Only).
  - Sorting by Newest Date, Oldest Date, Highest Amount, Lowest Amount, or Title.
  - One-click reset for active filters.
- **Visual Analytics & Trend Charts:**
  - **Pie / Donut Chart:** Interactive expense distribution by category with percentage calculations, hover tooltips, and color-coded legend.
  - **Bar Chart:** Monthly trend comparison displaying side-by-side Income vs Expenses with dynamic grid scaling.
  - **Line Chart:** Per-day expense trend curve displaying daily spending fluctuations with area gradient shading and data point tooltips.
  - Interactive tabs to switch between all charts or specific chart views.
- **Delete & Edit Transactions:**
  - Edit existing transactions with pre-populated form state.
  - Safe delete confirmation dialog to prevent accidental deletion.
- **CSV Data Export:**
  - Download formatted reports (`expenses_report_YYYY-MM-DD.csv`) containing transaction IDs, dates, types, titles, categories, amounts, payment methods, and notes.
- **LocalStorage Data Persistence:**
  - Automatically loads and persists all transactions to `localStorage`.
  - Includes preloaded realistic sample data and a "Sample Data" restore button.

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Styling:** Modular CSS3 with Custom Properties (Design Tokens), Flexbox, and CSS Grid
- **Charts:** Custom Interactive SVG Charts (Pie, Bar, Line) with zero third-party chart dependencies
- **Persistence:** Browser `localStorage` API
- **Export:** Native Client-side CSV Blob Generator

---

## 📁 Project Structure

```
8.expense-tracker/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Charts/
│   │   │   ├── BarChart.jsx
│   │   │   ├── ChartsSection.jsx
│   │   │   ├── LineChart.jsx
│   │   │   └── PieChart.jsx
│   │   ├── Modals/
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   └── ImagePreviewModal.jsx
│   │   ├── FilterToolbar.jsx
│   │   ├── Header.jsx
│   │   ├── Icons.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionItem.jsx
│   │   └── TransactionList.jsx
│   ├── data/
│   │   ├── categories.js
│   │   ├── initialData.js
│   │   └── presetImages.js
│   ├── utils/
│   │   ├── csvExport.js
│   │   ├── formatters.js
│   │   └── storage.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── setupTests.js
├── .env
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## 💻 Getting Started

### 1. Navigate to the project directory
```bash
cd 8.expense-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm start
```
The application will launch at [http://localhost:3000](http://localhost:3000).

### 4. Build for production
```bash
npm run build
```

