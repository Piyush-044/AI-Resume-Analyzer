import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-primary-600 to-accent-violet text-white hover:from-primary-500 hover:to-accent-violet/90 shadow-md hover:shadow-lg hover:shadow-primary-500/20 border border-primary-500/20 transition-all duration-300',
  secondary: 'bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 hover:bg-white/80 dark:hover:bg-slate-900/60 hover:border-indigo-500/30 dark:hover:border-purple-500/30 shadow-sm transition-all duration-300',
  danger: 'bg-gradient-to-r from-red-600 to-accent-rose text-white hover:from-red-500 hover:to-accent-rose shadow-md hover:shadow-lg hover:shadow-red-500/20 border border-red-500/20 transition-all duration-300',
  ghost: 'text-slate-600 hover:bg-slate-100/50 dark:text-slate-350 dark:hover:bg-slate-900/40 transition-all duration-300',
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

