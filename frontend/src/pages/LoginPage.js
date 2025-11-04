// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    // 2. Basic Form Validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // 3. Call your Backend API
           
      // *** MOCK SUCCESS FOR NOW ***
      const mockSuccess = true; 
      
      if (mockSuccess) { 
        // 4. Update Auth State and Redirect
        onLogin();
        navigate('/home'); 
      } else {
        setError('Invalid credentials. Please try again.');
      }
      
    } catch (apiError) {
      setError('An error occurred during login. Please check your network.');
      console.error("Login API Error:", apiError);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Log In</h2>
      
      {/* Display Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* Email Input */}
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email address</label>
          <input 
            type="email" 
            className="form-control" 
            id="emailInput" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="passwordInput" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Log In
        </button>
      </form>
      
      {/* Link to Sign-up page */}
      <p className="text-center mt-3">
        Don't have an account? <Link to="/signin">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;