import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Upload, FileSearch, Briefcase, PenLine, Mail,
  User, LogOut, Zap, Brain, Compass, Linkedin, Code, Edit, GitCompare, Newspaper,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard',        color: '#818cf8' },
  { to: '/upload',             icon: Upload,           label: 'Upload Resume',    color: '#6366f1' },
  { to: '/analysis',           icon: FileSearch,       label: 'ATS Analysis',    color: '#818cf8' },
  { to: '/resume-compare',     icon: GitCompare,       label: 'Resume Compare',  color: '#a78bfa' },
  { to: '/job-match',          icon: Briefcase,        label: 'Job Matching',    color: '#22d3ee' },
  { to: '/jobs-board',         icon: Newspaper,        label: 'AI Jobs Board',   color: '#34d399' },
  { to: '/rewriter',           icon: PenLine,          label: 'Resume Rewriter', color: '#a78bfa' },
  { to: '/resume-builder',     icon: Edit,             label: 'Resume Builder',  color: '#f472b6' },
  { to: '/cover-letter',       icon: Mail,             label: 'Cover Letter',    color: '#f472b6' },
  { to: '/interview-prep',     icon: Brain,            label: 'Interview Prep',  color: '#fbbf24' },
  { to: '/career-roadmap',     icon: Compass,          label: 'Career Roadmap',  color: '#34d399' },
  { to: '/linkedin-optimizer', icon: Linkedin,         label: 'LinkedIn Optimize', color: '#60a5fa' },
  { to: '/portfolio-generator',icon: Code,             label: 'Portfolio Builder', color: '#22d3ee' },
  { to: '/profile',            icon: User,             label: 'Profile',         color: '#94a3b8' },
];

export default function Sidebar({ onNavigate }) {
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_32px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-5">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
        >
          <Zap className="h-5 w-5 text-white" />
        </motion.div>
        <span className="text-lg font-extrabold tracking-tight text-white">
          Resume<span className="text-indigo-400">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto scrollbar-thin">
        {links.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className="relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:text-white transition-all duration-200 group"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/[0.04]" />

                <span className="relative z-10 flex items-center gap-3 w-full">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                    style={isActive ? { background: `${color}20`, boxShadow: `0 0 12px ${color}40` } : {}}
                  >
                    <Icon className="h-4 w-4" style={{ color: isActive ? color : undefined }} />
                  </span>
                  <span className={`transition-colors duration-200 ${isActive ? 'text-white font-semibold' : 'group-hover:text-slate-200'}`}>
                    {label}
                  </span>
                </span>
                {isActive && (
                  <div className="absolute right-3 h-1.5 w-1.5 rounded-full z-10" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.06] p-3 bg-black/20">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <p className="truncate text-xs font-medium text-slate-400">{user?.email}</p>
        </div>
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </motion.button>
      </div>
    </aside>
  );
}
