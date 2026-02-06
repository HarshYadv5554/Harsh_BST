# BST Visualizer

A minimal and clean Binary Search Tree (BST) Visualizer web application built with React and Node.js, similar in spirit to Visualgo.

## Features

- **Interactive BST Operations:** Insert, Search, Delete nodes
- **Tree Traversals:** Inorder, Preorder, Postorder with step-by-step animations
- **Real-time Visualization:** SVG-based tree rendering with path highlighting
- **Path Animation:** Visual representation of search, insertion, and traversal paths
- **Clean UI:** Visualgo-style interface with black header, orange sidebar, and light gray canvas (TailwindCSS)

## Tech Stack

### Frontend

- React 18 with Vite
- TailwindCSS for styling
- Axios for API calls
- Pure SVG for tree visualization

### Backend

- Node.js with Express
- CORS enabled for cross-origin requests
- RESTful API design
- In-memory BST implementation

## Project Structure

```
BST Visualizer/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server with BST APIs
│   ├── bst.js             # BST data structure and operations
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TreeCanvas.jsx      # SVG tree visualization
│   │   │   ├── Controls.jsx         # UI controls and operations
│   │   │   └── TraversalPanel.jsx  # Traversal step-through panel
│   │   ├── utils/
│   │   │   └── api.js              # API client setup
│   │   ├── App.jsx                 # Main application component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles with Tailwind
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Local Development

1. **Clone/Download the project**

2. **Set up Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env   # optional
   npm start
   ```

   The backend runs at **http://localhost:5000**

3. **Set up Frontend** (in a new terminal)

   ```bash
   cd frontend
   npm install
   cp .env.example .env   # optional
   npm run dev
   ```

   The frontend runs at **http://localhost:5173**

4. **Open your browser** at **http://localhost:5173**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tree | Get current tree state |
| POST | /api/insert | Insert value(s) |
| POST | /api/search | Search for a value |
| DELETE | /api/remove | Remove value(s) |
| GET | /api/inorder | Get inorder traversal |
| GET | /api/preorder | Get preorder traversal |
| GET | /api/postorder | Get postorder traversal |
| POST | /api/clear-highlight | Clear node highlights |
| POST | /api/highlight | Highlight nodes by path |
| DELETE | /api/clear | Clear entire tree |
| GET | /api/min | Find minimum (path highlighted) |
| GET | /api/max | Find maximum (path highlighted) |
| POST | /api/predecessor | Get predecessor of value |
| POST | /api/successor | Get successor of value |
| POST | /api/select | Select k-th smallest element |
| POST | /api/create/empty | Create empty tree |
| POST | /api/create/random | Create random tree (body: `{ n }`) |
| POST | /api/create/examples | Seed with example tree |
| GET | /api/health | Health check |

## Usage

- **Create:** Use **Empty**, **Examples**, **N =** + **Random** to build a tree.
- **Insert:** Enter numbers (comma-separated) in **v =** and click **Go**.
- **Search:** Enter **v =** and use **Exact**, **lower_bound**, **Min**, or **Max**.
- **Remove:** Enter value(s) in **v =** and click **Go**.
- **Predecessor/Successor:** Enter **v =** and click **Get Predecessor** or **Get Successor**.
- **Select(k):** Enter **k =** and click **Go** for the k-th smallest element.
- **Traverse:** Click **Traverse(root)** then **Inorder(root)**, **Preorder(root)**, or **Postorder(root)**. Use the right panel arrows to step through the traversal.

## Environment Variables

**Backend (`.env`)**

- `PORT=5000`
- `CLIENT_URL=http://localhost:5173`

**Frontend (`.env`)**

- `VITE_API_BASE_URL=http://localhost:5000` (leave empty when using Vite proxy in dev)

## Deployment

- **Backend:** Deploy as a Node web service; set `PORT` and `CLIENT_URL`.
- **Frontend:** Run `npm run build` and serve the `frontend/dist` folder; set `VITE_API_BASE_URL` to your backend URL for production.
