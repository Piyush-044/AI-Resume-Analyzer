import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Header({ title, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl px-4 py-3.5 lg:px-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/10 lg:hidden transition-all"
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <div className="flex items-center gap-2">
          {/* Active dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)] animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.h1
              key={title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="text-lg font-bold tracking-tight text-white"
            >
              {title}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -12, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 12, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              {theme === 'light'
                ? <Moon className="h-4.5 w-4.5 text-indigo-400" />
                : <Sun className="h-4.5 w-4.5 text-amber-400" />
              }
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </header>
  );
}
