import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute1({ children }) {
  // Use your real auth logic, e.g., token or userDetails
  const isAuthenticated = !!localStorage.getItem('lawyerDetails');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
