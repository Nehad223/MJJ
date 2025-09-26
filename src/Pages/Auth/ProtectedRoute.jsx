import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return <Navigate to="/auth" replace />;
    return children;
  } catch (err) {
    return <Navigate to="/auth" replace />;
  }
}
