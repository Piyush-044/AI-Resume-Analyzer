import { motion } from 'framer-motion';

export default function Card({ children, className = '', title, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:backdrop-blur-md transition-shadow duration-300 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}

