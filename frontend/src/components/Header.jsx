import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleMenuClick = (path) => {
    setIsOpen(false);
    if (path) navigate(path);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <div className="profile-avatar">
          {getInitials()}
        </div>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <h3 className="user-name">{user?.name || 'User'}</h3>
            <p className="user-email">{user?.email || 'user@example.com'}</p>
          </div>

          <div className="rating-section">
            <span className="rating-star">⭐</span>
            <span className="rating-value">4</span>
            <button className="know-more-btn" onClick={() => handleMenuClick('/profile')}>
              Know More →
            </button>
          </div>

          <div className="dropdown-items">
            <button onClick={() => handleMenuClick('/')}>Home</button>
            <button onClick={() => handleMenuClick('/my-trips')}>My Trips</button>
            <button onClick={() => handleMenuClick('/wishlist')}>Wishlist</button>
            <button onClick={() => handleMenuClick('/blog')}>Blog</button>
            <button onClick={() => handleMenuClick('/support')}>Support & Info</button>
            <button onClick={() => handleMenuClick('/settings')}>Settings</button>
            <button onClick={handleLogout} style={{ color: '#ef4444', fontWeight: '600' }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h1>Traveler App</h1>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/about">About</Link>
          <Link to="/contacts">Contact</Link>
        </nav>
      </div>
      <div className="header-right">
        {user ? (
          <ProfileDropdown />
        ) : (
          <Link to="/login" className="btn btn-login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
