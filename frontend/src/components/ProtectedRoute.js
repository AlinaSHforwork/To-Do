// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component accepts the element (e.g., HomePage) and the auth status
function ProtectedRoute({ isAuthenticated }) {
  // If the user is authenticated, render the child route (Outlet renders the Route's element)
  if (isAuthenticated) {
    return <Outlet />;
  } 
  
  // If not authenticated, redirect them to the Login page
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;