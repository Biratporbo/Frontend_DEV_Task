# BlogVerse - Blog Application using CRUD & REST API

A modern, responsive Single Page Blog Application built with **React.js**, **Axios**, and **JSON Server**. The application enables users to create, view, update, and delete rich blog posts with text, images, and embedded video presentations, while strictly enforcing a **1,000-word content limit**.

---

## ✨ Features

- **Full CRUD REST API Integration (Axios):**
  - **Create:** Publish new articles with titles, authors, categories, cover images, video URLs, and formatted content.
  - **Read:** Browse articles in a responsive grid or read full stories in a dedicated distraction-free reader view.
  - **Update:** Pre-populated edit form to modify article metadata, content, and media embeds with instant PUT updates.
  - **Delete:** Safe delete workflow with confirmation modal preventing accidental deletions.
- **1,000-Word Content Limit Guard:**
  - Real-time live word counter badge tracking typed words against the maximum 1,000-word ceiling.
  - Visual color-coded progress meter (normal &rarr; warning at 900 words &rarr; danger at 1,000 words).
  - Client-side validation preventing submission if content exceeds 1,000 words.
- **Rich Multimedia Support (Images & Videos):**
  - **Cover Images:** Support for custom image URLs, live preview, and quick preset cover selectors.
  - **Embedded Videos:** Support for interactive YouTube and Vimeo embedded video playback within articles.
- **Keyword Search & Discovery:**
  - Instant live search querying across titles, author names, categories, tags, and article body content.
  - Topic category dropdown filter and sorting (Newest, Oldest, Title A-Z).
  - Match count indicator and one-click filter reset.
- **Error & Information Handling:**
  - Animated loading spinner while fetching articles from the REST API.
  - Clear error message banner when API requests fail, equipped with an interactive **"Retry Request"** button.
  - Context-aware empty state messages when no articles are published or no search results match.
- **Resilient Fallback Storage:**
  - Built-in failover to cached local storage ensuring seamless operation on static deployments (e.g., Vercel) even when local JSON Server is offline.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **HTTP Client:** Axios (`axios`)
- **Mock REST API:** JSON Server (`json-server`)
- **Process Orchestration:** Concurrently (`concurrently`)
- **Styling:** Modular CSS3 with Custom Design Tokens & Mobile-First Flexbox/Grid
- **Testing:** Jest & React Testing Library

---

## 📁 Project Structure

```
9.blog-application/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── BlogCard.jsx
│   │   ├── BlogDetail.jsx
│   │   ├── BlogForm.jsx
│   │   ├── BlogList.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Header.jsx
│   │   ├── Icons.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Toast.jsx
│   ├── data/
│   │   ├── categories.js
│   │   ├── initialBlogs.json
│   │   └── presetCovers.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── videoHelper.js
│   │   └── wordCounter.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── setupTests.js
├── .env
├── .gitignore
├── db.json
├── package.json
├── vercel.json
└── README.md
```

---

## 💻 Getting Started

### 1. Navigate to the project directory
```bash
cd 9.blog-application
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run both REST API server and React frontend simultaneously
```bash
npm run dev
```
- **React Application:** [http://localhost:3002](http://localhost:3002)
- **JSON Server REST API:** [http://localhost:5000/blogs](http://localhost:5000/blogs)

*Alternatively, you can run the mock API server and React app in separate terminals:*
```bash
# Terminal 1: Run JSON Server REST API
npm run server

# Terminal 2: Run React Client
npm start
```

### 4. Run tests
```bash
npm test -- --watchAll=false
```

### 5. Build for production
```bash
npm run build
```
