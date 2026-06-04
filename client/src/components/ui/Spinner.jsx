import { motion } from 'framer-motion';

export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className={`rounded-full border-[3px] border-primary-500/10 border-t-primary-500 border-r-indigo-500 ${className}`}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
        className={`absolute rounded-full border-[2px] border-purple-500/10 border-t-purple-500 border-b-pink-500 ${className}`}
        style={{ width: '60%', height: '60%' }}
      />
    </div>
  );
}

