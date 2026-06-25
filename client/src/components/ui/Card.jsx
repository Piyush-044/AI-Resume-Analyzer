import { motion } from 'framer-motion';

export default function Card({ children, className = '', title, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.005 }}
      className={`rounded-2xl glass-panel glass-panel-hover neon-card-glow neon-card-glow-hover p-6 hover:shadow-lg transition-all duration-300 ${className}`}
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

