// src/pages/SigninPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api'; // Import the new function

function SigninPage({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // (Add more robust client-side validation here if necessary)

    try {
      // 1. CALL THE REGISTRATION API
      const userData = await registerUser(email, password); 
      
      // 2. Handle successful registration (often, successful sign-up auto-logs the user in)
      // Example: localStorage.setItem('token', userData.token); 
      
      // 3. Update Auth State and Redirect
      onSignup(); // Tells App.js that authentication succeeded
      navigate('/home'); // Redirects to the protected Home page
      
    } catch (apiError) {
      // 4. Handle errors (e.g., "User already exists")
      setError(apiError.message || 'Sign up failed. Please try a different email.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Create Account</h2>
      
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

        <button type="submit" className="btn btn-success w-100">
          Sign Up
        </button>
      </form>
      
      {/* Link back to Login page */}
      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}

export default SigninPage;