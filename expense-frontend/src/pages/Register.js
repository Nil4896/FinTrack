// src/pages/Register.js

// --- 1. ADD MISSING IMPORTS ---
import React, { useState } from 'react'; // Added React and useState
import { useNavigate, Link } from 'react-router-dom'; // Added useNavigate and Link
import { useAuth } from '../utils/auth'; // Added useAuth
import { api, setAuthToken } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // These were missing from your import list
  const { setToken } = useAuth(); 
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // --- 2. CORRECTED SUBMIT LOGIC ---
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // The register route does not return a token
      await api.post('/auth/register', { name, email, password });
      
      // On success, redirect to the login page
      alert('Registration successful! Please log in.');
      navigate('/login');

    } catch (err) {
      // Use 'message', not 'msg' (see error #5 below)
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
  <div className="register-page">
    <div className="register-card">
      <h2>Register</h2>
      <p className="subtitle">Create your FinTrack account</p>

      <form onSubmit={onSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
      </form>

      <div className="register-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  </div>
);

}