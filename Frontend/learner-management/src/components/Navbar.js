import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Early Intervention System</h2>
      <div>
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;