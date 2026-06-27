import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Card({ children, className = '', title, action, glow = false, tilt = false }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    if (!tilt) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const shine = `radial-gradient(circle at ${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%, rgba(99,102,241,0.07) 0%, transparent 60%)`;
    setStyle({ transform: `perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`, '--shine': shine });
  };

  const handleLeave = () => {
    if (!tilt) return;
    setStyle({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)', '--shine': 'none' });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        transition: style.transform?.includes('0deg') ? 'transform 0.5s cubic-bezier(0.1,0.8,0.2,1)' : 'none',
      }}
      className={`
        relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl
        shadow-[0_4px_32px_rgba(0,0,0,0.3)] p-6
        hover:border-indigo-500/20 hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)]
        transition-all duration-300 overflow-hidden
        ${glow ? 'animate-glow-pulse' : ''}
        ${className}
      `}
    >
      {/* Shine layer for tilt */}
      {tilt && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{ background: 'var(--shine, none)' }} />
      )}

      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {(title || action) && (
        <div className="mb-5 flex items-center justify-between relative z-10">
          {title && (
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
