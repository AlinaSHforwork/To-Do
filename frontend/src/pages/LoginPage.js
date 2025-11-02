// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// You will create this service file later to handle API calls
// import { loginUser } from '../services/api'; 

function LoginPage({ onLogin }) {
  // 1. Setup State to manage form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 2. Basic Form Validation (Add more robust validation as needed)
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // 3. Call your Backend API
      //const userData = await loginUser(email, password); // Replace with your actual API call
      
      // *** MOCK SUCCESS FOR NOW ***
      const mockSuccess = true; 
      
      if (mockSuccess) { 
        // 4. Update Auth State and Redirect
        onLogin(); // Tells App.js that authentication succeeded
        navigate('/home'); // Redirects to the protected Home page
      } else {
        setError('Invalid credentials. Please try again.');
      }
      
    } catch (apiError) {
      // Handle network errors or other unexpected issues
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
            onChange={(e) => setEmail(e.target.value)} // Update state on change
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
            onChange={(e) => setPassword(e.target.value)} // Update state on change
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