import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, KeyRound, ShieldCheck, Server, Code2 } from 'lucide-react';

const endpointGroups = [
  {
    title: 'Authentication',
    endpoints: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
  },
  {
    title: 'Subscriptions',
    endpoints: ['GET /api/subscriptions/plans', 'POST /api/subscriptions/subscribe', 'POST /api/subscriptions/cancel'],
  },
  {
    title: 'Protected API',
    endpoints: ['GET /api/data', 'GET /api/status', 'GET /api/usage-history'],
  },
];

const Docs = () => {
  return (
    <div className="docs-page page-shell">
      <div className="page-orb orb-a" />
      <div className="page-orb orb-b" />

      <section className="docs-hero">
        <motion.div
          className="docs-intro glass-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="docs-kicker">Developer Docs</div>
          <h1>Everything needed to launch API subscriptions.</h1>
          <p>
            Clear setup steps, endpoint groups, and implementation rules for integrating Subscribly into a SaaS product.
          </p>
          <div className="docs-actions">
            <Link to="/register" className="btn-primary">Get Started <ArrowRight size={18} /></Link>
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </motion.div>

        <div className="docs-stack">
          <DocCard icon={<ShieldCheck size={18} />} title="Security" text="JWT auth, API keys, and rate limits are enforced server-side." />
          <DocCard icon={<KeyRound size={18} />} title="Keys" text="Subscriptions issue an API key that can be copied from the dashboard." />
          <DocCard icon={<Server size={18} />} title="Backend" text="Express routes connect to Supabase through service logic and middleware." />
        </div>
      </section>

      <section className="docs-grid">
        {endpointGroups.map((group, index) => (
          <motion.article
            key={group.title}
            className="docs-panel glass-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="panel-header">
              <Code2 size={18} />
              <h2>{group.title}</h2>
            </div>
            <ul>
              {group.endpoints.map((endpoint) => (
                <li key={endpoint}>{endpoint}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </section>

      <section className="docs-quickstart glass-card">
        <div>
          <div className="docs-kicker">Quick Start</div>
          <h2>Build on top of the current stack in minutes.</h2>
        </div>
        <pre>{`npm install
npm run dev

POST /api/auth/register
POST /api/subscriptions/subscribe
GET /api/data`}</pre>
      </section>

      <style jsx="true">{`
        .docs-page {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 20px 80px;
        }
        .docs-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
          gap: 24px;
          align-items: stretch;
        }
        .docs-intro {
          padding: 40px;
        }
        .docs-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .docs-intro h1 {
          font-size: clamp(2.3rem, 4vw, 4rem);
          line-height: 1;
          margin-bottom: 16px;
        }
        .docs-intro p {
          color: var(--text-muted);
          max-width: 58ch;
          margin-bottom: 28px;
        }
        .docs-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-secondary {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-glass);
          padding: 12px 18px;
          border-radius: 12px;
          color: var(--text-main);
          font-weight: 700;
        }
        .docs-stack {
          display: grid;
          gap: 16px;
        }
        .docs-grid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .docs-panel {
          padding: 24px;
          border-radius: 20px;
        }
        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .docs-panel ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: var(--text-muted);
        }
        .docs-quickstart {
          margin-top: 24px;
          padding: 28px;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 20px;
          align-items: center;
        }
        .docs-quickstart h2 {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          margin-top: 8px;
        }
        .docs-quickstart pre {
          margin: 0;
          padding: 20px;
          border-radius: 16px;
          background: rgba(0,0,0,0.28);
          color: #cbd5e1;
          overflow-x: auto;
          border: 1px solid var(--border-glass);
        }
        @media (max-width: 960px) {
          .docs-hero,
          .docs-quickstart,
          .docs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

const DocCard = ({ icon, title, text }) => (
  <div className="docs-mini glass-card">
    <div className="mini-icon">{icon}</div>
    <div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
    <style jsx="true">{`
      .docs-mini {
        padding: 20px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }
      .mini-icon {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: var(--bg-glass);
        border: 1px solid var(--border-glass);
        color: var(--primary);
        flex: 0 0 auto;
      }
      .docs-mini h3 {
        font-size: 1rem;
        margin-bottom: 4px;
      }
      .docs-mini p {
        color: var(--text-muted);
        font-size: 0.9rem;
        line-height: 1.5;
      }
    `}</style>
  </div>
);

export default Docs;