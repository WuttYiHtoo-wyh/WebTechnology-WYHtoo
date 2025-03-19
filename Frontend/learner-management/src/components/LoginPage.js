import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // New state for role selection

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check credentials and role
    if (username === '' || password === '' || selectedRole === '') {
      alert('Please fill in all fields, including role.');
      return;
    }
    if (password !== '123') {
      alert('Invalid password. Please try again.');
      return;
    }
    // Set role and redirect based on selected role
    localStorage.setItem('role', selectedRole);
    alert('Login successful!');
    if (selectedRole === 'admin') {
      navigate('/home');
    } else if (selectedRole === 'mentor') {
      navigate('/mentor-dashboard');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <div className="form-container" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '30px' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Role:
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '20px', backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px', color: '#1F2526' }}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="mentor">Mentor</option>
            </select>
          </label>
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