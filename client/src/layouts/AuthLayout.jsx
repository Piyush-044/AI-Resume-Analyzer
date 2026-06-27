import { Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuroraBackground from '../components/ui/AuroraBackground';
import ParticleCanvas from '../components/ui/ParticleCanvas';
import SpotlightCursor from '../components/ui/SpotlightCursor';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#030712] p-4">
      <AuroraBackground className="-z-10" />
      <SpotlightCursor />

      {/* Particle background */}
      <div className="absolute inset-0 -z-5 opacity-40">
        <ParticleCanvas />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 -z-10 dot-grid opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-4"
          >
            <Zap className="h-7 w-7 text-white" />
            <div className="absolute inset-0 rounded-2xl animate-glow-pulse" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-shimmer">ResumeAI</h1>
          <p className="text-xs text-slate-500 mt-1 tracking-wider uppercase">Next-Gen AI Resume Engine</p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
