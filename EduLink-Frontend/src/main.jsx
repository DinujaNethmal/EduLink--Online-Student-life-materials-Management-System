// ============================================================
// main.jsx — Application Entry Point
// ============================================================
// This is the FIRST file that runs when the React app starts.
// It renders the root component tree into the DOM element with id="root"
// (found in index.html). It wraps the app with necessary providers:
//   - StrictMode: Highlights potential problems during development
//   - BrowserRouter: Enables client-side routing (page navigation without reload)
//   - Toaster: Provides toast notifications (success/error popups)
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="bottom-right" />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
