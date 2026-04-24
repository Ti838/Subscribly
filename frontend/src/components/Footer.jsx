import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Mail, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <motion.div
        className="footer-card glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="footer-brand">
          <div className="brand-lockup">
            <Zap size={22} fill="var(--primary)" color="var(--primary)" />
            <span>Subscribly</span>
          </div>
          <p>
            Subscription infrastructure for products that need polished billing, API access, and usage control.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <Link to="/#features">Features</Link>
            <Link to="/#pricing">Pricing</Link>
            <Link to="/docs">Docs</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Get Started</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:hello@subscribly.io">hello@subscribly.io</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://subscribly.io" target="_blank" rel="noreferrer">Website</a>
          </div>
        </div>

        <motion.a
          href="/register"
          className="footer-cta"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Launch your stack <ArrowRight size={18} />
        </motion.a>
      </motion.div>

      <div className="footer-meta">
        <span>© 2026 Subscribly. Built for modern SaaS teams.</span>
        <div>
          <a href="mailto:hello@subscribly.io"><Mail size={14} /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer"><Github size={14} /></a>
        </div>
      </div>

      <style jsx="true">{`
        .site-footer {
          padding: 24px 20px 48px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .footer-card {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto;
          gap: 28px;
          padding: 32px;
          align-items: center;
        }
        .footer-brand p {
          margin-top: 14px;
          color: var(--text-muted);
          max-width: 460px;
        }
        .brand-lockup {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          font-weight: 800;
        }
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }
        .footer-links h4 {
          margin-bottom: 12px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-dim);
        }
        .footer-links a {
          display: block;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .footer-links a:hover {
          color: var(--text-main);
        }
        .footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--primary), #6366f1);
          color: white;
          font-weight: 700;
          justify-self: end;
          box-shadow: 0 12px 30px rgba(124, 59, 237, 0.28);
        }
        .footer-meta {
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: var(--text-dim);
          font-size: 0.85rem;
        }
        .footer-meta div {
          display: flex;
          gap: 14px;
        }
        .footer-meta a {
          color: var(--text-dim);
        }
        .footer-meta a:hover {
          color: var(--text-main);
        }
        @media (max-width: 900px) {
          .footer-card {
            grid-template-columns: 1fr;
          }
          .footer-cta {
            justify-self: start;
          }
        }
        @media (max-width: 640px) {
          .footer-links {
            grid-template-columns: 1fr;
          }
          .footer-meta {
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;