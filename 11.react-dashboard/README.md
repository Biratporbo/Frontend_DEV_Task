# OrderPulse - React Order Analytics Dashboard

An interactive single-page **Order Management Analytics Dashboard** built with **React**, **Material UI (MUI)**, and **Recharts**. Designed to monitor revenue metrics, item sales trends, customer order statuses, and recent transactions with multi-criteria filtering.

---

## 🌟 Key Features

- 📊 **Executive KPI Summary Widgets:**
  - **Revenue:** Total gross revenue across filtered non-cancelled transactions along with Average Order Value (AOV).
  - **Sales:** Total product units sold across active orders.
  - **Orders:** Real-time count of matching transactions.
  - **Customers:** Unique customer count computed dynamically from filtered records.

- 📈 **Graphical Visualizations (Recharts):**
  - **Revenue & Sales Trend (Line Chart):** Dual-axis line chart visualizing daily Revenue (`$`) and Sales (`Units`) over time with interactive tooltips.
  - **Order Status Distribution (Pie Chart):** Donut/Pie chart displaying percentage breakdowns of order statuses with click-to-filter support.

- 🚦 **Colored Status Indicators:**
  - **Completed:** Green indicator badge (`#16a34a`)
  - **Processing:** Blue indicator badge (`#2563eb`)
  - **Pending:** Amber indicator badge (`#d97706`)
  - **Cancelled:** Red indicator badge (`#dc2626`)

- 🔎 **Multi-Parameter Filtering:**
  - **Date Range:** Filter presets (`All Time`, `Last 7 Days`, `Last 30 Days`, `Last 90 Days`) plus custom Start & End Date pickers.
  - **Category:** Isolate orders across `Electronics`, `Clothing & Apparel`, `Home & Kitchen`, `Accessories`, and `Sports & Fitness`.
  - **Order Status:** Filter strictly by `Completed`, `Processing`, `Pending`, or `Cancelled`.
  - **Search Keyword:** Real-time search across Order ID, Customer Name, and Product Name.

- 📋 **Recent Orders Table & Order Details Inspector:**
  - Material UI sortable and paginated table displaying Order ID, Product Thumbnail Picture, Customer Avatar & City, Category, Date, Quantity, Amount, and Colored Status Chip.
  - Clicking any order row opens an **Order Detail Dialog** displaying product artwork, payment details, shipping destination, and an interactive status selector that dynamically updates charts and metrics.
  - One-click **Export CSV** button to download filtered order reports.

---

## 🛠️ Technology Stack

- **Framework:** React 18
- **UI Component Library:** Material UI (`@mui/material`, `@mui/icons-material`, Emotion)
- **Data Visualization:** Recharts (`LineChart`, `PieChart`, `ResponsiveContainer`)
- **Testing:** Jest & React Testing Library

---

## 📁 Project Structure

```text
11.react-dashboard/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── FilterBar.jsx             # Date range, category, status, and keyword search toolbar
│   │   ├── Header.jsx                # Top Material UI navigation bar with CSV export action
│   │   ├── KpiWidgets.jsx            # Revenue, Sales, Orders, and Customers KPI cards
│   │   ├── OrderDetailDialog.jsx     # Interactive modal displaying product photo and order details
│   │   ├── OrderStatusChart.jsx      # Recharts PieChart with status breakdown summary
│   │   ├── RecentOrdersTable.jsx     # Sortable, paginated Material UI orders table
│   │   ├── RevenueSalesChart.jsx     # Recharts dual-axis LineChart for Revenue & Sales trend
│   │   └── StatusChip.jsx            # Colored status indicator chip component
│   ├── data/
│   │   └── mockOrders.js             # Preloaded sample orders with product images and status metadata
│   ├── utils/
│   │   └── analyticsHelpers.js       # Filtering, KPI aggregation, chart transformations, CSV export
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   ├── setupTests.js
│   └── theme.js                      # Custom Material UI theme configuration
├── .env
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16.x or newer)
- **npm** or **yarn**

### Running Locally

1. Navigate into the directory:
   ```bash
   cd 11.react-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser at:
   ```
   http://localhost:3004
   ```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```
