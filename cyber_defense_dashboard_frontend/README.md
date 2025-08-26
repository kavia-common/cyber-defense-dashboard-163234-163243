# Cyber Defense Dashboard Frontend

A React (Vite) + TailwindCSS single-page application that simulates a cyber defense dashboard:
- Real-time threat alerts stream
- System health metrics
- Incidents summary and trending placeholder
- Activity logs
- Mocked authentication (login/logout)
- Responsive layout with dark/light mode
- Accessibility-minded components
- Extensible architecture designed for backend integration

## Getting Started

1) Install dependencies
   npm install

2) Configure environment (optional)
   cp .env.example .env
   # Edit variables as needed

3) Run the app
   npm run dev

4) Build for production
   npm run build
   npm run preview

## Configuration (.env)
- VITE_APP_NAME: App display name
- VITE_SIM_ALERT_INTERVAL_MS: Interval for alert simulation
- VITE_SIM_METRICS_INTERVAL_MS: Interval for metrics simulation

## Architecture
- src/main.jsx: Entry point
- src/App.jsx: Routes and global setup
- src/store/useAppStore.js: Zustand global store (theme, auth stub, alerts, metrics, incidents, activity)
- src/components/*: UI components for layout and panels
- src/pages/*: Route pages (Dashboard, Activity, Settings, Login)
- src/utils/storage.js: Local storage helpers

## Extensibility Notes
- Replace simulation intervals with WebSocket or SSE to connect to a backend.
- Per component, extract data-loading hooks to call REST endpoints.
- Keep using environment variables (VITE_*) for configuration.
- Add charts on Dashboard's trending section as a future enhancement.

## Accessibility
- Keyboard-focus styles and aria-labels on interactive elements
- Proper semantics in lists, tables, and forms

This project is a foundation for future backend/API integration.
