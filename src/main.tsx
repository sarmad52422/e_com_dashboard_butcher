// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "../app/globals.css"; // Assuming this is your CSS file
import { Home } from "./pages/home/home.tsx";
import AdminLogin from "./pages/adminLogin/AdminLogin.tsx"; // Import AdminLogin

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Define the router
const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLogin />, // Admin login as a standalone route
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ), // Protected Home route
  },
  {
    path: "/",
    element: <Navigate to="/admin/login" replace />, // Redirect root to AdminLogin
  },
  {
    path: "/app",
    element: <App />, // Keep your App component if needed elsewhere
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
