import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2>Learner Management</h2>
      <div>
        {userRole && (
          <Link to="/home" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
            Home
          </Link>
        )}
        {userRole === 'admin' && (
          <>
            <Link to="/admin-panel" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
              Admin Panel
            </Link>
            <Link to="/counselling-overview" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
              Counselling Overview
            </Link>
          </>
        )}
        {userRole === 'mentor' && (
          <Link to="/mentor-dashboard" style={{ color: '#EDEDED', textDecoration: 'none', marginLeft: '20px' }}>
            Mentor Dashboard
          </Link>
        )}
        {userRole && (
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