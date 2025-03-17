import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand text-light" to="/">Student Early Intervention</Link>
                <Link className="btn btn-outline-light" to="/">Back to Dashboard</Link>
            </div>
        </nav>
    );
}

export default Navbar;