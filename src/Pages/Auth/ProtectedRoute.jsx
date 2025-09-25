// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  try {
    const isAuth = localStorage.getItem("isAuth");
    return isAuth === "true" ? children : <Navigate to="/auth" replace />;
  } catch (err) {
    return <Navigate to="/auth" replace />;
  }
}
