// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, logout } = useAuth(); // Use AuthContext

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <h2>Learner Management</h2>
      <div>
        {isAuthenticated && (
          <Link to="/home" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
            Home
          </Link>
        )}
        {isAuthenticated && userRole === 'admin' && (
          <>
            <Link to="/admin-panel" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
              Admin Panel
            </Link>
            <Link to="/counselling-overview" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
              Counselling Overview
            </Link>
          </>
        )}
        {isAuthenticated && userRole === 'mentor' && (
          <Link to="/mentor-dashboard" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
            Mentor Dashboard
          </Link>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              color: '#EDEDED',
              cursor: 'pointer',
              marginLeft: '20px',
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;