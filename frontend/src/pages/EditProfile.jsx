import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    updateUser({ name: name.trim(), email: email.trim() });
    navigate('/profile');
  };

  return (
    <div className="login-page">
      <h2><span className="text-accent">Edit</span> Profile</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-login">Save Changes</button>
        <button type="button" className="btn" style={{marginLeft: '0'}} onClick={() => navigate('/profile')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
