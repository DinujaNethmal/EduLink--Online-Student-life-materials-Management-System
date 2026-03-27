// ============================================================
// vite.config.js — Vite Build Tool Configuration
// ============================================================
// Vite is the development server and build tool for this React app.
// This config:
//   1. Enables the React plugin (JSX support, fast refresh)
//   2. Sets up a proxy so frontend API calls (/api/*) are forwarded
//      to the Express backend running on port 5000
// ============================================================

import { defineConfig } from 'vite'   // Vite's config helper (provides type hints)
import react from '@vitejs/plugin-react' // Official React plugin for Vite

export default defineConfig({
  // Register the React plugin — enables JSX transformation and React Fast Refresh
  plugins: [react()],

  // Development server settings
  server: {
    // Proxy configuration — solves the CORS problem during development
    // When the frontend makes a request to "/api/...", Vite forwards it
    // to http://localhost:5000/api/... (where our Express backend runs)
    // This means the frontend and backend appear to be on the same origin
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server URL
        changeOrigin: true,              // Changes the origin header to match the target
      },
    },
  },
})
