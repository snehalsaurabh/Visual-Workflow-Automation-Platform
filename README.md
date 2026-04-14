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

## Prerequisites

- Node.js 20 or newer
- npm

## Run The Frontend

1. Open a terminal in `client`
2. Install packages:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the local URL shown by Vite, usually `http://localhost:5173`

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
