// frontend/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './AuthPage.css'; // Assuming you have this shared CSS

function SignupPage({ onSignup, isLoggedIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState(''); // <-- NEW state for address
  const [phone, setPhone] = useState('');     // <-- NEW state for phone
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Updated validation to include address and phone
    if (!name || !email || !password || !confirmPassword || !address || !phone) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    // Add basic phone validation if desired
    const phoneRegex = /^\+?[0-9\s-()]{7,20}$/; // Allows digits, spaces, hyphens, parens, optional +
    if (!phoneRegex.test(phone)) {
        setError('Please enter a valid phone number.');
        return;
    }


    setIsLoading(true);
    setError('');
    try {
      // Include address and phone in the object passed to onSignup
      await onSignup({ name, email, password, address, phone });
      // Navigation will happen in App.jsx after successful onSignup
    } catch (err) {
      console.error("Error during signup attempt in SignupPage:", err);
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h1 className="auth-title">Create Your Account</h1>
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name" type="text" name="name" placeholder="Your Full Name"
              value={name} onChange={(e) => setName(e.target.value)}
              required disabled={isLoading}
              className={(error && !name) ? 'input-error' : ''}
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email" type="email" name="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required disabled={isLoading}
              className={(error && !email) ? 'input-error' : ''}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" name="password" placeholder="Create a password (min. 6 characters)"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required disabled={isLoading}
              className={(error && !password) ? 'input-error' : ''}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm your password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              required disabled={isLoading}
              className={(error && (!confirmPassword || password !== confirmPassword)) ? 'input-error' : ''}
            />
          </div>

          {/* Address Input - NEW */}
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address" name="address" placeholder="Your Full Address"
              value={address} onChange={(e) => setAddress(e.target.value)}
              required disabled={isLoading} rows="3"
              className={(error && !address) ? 'input-error' : ''}
            />
          </div>

          {/* Phone Input - NEW */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone" type="tel" name="phone" placeholder="Your Phone Number"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              required disabled={isLoading}
              className={(error && !phone) ? 'input-error' : ''}
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="switch-auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;