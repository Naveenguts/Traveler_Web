import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Display message from navigation state (e.g., "Session expired")
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, otp: otp || undefined }),
      });

      const data = await response.json();

      if (data.requires2FA) {
        // User has 2FA enabled, show OTP field
        setRequires2FA(true);
        setError('');
      } else if (response.ok && data.success) {
        // Store token and user data in context
        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          preferences: data.user.preferences,
          token: data.token
        });
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2><span className="text-accent">User</span> Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Type here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={requires2FA}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={requires2FA}
          />
        </div>

        {requires2FA && (
          <div className="form-group">
            <label>🔐 Two-Factor Authentication Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              required
              autoFocus
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Enter the code from your authenticator app
            </p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {requires2FA && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => {
              setRequires2FA(false);
              setOtp('');
              setError('');
            }}
            style={{ marginBottom: '10px' }}
          >
            ← Back to Login
          </button>
        )}

        <button type="submit" className="btn btn-login" disabled={loading}>
          {loading ? 'Logging in...' : requires2FA ? 'Verify & Login' : 'Login'}
        </button>
        
        <p className="create-account">
          Create an account? <Link to="/signup" className="text-accent">click here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
