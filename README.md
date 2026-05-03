# Visual Workflow Automation Platform

This project is a no-code workflow platform for trading automation.

The frontend now implements these parts:

- Landing page
- Sign in and sign up screens
- Dashboard with saved workflow cards
- Workflow builder with a visual DAG canvas
- Execution tracking page

The builder frontend supports:

- Empty canvas flow that forces the user to choose the first trigger
- Two trigger types: `price` and `timer`
- Custom trigger and action nodes
- Dragging from a node into empty canvas to open an action picker
- Automatic action-node creation and edge connection
- Editing node settings from side sheets
- Saving workflows in browser local storage
- Optional backend save attempt to `http://localhost:5000/api/workflows`

What is not implemented yet:

- Real authentication
- Real dashboard API calls
- Real execution history from workers or queues
- Real exchange API integration
- Real backend-driven trigger polling or trade execution

## New backend + workers (implemented)

This repo now includes a TypeScript API + BullMQ-based workers (paper trading v1):

- `apps/api`: Express + MongoDB + JWT auth + Zod validation
- `apps/executor`: polls armed workflows and enqueues runs
- `apps/runner`: consumes runs and simulates actions via a paper broker

The existing frontend in `client/` can authenticate against the API and save workflows to it (it still keeps a local draft as a fallback).

## Environment setup (external config)

You need **MongoDB** and **Redis** running locally (or hosted), plus `.env` files for each service.

- API env: copy from `apps/api/.env.example` → `apps/api/.env`
  - `MONGODB_URI`
  - `JWT_SECRET` (must be 20+ chars)
  - `WEB_ORIGIN` should match the frontend origin (default `http://localhost:5173`)
- Executor env: copy from `apps/executor/.env.example` → `apps/executor/.env`
  - `MONGODB_URI`, `REDIS_URL`
- Runner env: copy from `apps/runner/.env.example` → `apps/runner/.env`
  - `MONGODB_URI`, `REDIS_URL`
- Web env (when using `apps/web`): copy from `apps/web/.env.example` → `apps/web/.env`
  - `VITE_API_BASE_URL` (default `http://localhost:5000`)

## Quick start (new services)

From repo root:

```bash
npm install
```

Then in separate terminals:

```bash
cd apps/api
npm run dev
```

```bash
cd apps/executor
npm run dev
```

```bash
cd apps/runner
npm run dev
```

Frontend (current):

```bash
cd client
npm run dev
```

Optional: seed supported node catalog once API is running:

```bash
curl -X POST http://localhost:5000/api/nodes/seed
```

## Prerequisites

- Node.js 20 or newer
- `npm`

## Run The Frontend

1. Open a terminal in `client`
1. Install packages:

```bash
npm install
```

1. Start the dev server:

```bash
npm run dev
```

1. Open the local URL shown by `Vite`, usually `http://localhost:5173`

## Build Check

To create a production build:

```bash
cd client
npm run build
```

## How To Test The Main Flow

1. Open `/builder`
2. Choose a starting trigger
3. Drag from the node handle into empty space
4. Pick an action from the side sheet
5. Click nodes and change their settings
6. Save the workflow
7. Open `/dashboard` and `/executions` to verify the saved data appears
