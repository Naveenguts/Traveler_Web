import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signing up with:', { name, email, password });
    
    // Set user data in context after signup
    login({
      name: name,
      email: email
    });
    
    // Navigate to home after successful signup
    navigate('/');
  };

  return (
    <div className="login-page">
      <h2><span className="text-accent">User</span> Sign Up</h2>
      <form className="login-form" onSubmit={handleSignUp}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Type here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit" className="btn btn-login">Create Account</button>
        
        <p className="create-account">
          Already have account? <Link to="/login" className="text-accent">click here</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;