import { Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Zap, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/ui/Button';
import SpotlightCursor from '../components/ui/SpotlightCursor';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white transition-colors duration-300">
      <SpotlightCursor />

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-[#030712]/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/60 transition-all duration-300">
              <Zap className="h-5 w-5 text-white" />
              {/* orbit dot */}
              <span className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-orbit" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-shimmer transition-all duration-300">
              Resume<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it Works', href: '#how-it-works' },
              { label: 'Testimonials', href: '#testimonials' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-400/50 hover:text-white transition-all duration-200">
                  Dashboard →
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white btn-primary-glow transition-all duration-300">
                    Get Started Free
                  </button>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#030712]/95 backdrop-blur-xl px-4 py-4 space-y-2">
            {['Features', 'How it Works', 'Testimonials'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                className="block px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <Outlet />
    </div>
  );
}
