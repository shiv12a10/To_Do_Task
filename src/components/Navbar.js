import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          Todo Manager
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/add-task" className="nav-link">Add Task</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
