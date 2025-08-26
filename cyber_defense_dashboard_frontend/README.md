# Cyber Defense Dashboard Frontend

A React (Vite) + TailwindCSS SPA providing a foundational cyber defense dashboard with:
- Real-time (simulated) threat alert streaming
- System health/status panels
- Top incidents summary and trending attacks
- Activity log with CSV export
- Authentication stub (login/logout, role placeholder)
- Responsive layout & accessible components
- Dark/Light theme toggle
- Extensible, modular structure ready for backend integration

## Quick start

- Install dependencies: npm install
- Start dev server: npm run dev
- Build for production: npm run build
- Preview production build: npm run preview

## Structure

- src/context: Theme and Auth providers
- src/store: Zustand store with simulated data generators
- src/components: Reusable UI components
- src/components/layout: App shell (Header/Sidebar/Footer)
- src/pages: Route components (Dashboard, Incidents, Activity, Settings, Login)

## Notes

- All data is simulated client-side for this initial release.
- For future backend integration, adapt the store actions to fetch from APIs.
- Theme preference is persisted to localStorage. Authentication is a stub using localStorage.

