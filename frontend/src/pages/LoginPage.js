import React, {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api'; 
import '../styles/Auth.css';

const TYPING_STEPS = 7;   
const TYPING_DURATION = "1.5s"; 
const ARROW_DELAY = "1.8s";     

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const data = await loginUser(email, password); 
      if (data && data.token) { 
        localStorage.setItem('token', data.token); 
        onLogin(); 
        navigate('/home'); 
      } else {
        setError('Login failed. No token received from server.');
      }
    } catch (apiError) {
      setError(apiError.message || 'Login failed. Please check your credentials.');
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
            Log In.
          </h2>
          <div className="auth-prompt">
            <p>Welcome back.</p>            
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
          <h2 className="micro-5-regular">Log In.</h2>
          <p>Welcome back.</p>
          <Link to="/signin" className="auth-link">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <h3 className="micro-5-regular mb-4">Enter your details</h3>
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
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;