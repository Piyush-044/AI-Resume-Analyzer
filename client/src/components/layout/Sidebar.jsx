import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  Briefcase,
  PenLine,
  Mail,
  User,
  LogOut,
  FileText,
  Brain,
  Compass,
  Linkedin,
  Code,
  Edit,
  GitCompare,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Resume' },
  { to: '/analysis', icon: FileSearch, label: 'ATS Analysis' },
  { to: '/resume-compare', icon: GitCompare, label: 'Resume Compare' },
  { to: '/job-match', icon: Briefcase, label: 'Job Matching' },
  { to: '/jobs-board', icon: Briefcase, label: 'AI Jobs Board' },
  { to: '/rewriter', icon: PenLine, label: 'Resume Rewriter' },
  { to: '/resume-builder', icon: Edit, label: 'Resume Builder' },
  { to: '/cover-letter', icon: Mail, label: 'Cover Letter' },
  { to: '/interview-prep', icon: Brain, label: 'Interview Prep' },
  { to: '/career-roadmap', icon: Compass, label: 'Career Roadmap' },
  { to: '/linkedin-optimizer', icon: Linkedin, label: 'LinkedIn Optimize' },
  { to: '/portfolio-generator', icon: Code, label: 'Portfolio Builder' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ onNavigate }) {
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/60 bg-white/90 dark:border-slate-800/40 dark:bg-slate-950/90 backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-slate-200/60 px-6 py-5 dark:border-slate-800/40">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-md shadow-indigo-500/20"
        >
          <FileText className="h-5 w-5 text-white" />
        </motion.div>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
          ResumeAI
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className="relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-200"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-50/80 to-indigo-50/20 dark:from-slate-900/90 dark:to-slate-900/40 border-l-[3px] border-primary-500 shadow-sm"
                    style={{ zIndex: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3 w-full">
                  <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className={isActive ? 'font-semibold text-primary-700 dark:text-primary-400' : ''}>
                    {label}
                  </span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="border-t border-slate-200/60 p-4 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20">
        <p className="truncate px-3 text-xs font-semibold text-slate-400 dark:text-slate-500">{user?.email}</p>
        <motion.button
          whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </motion.button>
      </div>
    </aside>
  );
}

