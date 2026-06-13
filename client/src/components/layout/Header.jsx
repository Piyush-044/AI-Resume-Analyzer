import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Header({ title, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-200/50 bg-white/70 px-4 py-4 lg:px-8 dark:border-slate-800/40 dark:bg-slate-950/40 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-350 dark:hover:bg-slate-800"
        >
          <Menu className="h-6 w-6" />
        </motion.button>
        <motion.h1
          key={title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          {title}
        </motion.h1>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="relative overflow-hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ y: -15, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 15, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
          >
            {theme === 'light' ? <Moon className="h-5 w-5 text-indigo-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </header>
  );
}

