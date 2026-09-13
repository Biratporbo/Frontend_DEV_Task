import React from 'react';
import './Navbar.css';

function Navbar({ isFormOpen, onToggleForm }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-icon">🌾</span>
          <div>
            <h1 className="navbar-title">GreenField Farm</h1>
            <p className="navbar-subtitle">Employee Information Directory</p>
          </div>
        </div>

        <button
          className={`btn-toggle-form ${isFormOpen ? 'btn-cancel' : 'btn-add'}`}
          onClick={onToggleForm}
        >
          {isFormOpen ? '✕ Close Form' : '+ Add New Employee'}
        </button>
      </div>
    </header>
  );
}

export default Navbar;

