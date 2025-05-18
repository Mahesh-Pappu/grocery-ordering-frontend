// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

function Header({ cartItemCount, isLoggedIn, onLogout, userName }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">FreshGrocer</Link>
        </div>
        <nav className="navigation">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {/* Only show "My Orders" if logged in */}
            {isLoggedIn && (
                <li><Link to="/my-orders">My Orders</Link></li>
            )}
          </ul>
        </nav>
        <div className="user-actions">
          <Link to="/cart" className="nav-icon-link">
            🛒 
            <span className="ml-1">Cart</span> 
            ({cartItemCount > 0 ? cartItemCount : 0})
          </Link>
          {isLoggedIn ? (
            <>
              {userName && <span className="nav-link hidden sm:inline">Hi, {userName.split(" ")[0]}!</span>}
              <button onClick={onLogout} className="auth-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-button">
                Login
              </Link>
              <Link to="/signup" className="auth-button signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;