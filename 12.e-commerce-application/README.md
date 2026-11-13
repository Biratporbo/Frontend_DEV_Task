# ApexCart - Redux Toolkit E-Commerce Application

A clean, responsive, and robust Single Page E-Commerce Application built with **React 18** and **Redux Toolkit (RTK)**. The store connects to the live **Fake Store API** with integrated fallback data resilience, managing product normalization, memoized cart calculations, custom telemetry middleware, local persistence, simulated authentication, multi-step checkout, and order histories.

---

## 🌟 Key Architecture & Highlights

### 1. Store Configuration (`configureStore`)
- Configured in `src/app/store.js` using Redux Toolkit's `configureStore()`.
- Combines slice reducers for `products`, `cart`, `auth`, and `orders`.
- Injects standard RTK middleware with custom telemetry logging and analytics event tracking.

### 2. State Slices (`createSlice`)
- **`productsSlice`**: Manages product fetching, search queries, active categories, sorting options, and detail modal selections.
- **`cartSlice`**: Handles adding products, removing items, updating quantities, applying discount coupons (`SAVE10`, `WELCOME20`), clearing the cart, and drawer visibility.
- **`authSlice`**: Tracks authentication session state (`isAuthenticated`, `user`, `token`), quick one-click demo login, credentials login, logout, and auth modal triggers.
- **`ordersSlice`**: Manages order creation, asynchronous checkout processing, checkout step workflows, order confirmation display, and order history timeline.

### 3. Asynchronous Operations (`createAsyncThunk`)
- **`fetchProducts`**: Asynchronously fetches 20 products from the Fake Store API (`https://fakestoreapi.com/products`). Automatically falls back to an embedded catalog dataset if the external API is unreachable or rate-limited.
- **`fetchProductById`**: Loads individual product entities on demand.
- **`processCheckout`**: Simulates an asynchronous 1.5-second payment authorization and order placement lifecycle with progress feedback.

### 4. Builder Callback Reducers (`extraReducers`)
- Handled via the RTK builder callback notation (`builder.addCase(...)`).
- Distinct state transitions for `pending`, `fulfilled`, and `rejected` promises across all asynchronous actions.

### 5. Normalized Entities (`createEntityAdapter`)
- Products are normalized into an entity table (`ids` array and `entities` dictionary) using `createEntityAdapter()`.
- Standardized entity operations (`setAll`, `upsertOne`) for $O(1)$ lookups and clean cache maintenance.

### 6. Memoized Selectors (`createSelector`)
- Created using `createSelector` from `@reduxjs/toolkit` to avoid unnecessary re-renders:
  - `selectCartSubtotal`: Calculates subtotal from cart items.
  - `selectCartDiscount`: Calculates dynamic percentage-based discounts based on applied coupon.
  - `selectCartTax`: Calculates 8% state sales tax.
  - `selectCartShipping`: Computes shipping (\$0 if subtotal > \$50, else \$5.99).
  - `selectCartFinalPrice`: Calculates net payable total.
  - `selectFilteredProducts`: Efficiently filters and sorts products by category, search text, and price/rating.

### 7. Custom Middleware & Telemetry
- **`actionLoggerMiddleware`**: Measures action dispatch execution duration, logging before/after state snapshots and action payloads to the browser console.
- **`analyticsMiddleware`**: Captures e-commerce events (`ecom_add_to_cart`, `ecom_coupon_applied`, `ecom_purchase_completed`, `user_authenticated`) for audit trails.

### 8. State Persistence (`localStorage`)
- Automatically saves cart items, applied coupons, user session state, and order histories to `localStorage`.
- Recovers state seamlessly upon page refreshes.

### 9. Simulated Authentication & Protected Views
- Built-in one-click **Demo Login** as customer "Alex Turner".
- Protected checkout workflow: attempting to access checkout or view past orders prompts the authentication modal.

