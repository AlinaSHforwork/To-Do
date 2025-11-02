// src/App.js (Key changes for Auth persistence and Logout)

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import SigninPage from './pages/SigninPage'; 

function App() {
  // Check for the token in localStorage on component mount
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') // Sets true if token exists, false otherwise
  );
  
  const handleLoginSuccess = (token) => {
    // In your LoginPage/SigninPage, make sure to pass the token here: onLogin(response.token)
    localStorage.setItem('token', token); 
    setIsAuthenticated(true);
  };
  
  // 🔑 LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('token'); // 1. Remove the token
    setIsAuthenticated(false);       // 2. Update state to false
    // The ProtectedRoute logic will automatically redirect the user to /login
  };

  return (
    <Router>
      <Routes>
        
        {/* Pass handleLogout to the HomePage so it can be used inside */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/home" element={<HomePage onLogout={handleLogout} />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* LoginPage and SigninPage should receive handleLoginSuccess and the actual token */}
        <Route path="/login" element={<LoginPage onLogin={handleLoginSuccess} />} />
        <Route path="/signin" element={<SigninPage onSignup={handleLoginSuccess} />} />

      </Routes>
    </Router>
  );
}

export default App;