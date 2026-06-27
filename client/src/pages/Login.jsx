import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, Zap, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Logo icon */}
      <motion.div variants={itemVariants} className="mb-6 flex justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)',
            border: '1px solid rgba(99,102,241,0.35)',
            boxShadow: '0 0 30px rgba(99,102,241,0.3)',
          }}
        >
          <Zap className="h-7 w-7 text-indigo-400" />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div variants={itemVariants} className="mb-1 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome{' '}
          <span className="text-shimmer">back</span>
        </h2>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="mb-8 text-center text-sm text-slate-400"
      >
        Sign in to your ResumeAI account
      </motion.p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <motion.div variants={itemVariants} className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Mail className="h-3.5 w-3.5 text-indigo-400" />
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white
                       placeholder-slate-600 backdrop-blur-sm transition-all duration-200
                       focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                       hover:border-white/20"
          />
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants} className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Lock className="h-3.5 w-3.5 text-indigo-400" />
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white
                       placeholder-slate-600 backdrop-blur-sm transition-all duration-200
                       focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                       hover:border-white/20"
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants} className="pt-1">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-primary-glow relative w-full overflow-hidden rounded-xl py-3.5 text-sm
                       font-bold text-white transition-all duration-300 disabled:cursor-not-allowed
                       disabled:opacity-60"
          >
            {/* Shimmer sweep */}
            {!loading && (
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              />
            )}
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </form>

      {/* Register link */}
      <motion.p
        variants={itemVariants}
        className="mt-6 text-center text-sm text-slate-500"
      >
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline underline-offset-2"
        >
          Create one free
        </Link>
      </motion.p>
    </motion.div>
  );
}
