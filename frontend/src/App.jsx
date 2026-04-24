import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Docs from './pages/Docs';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return children;
};

const PageShell = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(10px)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="page-shell"
    >
      {children}
    </motion.div>
  );
};

const SiteFooter = () => {
  const location = useLocation();

  if (location.pathname === '/' || location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return <Footer />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <AnimatePresence mode="wait">
                <PageShell>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/dashboard/*"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </PageShell>
              </AnimatePresence>
            </main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
