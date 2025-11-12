import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple mock validation
    if (email === 'user@example.com' && password === 'password123') {
      // Set user data in context
      login({
        name: 'Naveen Kumar S',
        email: email
      });
      navigate('/');
    } else {
      setError('Invalid email or password');
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
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-login">Login</button>
        
        <p className="create-account">
          Create an account? <Link to="/signup" className="text-accent">click here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
