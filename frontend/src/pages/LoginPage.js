// src/pages/LoginPage.js (FIXED: Real API Call)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { loginUser } from '../services/api'; 

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
      const data = await loginUser(email, password); 
                 
      // 4. On Success: Save Token, Update Auth State, and Redirect
      if (data.token) { 
        localStorage.setItem('token', data.token); // Save the token for future requests
        onLogin();
        navigate('/home'); 
      } else {
        // This is a safety net, but the API should throw an error before this.
        setError('Login failed. No token received.');
      }
      
    } catch (apiError) {
      // This handles errors thrown by loginUser (e.g., 401 Invalid credentials, or network errors)
      setError(apiError.message || 'An error occurred during login. Please check your network.');
      console.error("Login API Error:", apiError);
    }
  };

  return (
    <Row>
    <Col className="containerLog md={{ span: 12, offset: 3 }}" >
      <h2 className="text-center micro-5-regular mb-4">Log In</h2>
      
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
        Don't have an account? <Link to="/signin" className="btn btn-primary">Sign Up</Link>
      </p>
    </Col>
    </Row>
  );
}

export default LoginPage;