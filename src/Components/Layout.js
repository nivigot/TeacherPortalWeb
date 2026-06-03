import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import './Layout.css';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthed = AuthService.isAuthenticated();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const showNav = isAuthed && !isAuthPage;

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="appbar">
        {!isAuthPage && (
          <div className="brand">
            <div className="brand-icon">T</div>
            Teacher Portal
          </div>
        )}

        {showNav && (
          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        )}

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {showNav && (
            <>
              <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/teacheroverview" className="nav-link" onClick={closeMenu}>
                Teacher Overview
              </NavLink>
              <button className="btn btn-danger" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          )}
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
