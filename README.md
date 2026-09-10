# OmniFlow Platform

OmniFlow is organized as two independent Node.js applications:

- `frontend/` contains the React/Vite customer and admin experience.
- `backend/` contains the Express API, database layer, routes, middleware, and realtime event service.

## Prerequisites

- Node.js 22 or newer
- npm

## Environment

Frontend variables belong in `frontend/.env`:

```env
VITE_API_URL=/api/v1
VITE_API_TARGET=http://localhost:5000
VITE_GEMINI_API_KEY=
```

Backend variables belong in `backend/.env`:

```env
NODE_ENV=development
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
JWT_SECRET=dev-jwt-secret-change-in-production
CSRF_SECRET=dev-csrf-secret
```

Copy the corresponding `.env.example` file to `.env` and adjust values for your environment. Do not commit `.env` files.

## Install

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Start Separately

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`. Vite proxies `/api` requests to the backend at `http://localhost:5000` during local development.

## Start Together

From the repository root, install the root helper dependency once, then run:

```bash
npm install
npm run dev
```

This starts both applications concurrently. The frontend remains on port 3000 and the backend on port 5000.

## Verification

```bash
npm run lint
npm run build
npm run backend:lint
npm run backend:build
```

The frontend calls the backend through `frontend/src/api/client.ts`; it does not import backend modules directly.
