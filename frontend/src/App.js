// src/App.js 

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import SigninPage from './pages/SigninPage'; 
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') 
  );
  
  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token); 
    setIsAuthenticated(true);
  };
  
  // 🔑 LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);      
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