# Mini Blog - Rafael Companhoni

Live version: [Mini Blog](https://frontend-production-c823.up.railway.app)

Mini Blog is a full-stack blogging platform that supports user registration and authentication, CRUD operations for posts and comments, real-time updates using Supabase, and client-side data management with TanStack Query. The project consists of a frontend built with React (Vite) and a backend API developed with Express and Supabase, both using TypeScript.

## Prerequisites

- Node.js + npm
- Supabase account (with API URL and anon key)

## How to Run Locally

### Set Up Environment Variables

Create the following `.env` files:

**Backend** (`backend/.env`):

```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=<SUPABASE_API_URL>
SUPABASE_KEY=<SUPABASE_ANON_KEY> # Required for RLS to apply to API SDK requests
```

**Frontend** (`frontend/.env`):

```env
VITE_MINI_BLOG_API_URL=http://localhost:3000/api
VITE_SUPABASE_API_URL=<SUPABASE_API_URL>
VITE_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
```

### Run the Backend

In a terminal, navigate to the `backend` folder, install dependencies, and start the server:

```bash
npm install
npm run start:dev
```

### Run the Frontend

In another terminal, navigate to the `frontend` folder, install dependencies, and start the client:

```bash
npm install
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`, and the API will be running at `http://localhost:3000`.

To run tests for both projects, use `npm test`.

## Backend Overview

### Project Structure

```plaintext
backend/
├── src/
│   ├── config/                 # Configuration files (e.g., dotenv, CORS)
│   ├── controllers/            # API controllers for posts and comments
│   │   ├── comments/           # Controller logic for comments
│   │   └── posts/              # Controller logic for posts
│   ├── middlewares/            # Middleware (e.g., authentication)
│   ├── repositories/           # Data access layer for database interactions
│   │   ├── comments/           # Comment repository files and types
│   │   └── posts/              # Post repository files and types
│   ├── routes/                 # Route definitions for posts and comments
│   └── index.ts                # Server entry point
└── .env                        # Environment variables for backend
```

### Features

- MVC architecture (controllers and repositories)
- RESTful API with endpoints for posts and comments
- CRUD operations for posts and comments
- Zod validation for request data
- Row Level Security (RLS) policies on Supabase for data access control
- Unit tests for controllers and repositories

## Frontend Overview

### Project Structure

```plaintext
frontend/
├── src/
│   ├── assets/                 # Static assets (e.g., images)
│   ├── components/             # Shared components (e.g., Layout, Footer)
│   ├── context/                # Context providers (e.g., AuthContext)
│   ├── features/               # Feature-based structure for posts and comments
│   │   ├── comments/           # Components and hooks related to comments
│   │   │   ├── components/     # Components specific to comments (e.g., CommentList)
│   │   │   ├── hooks/          # Hooks for comments (e.g., useComments)
│   │   │   └── types.ts        # Type definitions for comments
│   │   └── posts/              # Components and hooks related to posts
│   │       ├── components/     # Components specific to posts (e.g., PostList)
│   │       ├── hooks/          # Hooks for posts (e.g., usePosts)
│   │       └── types.ts        # Type definitions for posts
│   ├── pages/                  # Page components (e.g., Home, PostDetails, PostEditor)
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Routes
│   ├── main.tsx                # Application entry point (TanStack provider)
└── .env                        # Environment variables for frontend
```

### Features

- User authentication with Supabase
- CRUD operations for posts and comments
- Search functionality for posts by title and content
- Pagination for posts
- Real-time updates for comments using Supabase subscriptions
- Responsive design using Tailwind CSS
- Unit tests with Jest and RTL for the Home component as a demonstration
