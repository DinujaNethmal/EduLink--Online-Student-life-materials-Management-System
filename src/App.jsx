import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Login page will be implemented next */}
        <Route path="/login" element={<div />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

