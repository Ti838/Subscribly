import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Activity, Key, CreditCard, Users, Settings, Check, Copy, RefreshCw } from 'lucide-react';

const dashboardVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user, API_URL, checkAuth } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/subscriptions/plans`);
      setPlans(response.data.plans || []);
    } catch (err) {
      console.error('Failed to fetch plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkAuth();
    await fetchPlans();
    setIsRefreshing(false);
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div className="dashboard-layout page-shell" variants={dashboardVariants} initial="hidden" animate="show">
      <div className="page-orb orb-a" />
      <div className="page-orb orb-b" />

      <motion.aside className="sidebar glass-card" variants={slideUp}>
        <div className="sidebar-links">
          <SidebarItem icon={<Activity size={20} />} label="Overview" active={true} />
          <SidebarItem icon={<Key size={20} />} label="API Keys" />
          <SidebarItem icon={<CreditCard size={20} />} label="Billing" />
          <SidebarItem icon={<Users size={20} />} label="Team" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </div>
      </motion.aside>

      <motion.main className="dashboard-content" variants={dashboardVariants}>
        <motion.header className="dashboard-header" variants={slideUp}>
          <div className="header-info">
            <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p>Your API infrastructure is healthy and running.</p>
          </div>
          <motion.button
            className={`btn-refresh ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: 8 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          >
            <RefreshCw size={20} />
          </motion.button>
        </motion.header>

        <motion.div className="stats-grid" variants={dashboardVariants}>
          <StatCard
            title="API Requests"
            value={user?.usage?.totalRequests || '0'}
            change={`${user?.usage?.dailyCount || 0} today`}
            index={0}
          />
          <StatCard
            title="Subscription"
            value={user?.subscription?.planName || 'Free'}
            change={user?.subscription?.status || 'Active'}
            color="#3b82f6"
            index={1}
          />
          <StatCard
            title="Daily Limit"
            value={user?.subscription?.dailyLimit || '100'}
            change="Requests per day"
            color="#10b981"
            index={2}
          />
        </motion.div>

        <motion.section className="dashboard-section glass-card animate-pulse-glow" variants={slideUp}>
          <div className="section-header">
            <div>
              <h3>Your Active API Key</h3>
              <p className="subtitle">Use this key to authenticate your requests</p>
            </div>
            <span className="badge-live"><span className="live-dot" /> Live Mode</span>
          </div>
          <div className="api-key-box">
            <code>{user?.apiKey || 'Generating your key...'}</code>
            <button className="btn-copy" onClick={() => copyToClipboard(user?.apiKey)}>
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </motion.section>

        <motion.section className="dashboard-section" variants={slideUp}>
          <div className="section-header">
            <h3>Subscription Plans</h3>
            <p className="subtitle">Choose the plan that fits your needs</p>
          </div>
          <div className="plans-grid">
            {loadingPlans ? (
              <div className="loader-container">
                <div className="spinner"></div>
                <p>Fetching the latest plans...</p>
              </div>
            ) : (
              plans.map(plan => (
                <PlanCard key={plan.id} plan={plan} isCurrent={user?.subscription?.planId === plan.id} />
              ))
            )}
          </div>
        </motion.section>
      </motion.main>

      <style jsx="true">{`
        .dashboard-layout {
          padding: 24px 20px 40px;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 30px;
          position: relative;
          z-index: 1;
        }
        .sidebar {
          height: fit-content;
          padding: 20px;
          position: sticky;
          top: 110px;
          border-radius: 20px;
          transform: translateZ(0);
        }
        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .dashboard-header h1 {
          font-size: 2.2rem;
          margin-bottom: 4px;
          background: linear-gradient(to right, var(--text-main), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dashboard-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        .btn-refresh {
          background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          padding: 10px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .btn-refresh:hover {
          color: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 0 0 6px var(--primary-glow);
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .dashboard-section {
          padding: 30px;
          border-radius: 24px;
        }
        .subtitle {
          font-size: 0.9rem;
          color: var(--text-dim);
          margin-top: 4px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .badge-live {
          font-size: 0.7rem;
          padding: 5px 12px;
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          font-weight: 800;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #10b981;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
          animation: livePulse 1.6s ease-in-out infinite;
        }
        .api-key-box {
          background: linear-gradient(145deg, rgba(0,0,0,0.28), rgba(255,255,255,0.02));
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid var(--border-glass);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          overflow: hidden;
        }
        .api-key-box code {
          color: var(--primary);
          font-size: 1.1rem;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }
        .btn-copy {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-glass);
          padding: 8px 14px;
          border-radius: 10px;
          color: var(--text-main);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .btn-copy:hover {
          background: rgba(255,255,255,0.08);
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .loader-container {
          grid-column: 1 / -1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          color: var(--text-dim);
        }
        .plan-card {
          transform-style: preserve-3d;
        }
        .plan-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(124, 59, 237, 0.08), transparent 40%, rgba(59, 130, 246, 0.08));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .plan-card:hover::before {
          opacity: 1;
        }
        @keyframes livePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% {
            transform: scale(1.2);
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }
        @media (max-width: 1000px) {
          .dashboard-layout { grid-template-columns: 1fr; padding-top: 88px; }
          .sidebar { display: none; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </motion.div>
  );
};

const PlanCard = ({ plan, isCurrent }) => (
  <motion.div
    className={`plan-card glass-card ${isCurrent ? 'active' : ''}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {isCurrent && <div className="current-badge">Active Plan</div>}
    <h4>{plan.name}</h4>
    <div className="price">${plan.price}<span>/mo</span></div>
    <ul className="plan-features">
      <li><Check size={14} className="check-icon" /> {plan.dailyLimit === -1 ? 'Unlimited requests / day' : `${plan.dailyLimit.toLocaleString()} requests / day`}</li>
      <li><Check size={14} className="check-icon" /> REST API Access</li>
      <li><Check size={14} className="check-icon" /> Community Support</li>
    </ul>
    <button className={`btn-plan ${isCurrent ? 'btn-current' : 'btn-primary'}`}>
      {isCurrent ? 'Manage Plan' : 'Select Plan'}
    </button>
    <style jsx="true">{`
      .plan-card {
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
        overflow: hidden;
      }
      .plan-card.active {
        border: 2px solid var(--primary);
        box-shadow: 0 0 40px var(--primary-glow);
      }
      .current-badge {
        position: absolute;
        top: 12px;
        right: -30px;
        background: var(--primary);
        color: white;
        padding: 4px 35px;
        font-size: 0.65rem;
        font-weight: 900;
        transform: rotate(45deg);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .plan-card h4 {
        font-size: 1.4rem;
        color: var(--text-main);
      }
      .price {
        font-size: 2.8rem;
        font-weight: 800;
        color: var(--text-main);
      }
      .price span {
        font-size: 1rem;
        color: var(--text-muted);
        font-weight: 500;
      }
      .plan-features {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .plan-features li {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.95rem;
        color: var(--text-muted);
      }
      .check-icon {
        color: var(--primary);
      }
      .btn-plan {
        width: 100%;
        margin-top: 10px;
        font-size: 0.95rem;
      }
      .btn-current {
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--border-glass);
        color: var(--text-main);
      }
    `}</style>
  </motion.div>
);

