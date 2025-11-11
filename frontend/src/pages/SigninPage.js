import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../styles/Auth.css';

const TYPING_STEPS = 15;   
const TYPING_DURATION = "2.5s"; 
const ARROW_DELAY = "2.8s";     

function SigninPage({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await registerUser(email, password); 
      if (userData.token) { 
          localStorage.setItem('token', userData.token); 
      }
      onSignup(); 
      navigate('/home');
    } catch (apiError) {
      setError(apiError.message || 'Sign up failed. Please try a different email.');
    }
  };

  const handleArrowClick = () => {
    setIsTransitionActive(true);
  };

  return (
    <div className={`auth-container ${isTransitionActive ? 'is-active' : ''}`}>
      
      <div className="auth-panel">

        <div className="auth-intro-content">
          <h2 
            className="typing-effect-panel"
            style={{
              '--typing-steps': TYPING_STEPS,
              '--typing-width': `${TYPING_STEPS}ch`,
              '--typing-duration': TYPING_DURATION
            }}
          >
            Create Account.
          </h2>
          <div className="auth-prompt">
            <p>Get started and plan your day.</p>
            
          </div>
          <div 
              className="arrow-panel"
              style={{ '--arrow-delay': ARROW_DELAY }}
              onClick={handleArrowClick}
            >
              →
            </div>
        </div>

        <div className="auth-static-content">
          <h2 className="micro-5-regular">Create Account.</h2>
          <p>Get started and plan your day.</p>
          <Link to="/login" className="auth-link">
            Already have an account? Log In
          </Link>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <h3 className="micro-5-regular mb-4">Sign up for free</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">Password</label>
              <input type="password" className="form-control" id="passwordInput" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn auth-btn w-100 mt-3">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;