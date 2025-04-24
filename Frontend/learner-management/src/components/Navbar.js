import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      // Call logout API
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to landing page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 className="navbar-title">Early Intervention System</h2>
      </Link>
      <div className="nav-links">
        {isAuthenticated && user?.role === 'admin' && (
          <>
            <Link to="/admin-dashboard" className="nav-link">
              Admin Dashboard
            </Link>
            <Link to="/admin-panel" className="nav-link">
              Admin Panel
            </Link>
            <Link to="/counselling-overview" className="nav-link">
              Counselling Overview
            </Link>
          </>
        )}
        {isAuthenticated && user?.role === 'mentor' && (
          <Link to="/mentor-dashboard" className="nav-link">
            Mentor Dashboard
          </Link>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;