const SidebarItem = ({ icon, label, active }) => (
  <motion.div className={`sidebar-item ${active ? 'active' : ''}`} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
    {icon}
    <span>{label}</span>
    <style jsx="true">{`
      .sidebar-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        cursor: pointer;
        color: var(--text-muted);
        transition: all 0.2s;
        font-weight: 600;
        font-size: 0.95rem;
      }
      .sidebar-item:hover {
        background: rgba(255,255,255,0.05);
        color: var(--text-main);
      }
      .sidebar-item.active {
        background: var(--primary-glow);
        color: var(--primary);
        border: 1px solid var(--border-glow);
      }
    `}</style>
  </motion.div>
);

const StatCard = ({ title, value, change, color = '#7c3bed', index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.45 }}
    whileHover={{ y: -6, scale: 1.01 }}
    className="stat-card glass-card"
  >
    <span className="stat-title">{title}</span>
    <div className="stat-value">{value}</div>
    <span className="stat-change" style={{ color }}>{change}</span>
    <style jsx="true">{`
      .stat-card {
        padding: 24px;
        border-bottom: 3px solid ${color};
        border-radius: 18px;
        position: relative;
        overflow: hidden;
      }
      .stat-title {
        color: var(--text-dim);
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .stat-value {
        font-size: 2.2rem;
        font-weight: 800;
        margin: 8px 0;
        color: var(--text-main);
      }
      .stat-change {
        font-size: 0.85rem;
        font-weight: 600;
        opacity: 0.8;
      }
    `}</style>
  </motion.div>
);

export default Dashboard;
