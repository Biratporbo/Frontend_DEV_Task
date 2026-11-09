# CineSearch - Movie Search Application

A responsive Single Page Application (SPA) built with **React**, **OMDb API**, **Debounced Search Optimization**, and **LocalStorage** that allows users to search movies, inspect detailed cinematic metadata, explore critical ratings, view high-resolution posters, navigate pages, and curate a personal watchlist of favorites.

---

## 🌟 Key Features

- 🔍 **Debounced Movie Search:**
  - Real-time debounced search input (500ms delay) that optimizes network consumption and prevents rate-limiting.
  - Multi-parameter filtering by media type (`All Types`, `Movies`, `TV Series`, `Episodes`) and release year.
  - Quick trending search chips for popular titles (`Batman`, `Inception`, `Avengers`, `Interstellar`, `Spider-Man`, `Matrix`).
  - Search query caching to eliminate duplicate API requests.

- 🎬 **Comprehensive Movie Details Modal:**
  - Full title information, release year, age certification (`Rated`), runtime, and genre pills.
  - Complete plot synopsis and storyline breakdown.
  - Director, writers, cast/stars, awards, box office gross, spoken languages, and countries of origin.
  - Direct external link to the title's official IMDb page.
  - Keyboard accessible (`Esc` key to close, focus trapping).

- 🍅 **Multi-Source Ratings & Critical Reception:**
  - Prominent IMDb star rating with total votes counter.
  - Rotten Tomatoes critical approval percentage badge.
  - Metacritic metascore breakdown.

- 🖼️ **High-Resolution Poster & Fallback Architecture:**
  - Responsive poster presentation with smooth zoom animations on card hover.
  - Graceful fallback SVG film reel placeholder when poster art is unavailable (`N/A`) or blocked.

- 📄 **Dynamic Pagination:**
  - Numbered page controls with smart ellipsis (`...`) for large result catalogs.
  - Total titles counter and smooth auto-scroll to the top of the search catalog on page transitions.

- ❤️ **Persistent Favorites / Watchlist:**
  - One-click heart toggle to add or remove any movie from favorites directly on cards or inside the details modal.
  - Synchronized with browser `localStorage` (`cinesearch_favorites_v1`).
  - Dedicated Favorites view with in-watchlist search and multi-criteria sorting (Recently Added, Title A-Z, Year Newest/Oldest).
  - Clear all favorites with confirmation dialog.

- 🛡️ **Offline Resilience & API Management:**
  - Curated offline fallback dataset for top cinematic masterpieces in case of rate limits or offline use.
  - Built-in API Key modal allowing users to supply their personal OMDb key or reset to default.

---

## 🛠️ Technology Stack

- **Framework:** React 18 (Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`)
- **HTTP Client:** Axios (with timeout handling and caching)
- **API:** OMDb API (`https://www.omdbapi.com/`)
- **Search Optimization:** Custom `useDebounce` hook + in-memory Map cache
- **Persistence:** Browser `localStorage`
- **Styling:** CSS3 variables, responsive grid, flexbox, modern glassmorphism navbar
- **Testing:** Jest & React Testing Library

---

## 📁 Project Structure

```text
10.movie-search-application/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── src/
│   ├── api/
│   │   ├── fallbackData.js          # Curated offline dataset with rich details
│   │   └── omdbApi.js               # Axios client, caching, and key management
│   ├── components/
│   │   ├── ApiKeyModal.jsx          # User API key settings dialog
│   │   ├── FavoritesView.jsx        # Dedicated favorites catalog & sorting
│   │   ├── Icons.jsx                # Lightweight SVG icon collection
│   │   ├── LoadingSpinner.jsx       # Film reel rotation spinner
│   │   ├── MovieCard.jsx            # Individual card with poster, rating, and favorite toggle
│   │   ├── MovieDetailModal.jsx     # Full movie inspector with ratings breakdown
│   │   ├── MovieGrid.jsx            # Grid wrapper with empty/error/featured banners
│   │   ├── Navbar.jsx               # Header with brand logo, tabs, and favorites badge
│   │   ├── Pagination.jsx           # Previous/Next and numbered page controls
│   │   └── SearchBar.jsx            # Debounced search bar with type/year filters & chips
│   ├── hooks/
│   │   └── useDebounce.js           # Reusable debouncing hook (500ms)
│   ├── styles/
│   │   ├── App.css                  # Component styling, modal animations, grid layout
│   │   └── index.css                # Global CSS reset, typography, and design tokens
│   ├── App.js                       # Root component orchestrating search, favorites, and modals
│   ├── App.test.js                  # Unit tests for rendering, search, and navigation
│   ├── index.js                     # React 18 entry point
│   └── setupTests.js                # Testing library configuration
├── .env                             # Port and default API key configuration
├── .gitignore
├── package.json
├── vercel.json                      # Single page application routing rewrites
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16.x or newer)
- **npm** or **yarn**

### Installation

1. Navigate to the project directory:
   ```bash
   cd 10.movie-search-application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3003
   ```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```
