import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, Zap as Fast, BarChart3, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
  const { API_URL } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_URL}/subscriptions/plans`);
        setPlans(response.data.plans || []);
      } catch (err) {
        console.error('Failed to fetch plans');
      }
    };
    fetchPlans();
  }, [API_URL]);

  return (
    <div className="landing-page">
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <div className="badge animate-float">Now in Beta 🚀</div>
          <h1 className="hero-title">
            Scale Your API <br />
            <span className="gradient-text">Without Limits</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate subscription infrastructure for modern SaaS.
            Manage plans, keys, and usage with one line of code.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <a href="#features" className="btn-secondary">View Documentation</a>
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <div className="dashboard-preview glass-card">
            <div className="preview-header">
              <div className="dots"><span /><span /><span /></div>
              <div className="address-bar">api.subscribly.io/v1/dashboard</div>
            </div>
            <div className="preview-body">
              <div className="preview-sidebar">
                <div className="p-item" /> <div className="p-item" /> <div className="p-item" />
              </div>
              <div className="preview-main">
                <div className="p-stats">
                  <div className="p-card" /> <div className="p-card" /> <div className="p-card" />
                </div>
                <div className="p-chart" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="features">
        <h2 className="section-title">Built for Performance</h2>
        <div className="features-grid">
          <FeatureCard
            icon={<Shield color="#7c3bed" />}
            title="Secure Auth"
            desc="Enterprise-grade JWT authentication and API key management."
          />
          <FeatureCard
            icon={<Fast color="#3b82f6" />}
            title="Ultra Fast"
            desc="Edge-cached subscription checks with <10ms overhead."
          />
          <FeatureCard
            icon={<BarChart3 color="#f472b6" />}
            title="Real-time Analytics"
            desc="Detailed usage tracking and insights for every user."
          />
        </div>
      </section>

      <section className="pricing">
        <h2 className="section-title">Transparent Pricing</h2>
        <div className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.id} className="pricing-card glass-card">
              <h3>{plan.name}</h3>
              <div className="price">${plan.price}<span>/mo</span></div>
              <ul className="plan-list">
                <li><Check size={16} color="#10b981" /> {plan.dailyLimit.toLocaleString()} Daily Requests</li>
                <li><Check size={16} color="#10b981" /> API Key Management</li>
                <li><Check size={16} color="#10b981" /> Standard Support</li>
              </ul>
              <Link to="/register" className="btn-primary full-width">Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <style jsx="true">{`
                .landing-page {
                    color: var(--text-main);
                }
                .hero {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 120px 20px;
                    gap: 60px;
                }
                .hero-content {
                    max-width: 800px;
                }
                .badge {
                    background: var(--bg-glass);
                    border: 1px solid var(--border-glass);
                    padding: 6px 16px;
                    border-radius: 40px;
                    font-size: 0.9rem;
                    display: inline-block;
                    margin-bottom: 24px;
                    font-weight: 600;
                    color: var(--primary);
                }
                .hero-title {
                    font-size: clamp(3rem, 8vw, 5rem);
                    line-height: 1.1;
                    margin-bottom: 24px;
                }
                .gradient-text {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-subtitle {
                    font-size: 1.25rem;
                    color: var(--text-muted);
                    max-width: 600px;
                    margin: 0 auto 40px;
                }
                .hero-actions {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                }
                .btn-secondary {
                    background: var(--bg-glass);
                    border: 1px solid var(--border-glass);
                    padding: 12px 24px;
                    border-radius: 12px;
                    color: var(--text-main);
                    font-weight: 600;
                    transition: all 0.3s;
                }
                .btn-secondary:hover {
                    background: rgba(255,255,255,0.08);
                }
                .hero-image {
                    width: 100%;
                    max-width: 1000px;
                }
                .dashboard-preview {
                    height: 500px;
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                }
                .preview-header {
                    background: rgba(0,0,0,0.2);
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .dots { display: flex; gap: 6px; }
                .dots span { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); }
                .address-bar {
                    background: rgba(255,255,255,0.05);
                    padding: 4px 16px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    color: var(--text-dim);
                    flex-grow: 1;
                    text-align: left;
                }
                .preview-body { flex-grow: 1; display: flex; }
                .preview-sidebar { width: 60px; border-right: 1px solid var(--border-glass); padding: 15px; display: flex; flex-direction: column; gap: 15px; }
                .p-item { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.05); }
                .preview-main { flex-grow: 1; padding: 30px; display: flex; flex-direction: column; gap: 20px; }
                .p-stats { display: flex; gap: 20px; }
                .p-card { flex: 1; height: 80px; border-radius: 12px; background: rgba(255,255,255,0.05); }
                .p-chart { flex-grow: 1; border-radius: 12px; background: rgba(255,255,255,0.03); }

                .features { padding: 100px 20px; text-align: center; }
                .section-title { font-size: 2.5rem; margin-bottom: 60px; }
                .features-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                    gap: 30px; 
                    max-width: 1200px; 
                    margin: 0 auto; 
                }

                .pricing { padding: 100px 20px; text-align: center; max-width: 1200px; margin: 0 auto; }
                .pricing-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                    gap: 30px; 
                }
                .pricing-card { padding: 40px; text-align: left; display: flex; flex-direction: column; gap: 20px; }
                .pricing-card h3 { font-size: 1.5rem; }
                .plan-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
                .full-width { width: 100%; text-align: center; }
            `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card glass-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <style jsx="true">{`
            .feature-card { padding: 40px; text-align: left; transition: transform 0.3s; }
            .feature-card:hover { transform: translateY(-10px); }
            .feature-icon { margin-bottom: 24px; padding: 12px; background: var(--bg-glass); border-radius: 12px; width: fit-content; }
            .feature-card h3 { margin-bottom: 12px; font-size: 1.4rem; }
            .feature-card p { color: var(--text-muted); line-height: 1.6; }
        `}</style>
  </div>
);

export default LandingPage;
