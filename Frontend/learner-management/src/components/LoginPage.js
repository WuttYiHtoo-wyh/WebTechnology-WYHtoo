import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Credentials: username=admin, password=123
    if (username === 'admin' && password === '123') {
     
      navigate('/home');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <div className="form-container" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '30px' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username or Email:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username or email"
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </label>
          <button type="submit" className="btn-primary" style={{ marginTop: '30px', width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;