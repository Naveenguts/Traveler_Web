import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

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
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {getInitials()}
          </div>
          <h2>{user.name || 'User'}</h2>
          <p className="profile-email">{user.email || 'user@example.com'}</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email || 'Not provided'}</span>
            </div>
          </div>

          <div className="profile-section">
            <h3>Account Details</h3>
            <div className="info-item">
              <span className="info-label">Rating:</span>
              <span className="info-value">⭐ 4</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-edit" onClick={() => navigate('/profile/edit')}>Edit Profile</button>
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
