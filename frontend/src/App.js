// src/App.js 

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import SigninPage from './pages/SigninPage'; 
import LandingPage from './pages/LandingPage';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = (token) => {
    //localStorage.setItem('token', token); 
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
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/home" element={<HomePage onLogout={handleLogout} />} />
        </Route>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLoginSuccess} />
          } 
        />
        <Route 
          path="/signin" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <SigninPage onSignup={handleLoginSuccess} />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;