### 10. Automated Testing Suite
- Comprehensive unit and integration tests using **Jest** and **React Testing Library** in `src/App.test.js`:
  - Cart reducer actions (add, update, remove, clear, coupon).
  - Auth reducer actions (demo login, logout).
  - Entity adapter normalization on `fetchProducts.fulfilled`.
  - Memoized financial selectors (subtotal, tax, discounts, shipping, total).
  - Asynchronous checkout completion.
  - Component integration rendering.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: React 18 (CRA / react-scripts)
- **State Management**: Redux Toolkit (RTK) 2.2.3 & React-Redux 9.1.0
- **HTTP Client**: Axios
- **Icons**: Custom lightweight SVG Icon suite
- **Testing**: Jest, `@testing-library/react`, `@testing-library/jest-dom`
- **Styling**: Modern Vanilla CSS with CSS custom properties (variables), responsive flexbox and grid

---

## 📂 Project Structure

```
12.e-commerce-application/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── hooks.js                 # Typed Redux dispatch and selector hooks
│   │   └── store.js                 # configureStore with slices and middleware
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.jsx        # Login & Demo sign-in modal
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx       # Slide-out shopping cart drawer
│   │   │   └── CartItemRow.jsx      # Individual item row with quantity stepper
│   │   ├── checkout/
│   │   │   ├── CheckoutModal.jsx    # Multi-step checkout modal (Shipping, Payment, Review)
│   │   │   └── OrderConfirmation.jsx # Purchase success receipt modal
│   │   ├── common/
│   │   │   ├── ErrorAlert.jsx       # Error card with retry button
│   │   │   ├── Footer.jsx           # Store footer with customer perks
│   │   │   ├── Icons.jsx            # Clean vector SVG icon library
│   │   │   ├── LoadingSpinner.jsx   # Async loading spinner
│   │   │   ├── Navbar.jsx           # Navigation header with search and cart badge
│   │   │   └── StarRating.jsx       # Numerical and star rating component
│   │   ├── orders/
│   │   │   └── OrderHistoryModal.jsx # Protected order history view
│   │   └── products/
│   │       ├── ProductCard.jsx      # Product listing card with image and pricing
│   │       ├── ProductDetailModal.jsx # Quick-view product details modal
│   │       ├── ProductFilters.jsx   # Filter chips, count, and sort dropdown
│   │       └── ProductList.jsx      # Responsive products grid
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js         # Authentication state slice
│   │   ├── cart/
│   │   │   ├── cartSelectors.js     # Memoized financial calculation selectors
│   │   │   └── cartSlice.js         # Cart state slice
│   │   ├── orders/
│   │   │   └── ordersSlice.js       # Orders and async checkout slice
│   │   └── products/
│   │       ├── fallbackProducts.js  # Reliable fallback dataset (20 products)
│   │       ├── productSelectors.js  # Category, filtering, and sorting selectors
│   │       └── productsSlice.js     # Normalized entity slice & async thunks
│   ├── middleware/
│   │   ├── actionLoggerMiddleware.js # Dispatch duration and action logging
│   │   └── analyticsMiddleware.js   # Commerce event tracking middleware
│   ├── styles/
│   │   ├── App.css                  # Component layout and responsive styling
│   │   └── index.css                # Global design tokens and reset
│   ├── App.js                       # Main application component
│   ├── App.test.js                  # Reducer, selector, and async flow tests
│   ├── index.js                     # Root mount with Redux Provider
│   └── setupTests.js                # Testing library configuration
├── .env                             # Port 3005 and API URL configuration
├── .gitignore                       # Git ignore rules
├── package.json                     # NPM scripts and dependencies
├── vercel.json                      # Vercel deployment rewrites
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
```bash
# Navigate to the project directory
cd 12.e-commerce-application

# Install dependencies
npm install
```

### Running the App Locally
```bash
npm start
```
The application will launch at `http://localhost:3005`.

### Running Tests
```bash
npm test -- --watchAll=false
```

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `build/` directory.

---

## 🎟️ Available Promo Codes for Testing

- **`SAVE10`**: Applies an instant 10% discount to your entire cart order.
- **`WELCOME20`**: Applies an instant 20% discount to your entire cart order.

---

## 📄 License
MIT
