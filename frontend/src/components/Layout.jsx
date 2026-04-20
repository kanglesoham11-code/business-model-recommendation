import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, LayoutDashboard, Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './CustomCursor';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/models', label: 'Models' },
    { to: '/questionnaire', label: 'Get Started' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Custom Cursor */}
      <CustomCursor />
      {/* ====== HEADER ====== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-surface-200/60'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-glow">
                  <Sparkles className="text-white" size={20} />
                </div>
              </div>
              <span className="font-display font-bold text-xl text-gray-900 tracking-tight">
                Model<span className="text-gradient">Forge</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-surface-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-6 bg-surface-200 mx-2" />

              {user ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      location.pathname === '/dashboard'
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-surface-100'
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <div className="flex items-center space-x-3 pl-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-accent-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(user.name || user.email || '?')[0].toUpperCase()}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                      title="Logout"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn-ghost px-4 py-2 text-sm font-medium">
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Start Free
                    <ChevronRight size={14} className="ml-1 inline" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-surface-100 transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-surface-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-surface-100 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-surface-100 font-medium">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-surface-100 font-medium">
                      Log In
                    </Link>
                    <Link to="/register" className="block btn btn-primary text-center mt-2">
                      Start Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 pt-16 md:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="relative bg-surface-900 text-gray-400 overflow-hidden">
        {/* Gradient top border */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Brand block */}
            <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={18} />
                </div>
                <span className="font-display font-bold text-lg text-white">
                  ModelForge
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 max-w-md">
                AI-powered engine helping founders discover their optimal e-commerce 
                business model through data-driven analysis of 24 key parameters.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-3">
              <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/models" className="hover:text-white transition-colors duration-300">Business Models</Link></li>
                <li><Link to="/questionnaire" className="hover:text-white transition-colors duration-300">Questionnaire</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-300">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Terms</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="divider-gradient mt-12 mb-8 opacity-20" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; 2026 ModelForge. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Built with precision. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
