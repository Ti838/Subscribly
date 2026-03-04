import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Zap, LogOut, LayoutDashboard, User, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar glass-card">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Zap size={24} className="logo-icon" fill="var(--primary)" color="var(--primary)" />
          <span className="logo-text">Subscribly</span>
        </Link>

        <div className="nav-links">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-item">
                <LayoutDashboard size={18} />
                <span className="hide-mobile">Dashboard</span>
              </Link>
              <div className="nav-profile hide-mobile">
                <User size={18} />
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={logout} className="nav-logout-btn">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-subtle">Login</Link>
              <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .navbar {
          position: fixed;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 95%;
          max-width: 1000px;
          padding: 8px 16px;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .logo-icon {
          filter: drop-shadow(0 0 5px var(--primary-glow));
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .theme-toggle {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .theme-toggle:hover {
          transform: rotate(15deg);
          color: var(--primary);
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .nav-item:hover {
          color: var(--primary);
        }
        .nav-link-subtle {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .nav-link-subtle:hover {
          color: var(--text-main);
        }
        .nav-profile {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-glass);
          padding: 4px 10px;
          border-radius: 30px;
          border: 1px solid var(--border-glass);
          font-size: 0.85rem;
          color: var(--text-main);
          font-weight: 500;
        }
        .btn-sm {
          padding: 8px 16px;
          font-size: 0.85rem;
          border-radius: 10px;
        }
        .nav-logout-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
        }
        .nav-logout-btn:hover {
          color: #ef4444;
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
