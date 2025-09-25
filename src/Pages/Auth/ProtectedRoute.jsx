// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  try {
    
    const isAuth = sessionStorage.getItem("isAuth") === "true";
    if (!isAuth) return <Navigate to="/auth" replace />;
    return children;
  } catch (err) {
    return <Navigate to="/auth" replace />;
  }
}
