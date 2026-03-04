import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Activity, Key, CreditCard, Users, Settings, Check, Copy } from 'lucide-react';

const Dashboard = () => {
    const { user, API_URL } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await axios.get(`${API_URL}/subscriptions/plans`);
            setPlans(response.data.plans);
        } catch (err) {
            console.error('Failed to fetch plans');
        } finally {
            setLoadingPlans(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar glass-card">
                <div className="sidebar-links">
                    <SidebarItem icon={<Activity size={20} />} label="Overview" active={true} />
                    <SidebarItem icon={<Key size={20} />} label="API Keys" />
                    <SidebarItem icon={<CreditCard size={20} />} label="Billing" />
                    <SidebarItem icon={<Users size={20} />} label="Team" />
                    <SidebarItem icon={<Settings size={20} />} label="Settings" />
                </div>
            </aside>

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <h1>Welcome, {user?.name.split(' ')[0]}!</h1>
                        <p>Your API infrastructure is healthy and running.</p>
                    </div>
                </header>

                <div className="stats-grid">
                    <StatCard title="API Requests" value="12,482" change="+12%" />
                    <StatCard title="Active Users" value="842" change="+5%" />
                    <StatCard title="Avg Latency" value="124ms" change="-18%" color="#10b981" />
                </div>

                <section className="dashboard-section glass-card">
                    <div className="section-header">
                        <h3>Your Active API Key</h3>
                        <span className="badge-live">Live Mode</span>
                    </div>
                    <div className="api-key-box">
                        <code>{user?.apiKey || 'sk_live_... (Subscribe to a plan to see your key)'}</code>
                        <button className="btn-copy" onClick={() => copyToClipboard(user?.apiKey)}>
                            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </section>

                <section className="dashboard-section">
                    <h3>Upgrade Your Plan</h3>
                    <div className="plans-grid">
                        {loadingPlans ? (
                            <div className="loader">Loading plans...</div>
                        ) : (
                            plans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} isCurrent={user?.subscription?.planId === plan.id} />
                            ))
                        )}
                    </div>
                </section>
            </main>

            <style jsx="true">{`
        .dashboard-layout {
          padding: 120px 20px 40px;
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
        }
        .sidebar {
          height: fit-content;
          padding: 20px;
          position: sticky;
          top: 120px;
        }
        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .dashboard-header h1 {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }
        .dashboard-header p {
          color: var(--text-muted);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .dashboard-section {
          padding: 30px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-header h3 {
          color: var(--text-muted);
        }
        .badge-live {
          font-size: 0.75rem;
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .api-key-box {
          background: rgba(0,0,0,0.3);
          padding: 15px 20px;
          border-radius: 12px;
          border: 1px solid var(--border-glass);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .api-key-box code {
          color: var(--primary);
          font-size: 1.1rem;
          font-family: monospace;
          letter-spacing: 0.1em;
        }
        .btn-copy {
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          padding: 8px 16px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .btn-copy:hover {
          background: rgba(255,255,255,0.1);
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        @media (max-width: 1000px) {
          .dashboard-layout { grid-template-columns: 1fr; }
          .sidebar { display: none; }
        }
      `}</style>
        </div>
    );
};

const PlanCard = ({ plan, isCurrent }) => (
    <div className={`plan-card glass-card ${isCurrent ? 'active' : ''}`}>
        {isCurrent && <div className="current-badge">Active Plan</div>}
        <h4>{plan.name}</h4>
        <div className="price">${plan.price}<span>/mo</span></div>
        <ul className="plan-features">
            <li><Check size={14} /> {plan.dailyLimit} requests / day</li>
            <li><Check size={14} /> REST API Access</li>
            <li><Check size={14} /> Priority Support</li>
        </ul>
        <button className={`btn-plan ${isCurrent ? 'btn-current' : 'btn-primary'}`}>
            {isCurrent ? 'Manage' : 'Upgrade Now'}
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
        border-color: var(--primary);
        box-shadow: 0 0 30px var(--primary-glow);
      }
      .current-badge {
        position: absolute;
        top: 15px;
        right: -35px;
        background: var(--primary);
        color: white;
        padding: 4px 40px;
        font-size: 0.7rem;
        font-weight: 700;
        transform: rotate(45deg);
      }
      .plan-card h4 {
        font-size: 1.5rem;
      }
      .price {
        font-size: 2.5rem;
        font-weight: 800;
      }
      .price span {
        font-size: 1rem;
        color: var(--text-muted);
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
        font-size: 0.9rem;
        color: var(--text-muted);
      }
      .btn-plan {
        width: 100%;
        margin-top: 10px;
      }
      .btn-current {
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--border-glass);
        color: white;
      }
    `}</style>
    </div>
);

const SidebarItem = ({ icon, label, active }) => (
    <div className={`sidebar-item ${active ? 'active' : ''}`}>
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
        transition: all 0.3s;
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
    </div>
);

const StatCard = ({ title, value, change, color = '#7c3bed' }) => (
    <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
        <span className="stat-title">{title}</span>
        <div className="stat-value">{value}</div>
        <span className="stat-change" style={{ color }}>{change} this month</span>
        <style jsx="true">{`
      .stat-card {
        padding: 24px;
        border-bottom: 4px solid ${color};
      }
      .stat-title {
        color: var(--text-dim);
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
      }
      .stat-value {
        font-size: 2rem;
        font-weight: 800;
        margin: 5px 0;
      }
      .stat-change {
        font-size: 0.85rem;
        font-weight: 600;
      }
    `}</style>
    </motion.div>
);

export default Dashboard;
