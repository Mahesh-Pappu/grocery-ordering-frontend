// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Added Navigate for redirect if logged in
import './AuthPage.css'; // Using a shared CSS file for login and signup

function LoginPage({ onLogin, isLoggedIn }) { // Added isLoggedIn prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // onLogin is expected to be an async function passed from App.jsx
      // that handles the API call and subsequent state updates/navigation
      await onLogin({ email, password });
      // Navigation will happen in App.jsx after successful onLogin
    } catch (err) {
      // This catch is mostly a fallback if onLogin itself throws synchronously,
      // but usually App.jsx's onLogin handles API errors and sets messages.
      console.error("Error during login attempt in LoginPage:", err);
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect them
  if (isLoggedIn) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h1 className="auth-title">Login to Your Account</h1>
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={(error && !email) ? 'input-error' : ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={(error && !password) ? 'input-error' : ''}
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="switch-auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;