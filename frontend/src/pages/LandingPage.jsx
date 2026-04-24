import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap as Fast, BarChart3, ArrowRight, Check, Layers3, Sparkles, TerminalSquare, Gauge, MessageCircleQuestion, Quote, Users } from 'lucide-react';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { API_URL } = useAuth();
  const [plans, setPlans] = useState([]);
  const reduceMotion = useReducedMotion();

  const shellVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.08 },
    },
  };

  const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
  const cardReveal = { hidden: { opacity: 0, y: 26, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1 } };

  const steps = [
    { icon: <Sparkles size={18} />, title: 'Create plans', text: 'Define pricing, duration, and request limits.' },
    { icon: <Users size={18} />, title: 'Activate users', text: 'Register customers, issue access, and assign API keys.' },
    { icon: <TerminalSquare size={18} />, title: 'Ship requests', text: 'Protected routes accept only valid x-api-key calls.' },
    { icon: <Gauge size={18} />, title: 'Track usage', text: 'Monitor consumption and daily limits in real time.' },
  ];

  const testimonials = [
    { name: 'Ari Chen', role: 'Founder, NovaStack', quote: 'We shipped API subscriptions in days, not weeks.' },
    { name: 'Mina Patel', role: 'Product Lead, Flowloop', quote: 'The dashboard and usage gating feel production-ready.' },
    { name: 'Noah Rivera', role: 'CTO, MetricGrid', quote: 'The API-key flow is clean and the motion makes it feel premium.' },
  ];

  const faqs = [
    { q: 'Does Subscribly handle billing?', a: 'Not yet. The current build manages subscription access and API keys; billing can be added next.' },
    { q: 'How are limits enforced?', a: 'Each protected request is checked against the active plan and logged per user per day.' },
    { q: 'Can I add more plans?', a: 'Yes. Admin endpoints support plan creation, updates, and deactivation.' },
  ];

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
    <motion.div className="landing-page page-shell" variants={shellVariants} initial="hidden" animate="show">
      <div className="page-orb orb-a" />
      <div className="page-orb orb-b" />
      <div className="page-orb orb-c" />

      <motion.section className="hero" variants={fadeUp}>
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="hero-content"
        >
          <motion.div className="badge animate-float animate-pulse-glow" whileHover={{ scale: 1.04 }}>
            Now in Beta 🚀
          </motion.div>
          <h1 className="hero-title">
            Scale Your API <br />
            <span className="gradient-text">Without Limits</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate subscription infrastructure for modern SaaS. Manage plans, keys, and usage with one line of code.
          </p>
          <div className="hero-actions">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to="/register" className="btn-primary hero-cta">
                Get Started Free <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.a href="#features" className="btn-secondary" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              View Documentation
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.15, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="dashboard-preview glass-card animate-pulse-glow">
            <div className="preview-header">
              <div className="dots"><span /><span /><span /></div>
              <motion.div className="address-bar animate-shimmer">api.subscribly.io/v1/dashboard</motion.div>
            </div>
            <div className="preview-body">
              <div className="preview-sidebar">
                <motion.div className="p-item" animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="p-item" animate={{ y: [0, -6, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
                <motion.div className="p-item" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }} />
              </div>
              <div className="preview-main">
                <div className="p-stats">
                  <motion.div className="p-card animate-shimmer" animate={{ y: [0, -4, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} />
                  <motion.div className="p-card animate-shimmer" animate={{ y: [0, -7, 0] }} transition={{ duration: 4.7, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
                  <motion.div className="p-card animate-shimmer" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
                </div>
                <motion.div className="p-chart animate-shimmer" animate={{ scale: [1, 1.01, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section className="social-proof" variants={fadeUp}>
        <div className="proof-strip glass-card">
          <span>Used by teams building paid APIs</span>
          <span>JWT + API key security</span>
          <span>Usage-based subscription control</span>
          <span>Supabase-powered backend</span>
        </div>
      </motion.section>

      <motion.section id="features" className="features" variants={fadeUp}>
        <h2 className="section-title">Built for Performance</h2>
        <motion.div className="features-grid" variants={shellVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <FeatureCard icon={<Shield color="#7c3bed" />} title="Secure Auth" desc="Enterprise-grade JWT authentication and API key management." />
          <FeatureCard icon={<Fast color="#3b82f6" />} title="Ultra Fast" desc="Edge-cached subscription checks with <10ms overhead." />
          <FeatureCard icon={<BarChart3 color="#f472b6" />} title="Real-time Analytics" desc="Detailed usage tracking and insights for every user." />
          <FeatureCard icon={<Layers3 color="#22c55e" />} title="Plan Control" desc="Create, update, and deactivate plans from the admin surface." />
        </motion.div>
      </motion.section>

      <motion.section className="how-it-works" variants={fadeUp}>
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="step-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="step-index">0{index + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="testimonials" variants={fadeUp}>
        <h2 className="section-title">What Teams Say</h2>
        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.name}
              className="testimonial-card glass-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
            >
              <Quote size={18} className="quote-icon" />
              <p>{item.quote}</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </motion.section>

      <motion.section className="faq" variants={fadeUp}>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((item) => (
            <motion.details
              key={item.q}
              className="faq-item glass-card"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <summary><MessageCircleQuestion size={18} /> {item.q}</summary>
              <p>{item.a}</p>
            </motion.details>
          ))}
        </div>
      </motion.section>

      <motion.section className="pricing" variants={fadeUp}>
        <h2 className="section-title">Transparent Pricing</h2>
        <motion.div className="pricing-grid" variants={shellVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="pricing-card glass-card"
              variants={cardReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
            >
              <div className="pricing-card-top">
                <h3>{plan.name}</h3>
                <div className="price">${plan.price}<span>/mo</span></div>
              </div>
              <ul className="plan-list">
                <li><Check size={16} color="#10b981" /> {plan.dailyLimit === -1 ? 'Unlimited Daily Requests' : `${plan.dailyLimit.toLocaleString()} Daily Requests`}</li>
                <li><Check size={16} color="#10b981" /> API Key Management</li>
                <li><Check size={16} color="#10b981" /> Standard Support</li>
              </ul>
              <Link to="/register" className="btn-primary full-width">Get Started</Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section className="final-cta" variants={fadeUp}>
        <div className="cta-panel glass-card">
          <div>
            <div className="eyebrow">Ready to launch</div>
            <h2>Build the subscription layer your API should have had from day one.</h2>
          </div>
          <Link to="/register" className="btn-primary cta-button">
            Start Free <ArrowRight size={20} />
          </Link>
        </div>
      </motion.section>

      <Footer />

      <style jsx="true">{`
        .landing-page {
          color: var(--text-main);
          position: relative;
          z-index: 1;
        }
        .hero {
          min-height: calc(100vh - 86px);
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          align-items: center;
          gap: 48px;
          padding: 48px 20px 120px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .hero-content {
          max-width: 680px;
          position: relative;
          z-index: 1;
        }
        .badge {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-glass);
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-weight: 700;
          color: var(--primary);
        }
        .hero-title {
          font-size: clamp(3.2rem, 8vw, 6rem);
          line-height: 0.96;
          letter-spacing: -0.05em;
          margin-bottom: 24px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, var(--primary) 30%, var(--secondary) 70%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-muted);
          max-width: 620px;
          margin-bottom: 40px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .btn-secondary {
          background: rgba(255,255,255,0.04);
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
          margin-left: auto;
          perspective: 1200px;
          position: relative;
          z-index: 1;
        }
        .dashboard-preview {
          height: 560px;
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 90px rgba(0,0,0,0.45);
          transform-style: preserve-3d;
        }
        .preview-header {
          background: rgba(0,0,0,0.24);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid var(--border-glass);
        }
        .dots { display: flex; gap: 6px; }
        .dots span { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.12); }
        .address-bar {
          background: rgba(255,255,255,0.06);
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.8rem;
          color: var(--text-dim);
          flex-grow: 1;
          text-align: left;
        }
        .preview-body { flex-grow: 1; display: flex; }
        .preview-sidebar { width: 72px; border-right: 1px solid var(--border-glass); padding: 16px 14px; display: flex; flex-direction: column; gap: 15px; }
        .p-item { width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.04); }
        .preview-main { flex-grow: 1; padding: 30px; display: flex; flex-direction: column; gap: 20px; }
        .p-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .p-card { height: 92px; border-radius: 18px; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.04); }
        .p-chart { flex-grow: 1; border-radius: 20px; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.04); }
        .social-proof {
          padding: 0 20px 40px;
          position: relative;
          z-index: 1;
        }
        .proof-strip {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 24px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .features {
          padding: 40px 20px 100px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .section-title { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 48px; }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .how-it-works,
        .testimonials,
        .faq,
        .final-cta {
          padding: 20px 20px 100px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .system-showcase {
          padding: 20px 20px 100px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
          gap: 24px;
          align-items: center;
        }
        .steps-grid,
        .testimonial-grid,
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .step-card {
          padding: 28px;
          position: relative;
          overflow: hidden;
          text-align: left;
        }
        .step-index {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 800;
        }
        .step-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          color: var(--primary);
          margin-bottom: 18px;
        }
        .step-card h3,
        .testimonial-card strong {
          margin-bottom: 8px;
        }
        .step-card p,
        .showcase-copy p,
        .testimonial-card p,
        .faq-item p {
          color: var(--text-muted);
          line-height: 1.65;
        }
        .eyebrow {
          color: var(--primary);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .showcase-copy h2,
        .final-cta h2 {
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.02;
          margin-bottom: 16px;
        }
        .showcase-points {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }
        .showcase-points div {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-main);
        }
        .showcase-panel {
          padding: 24px;
          border-radius: 24px;
        }
        .showcase-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .showcase-panel pre {
          margin: 0;
          white-space: pre-wrap;
          padding: 20px;
          border-radius: 16px;
          background: rgba(0,0,0,0.24);
          border: 1px solid var(--border-glass);
          color: #dbeafe;
        }
        .testimonial-card {
          padding: 28px;
          text-align: left;
        }
        .quote-icon {
          color: var(--primary);
          margin-bottom: 16px;
        }
        .testimonial-card footer {
          display: flex;
          flex-direction: column;
          margin-top: 18px;
        }
        .testimonial-card footer span {
          color: var(--text-dim);
          font-size: 0.9rem;
        }
        .faq-item { padding: 24px; }
        .faq-item summary {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 700;
          list-style: none;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item p { margin-top: 14px; }
        .pricing {
          padding: 60px 20px 120px;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .pricing-card { padding: 32px; text-align: left; display: flex; flex-direction: column; gap: 20px; transform-style: preserve-3d; }
        .pricing-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .pricing-card h3 { font-size: 1.35rem; }
        .plan-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .plan-list li { display: flex; align-items: center; gap: 10px; color: var(--text-muted); }
        .full-width { width: 100%; text-align: center; justify-content: center; }
        .cta-panel {
          padding: 32px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          border-radius: 28px;
        }
        .cta-button { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
        @media (max-width: 980px) {
          .hero { grid-template-columns: 1fr; padding-top: 28px; }
          .hero-image { max-width: 100%; }
          .system-showcase,
          .cta-panel { grid-template-columns: 1fr; }
          .cta-panel { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 640px) {
          .hero { min-height: auto; padding-bottom: 80px; }
          .dashboard-preview { height: 420px; }
          .preview-main { padding: 18px; }
          .p-stats { grid-template-columns: 1fr; }
          .hero-actions { flex-direction: column; }
          .proof-strip { flex-direction: column; }
        }
      `}</style>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div className="feature-card glass-card" variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}>
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <style jsx="true">{`
      .feature-card { padding: 32px; text-align: left; transition: transform 0.3s; }
      .feature-icon { margin-bottom: 24px; padding: 12px; background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: 14px; width: fit-content; }
      .feature-card h3 { margin-bottom: 12px; font-size: 1.35rem; }
      .feature-card p { color: var(--text-muted); line-height: 1.6; }
    `}</style>
  </motion.div>
);

export default LandingPage;
