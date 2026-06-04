import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:backdrop-blur-sm transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`rounded-xl p-3 transition-transform duration-300 hover:scale-110 ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

