import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 glow-shadow-primary',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 glow-shadow-emerald',
    blue: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 glow-shadow-violet',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-2xl border border-slate-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-md hover:shadow-md hover:border-slate-300/60 dark:border-slate-800/40 dark:bg-slate-900/40 dark:hover:border-slate-700/60 dark:backdrop-blur-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-550 uppercase">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="relative shrink-0">
            {/* Ambient Radial Icon Glow */}
            <div className={`absolute inset-0 rounded-full opacity-60 blur-md pointer-events-none icon-glow-${color === 'primary' ? 'indigo' : color === 'green' ? 'emerald' : 'violet'}`} />
            
            <div className={`relative z-10 rounded-2xl p-3 transition-all duration-350 hover:rotate-6 ${colors[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

