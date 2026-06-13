import { motion } from 'framer-motion';

export default function Card({ children, className = '', title, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border border-slate-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-md hover:shadow-md hover:border-slate-300/60 dark:border-slate-800/40 dark:bg-slate-900/40 dark:hover:border-slate-700/60 dark:backdrop-blur-lg transition-all duration-300 ${className}`}
    >
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between">
          {title && <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}

