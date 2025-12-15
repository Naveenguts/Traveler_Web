import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { notifications = [], markNotificationRead, markAllNotificationsRead, clearNotifications } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notification-bell" ref={bellRef}>
      <button className="bell-button" onClick={() => setIsOpen((prev) => !prev)} aria-label="Notifications">
        <svg className="bell-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3a5 5 0 0 0-5 5v3.382l-.947 1.58A1 1 0 0 0 6.885 15h10.23a1 1 0 0 0 .832-1.538L17 11.382V8a5 5 0 0 0-5-5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="panel-header">
            <span>Notifications</span>
            <div className="panel-actions">
              <button onClick={markAllNotificationsRead} disabled={notifications.length === 0}>Mark all read</button>
              <button onClick={clearNotifications} disabled={notifications.length === 0}>Clear</button>
            </div>
          </div>
          <div className="panel-list">
            {notifications.length === 0 ? (
              <p className="empty-state">No notifications yet.</p>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <div key={n.id} className={`panel-item ${n.read ? 'read' : ''}`} onClick={() => markNotificationRead(n.id)}>
                  <div className="panel-item-top">
                    <span className="item-dot" aria-hidden="true" />
                    <span className="item-message">{n.message}</span>
                  </div>
                  <span className="item-date">{new Date(n.date).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
            <button onClick={() => handleMenuClick('/blogs/write')} style={{ color: '#2563eb', fontWeight: '700' }}>
              ✍️ Write Blog
            </button>
            <button onClick={() => handleMenuClick('/blogs')}>Blog</button>
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
          <>
            <NotificationBell />
            <ProfileDropdown />
          </>
        ) : (
          <Link to="/login" className="btn btn-login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
