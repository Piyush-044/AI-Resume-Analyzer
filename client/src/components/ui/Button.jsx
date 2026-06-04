import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-500/10 hover:shadow-primary-500/20',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/10 hover:shadow-red-500/20',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </motion.button>
  );
}

