import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, BarChart3, Clock } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="badge animate-float">Now in v2.0 - Supabase Powered</div>
                    <h1>Build and Scale Your <span className="text-gradient">SaaS API</span> Infrastructure</h1>
                    <p>
                        The easiest way to manage user subscriptions, API keys, and rate limits.
                        Focus on your product, we'll handle the infrastructure.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary btn-large">Start Building - It's Free</Link>
                        <Link to="/login" className="btn-glass">View Demo Dashboard</Link>
                    </div>
                </motion.div>

                <div className="hero-visual">
                    <div className="glow-orb orb-1"></div>
                    <div className="glow-orb orb-2"></div>
                    <div className="dashboard-preview glass-card">
                        <div className="preview-header">
                            <div className="dots"><span /><span /><span /></div>
                            <div className="address">api.subscribly.io/v2/usage</div>
                        </div>
                        <div className="preview-body">
                            <div className="line line-1"></div>
                            <div className="line line-2"></div>
                            <div className="line line-3"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="feature-grid">
                    <FeatureCard
                        icon={<Shield color="#7c3bed" />}
                        title="Secure API Auth"
                        desc="Enterprise-grade JWT and unique API key rotations."
                    />
                    <FeatureCard
                        icon={<BarChart3 color="#3b82f6" />}
                        title="Smart Quotas"
                        desc="Plan-based rate limiting with millisecond precision."
                    />
                    <FeatureCard
                        icon={<Clock color="#f472b6" />}
                        title="Instant Setup"
                        desc="Ready-to-use endpoints for your subscription logic."
                    />
                </div>
            </section>

            <style jsx="true">{`
        .landing-container {
          padding-top: 120px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 80px 20px;
        }
        .hero-content h1 {
          font-size: 4rem;
          margin-bottom: 24px;
          line-height: 1.1;
        }
        .text-gradient {
          background: linear-gradient(135deg, #7c3bed, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .badge {
          display: inline-block;
          background: rgba(124, 59, 237, 0.1);
          border: 1px solid var(--border-glow);
          color: var(--primary);
          padding: 6px 16px;
          border-radius: 30px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .hero-content p {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 40px;
          max-width: 500px;
        }
        .hero-actions {
          display: flex;
          gap: 20px;
        }
        .btn-large {
          font-size: 1.1rem;
          padding: 16px 32px;
        }
        .btn-glass {
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          color: white;
          backdrop-filter: blur(10px);
        }
        
        .hero-visual {
          position: relative;
        }
        .glow-orb {
          position: absolute;
          width: 300px;
          height: 300px;
          filter: blur(80px);
          opacity: 0.3;
          z-index: -1;
        }
        .orb-1 { top: -50px; left: -50px; background: var(--primary); }
        .orb-2 { bottom: -50px; right: -50px; background: var(--secondary); }
        
        .dashboard-preview {
          height: 350px;
          transform: perspective(1000px) rotateY(-15deg) rotateX(5deg);
          box-shadow: 0 50px 100px rgba(0,0,0,0.6);
        }
        .preview-header {
          padding: 12px;
          border-bottom: 1px solid var(--border-glass);
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .dots { display: flex; gap: 6px; }
        .dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--border-glass); }
        .address { font-size: 0.8rem; color: var(--text-dim); }
        .preview-body { padding: 20px; }
        .line { height: 10px; background: var(--border-glass); border-radius: 5px; margin-bottom: 15px; }
        .line-1 { width: 40%; background: var(--primary-glow); }
        .line-2 { width: 80%; }
        .line-3 { width: 60%; }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          padding: 100px 20px;
        }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; text-align: center; }
          .hero-content p { margin: 0 auto 40px; }
          .hero-actions { justify-content: center; }
          .feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="feature-card glass-card"
    >
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <style jsx="true">{`
      .feature-card {
        padding: 40px;
        text-align: center;
      }
      .feature-icon {
        width: 60px;
        height: 60px;
        background: rgba(255,255,255,0.05);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
      }
      .feature-card p {
        color: var(--text-muted);
        margin-top: 12px;
      }
    `}</style>
    </motion.div>
);

export default LandingPage;
