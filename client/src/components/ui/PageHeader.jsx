import { motion } from 'framer-motion';

export default function PageHeader({ icon: Icon, title, subtitle, badge, color = 'indigo' }) {
  const colors = {
    indigo: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', text: '#818cf8', glow: '0 0 30px rgba(99,102,241,0.3)' },
    cyan:   { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.25)',  text: '#22d3ee', glow: '0 0 30px rgba(6,182,212,0.3)' },
    violet: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa', glow: '0 0 30px rgba(139,92,246,0.3)' },
    emerald:{ bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#34d399', glow: '0 0 30px rgba(16,185,129,0.3)' },
    pink:   { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', text: '#f472b6', glow: '0 0 30px rgba(236,72,153,0.3)' },
    amber:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', glow: '0 0 30px rgba(245,158,11,0.3)' },
  };
  const c = colors[color] || colors.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-center gap-4"
    >
      {Icon && (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: c.glow }}
        >
          <Icon className="h-7 w-7" style={{ color: c.text }} />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{title}</h2>
          {badge && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
