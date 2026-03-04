import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar glass-card">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <Zap size={28} className="logo-icon" fill="#7c3bed" color="#7c3bed" />
                    <span className="logo-text">Subscribly</span>
                </Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-item">
                                <LayoutDashboard size={20} />
                                <span>Dashboard</span>
                            </Link>
                            <div className="nav-profile">
                                <User size={20} />
                                <span>{user.name}</span>
                            </div>
                            <button onClick={logout} className="nav-logout-btn">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-btn-secondary">Login</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </div>

            <style jsx="true">{`
        .navbar {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1200px;
          padding: 12px 24px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
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
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
        }
        .logo-icon {
          filter: drop-shadow(0 0 8px var(--primary));
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .nav-item:hover {
          color: var(--primary);
        }
        .nav-btn-secondary {
          color: white;
          font-weight: 600;
        }
        .nav-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--border-glass);
        }
        .nav-logout-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.3s;
        }
        .nav-logout-btn:hover {
          color: #ef4444;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
