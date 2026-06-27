import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  FileSearch, Briefcase, PenLine, Mail, Zap, Shield, Sparkles,
  FileText, ArrowRight, CheckCircle, Star, Users, TrendingUp,
  Brain, Target, Cpu, Globe, ChevronRight, Play, BarChart3,
  Layers, Code2, Rocket
} from 'lucide-react';
import TypewriterText from '../components/ui/TypewriterText';
import ParticleCanvas from '../components/ui/ParticleCanvas';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import AuroraBackground from '../components/ui/AuroraBackground';
import MagneticButton from '../components/ui/MagneticButton';

/* ── DATA ── */
const FEATURES = [
  {
    icon: FileSearch, title: 'ATS Analysis', color: 'indigo',
    desc: 'Deep-learning ATS parser identifies keyword gaps and compatibility score in seconds.',
    badge: '95% Accuracy',
  },
  {
    icon: Target, title: 'Job Matching', color: 'cyan',
    desc: 'Intelligent comparison engine matches your resume against any job description.',
    badge: 'Smart Match',
  },
  {
    icon: Brain, title: 'AI Rewriter', color: 'violet',
    desc: 'Gemini AI rewrites bullet points for maximum impact and readability.',
    badge: 'Gemini Powered',
  },
  {
    icon: Mail, title: 'Cover Letters', color: 'pink',
    desc: 'Generate professional, personalized cover letters in under 30 seconds.',
    badge: 'Instant Gen',
  },
  {
    icon: Rocket, title: 'Career Roadmap', color: 'amber',
    desc: 'AI-driven personalized roadmap to your dream role with skill gap analysis.',
    badge: 'Personalized',
  },
  {
    icon: Cpu, title: 'LinkedIn Optimizer', color: 'blue',
    desc: 'Optimize your LinkedIn profile headline, summary and skills for maximum reach.',
    badge: 'Profile Boost',
  },
];

const STATS = [
  { value: 50000, suffix: '+', label: 'Resumes Analyzed', icon: FileText },
  { value: 95, suffix: '%', label: 'ATS Match Rate', icon: TrendingUp },
  { value: 120, suffix: '+', label: 'Job Categories', icon: Briefcase },
  { value: 4.9, suffix: '★', label: 'User Rating', icon: Star },
];

const STEPS = [
  { n: '01', icon: FileText, title: 'Upload Resume', desc: 'Drag & drop your PDF resume or paste the text directly.' },
  { n: '02', icon: Brain, title: 'AI Analyzes', desc: 'Gemini 1.5 Flash parses every section in under 2 seconds.' },
  { n: '03', icon: BarChart3, title: 'Get Insights', desc: 'Receive your ATS score, keyword gaps, and improvement tips.' },
  { n: '04', icon: Rocket, title: 'Land the Job', desc: 'Apply with confidence to your dream companies.' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'Software Engineer @ Google', avatar: 'PS',
    text: 'ResumeAI increased my ATS score from 42% to 91%. Got 3 interview calls in the first week!',
    rating: 5, color: 'indigo',
  },
  {
    name: 'Arjun Mehta', role: 'Product Manager @ Amazon', avatar: 'AM',
    text: 'The job matching feature is insane. It told me exactly which keywords were missing for each role.',
    rating: 5, color: 'violet',
  },
  {
    name: 'Sneha Patel', role: 'Data Scientist @ Microsoft', avatar: 'SP',
    text: 'Cover letter generator saved me hours every day. Quality is genuinely better than I write myself.',
    rating: 5, color: 'cyan',
  },
];

const colorMap = {
  indigo: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', text: '#818cf8', glow: 'rgba(99,102,241,0.3)' },
  cyan:   { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.25)',  text: '#22d3ee', glow: 'rgba(6,182,212,0.3)' },
  violet: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa', glow: 'rgba(139,92,246,0.3)' },
  pink:   { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', text: '#f472b6', glow: 'rgba(236,72,153,0.3)' },
  amber:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', glow: 'rgba(245,158,11,0.3)' },
  blue:   { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa', glow: 'rgba(59,130,246,0.3)' },
};

/* ── TILT CARD ── */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    const shine = `radial-gradient(circle at ${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
    setStyle({ transform: `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(8px)`, '--shine': shine });
  };

  const handleLeave = () => setStyle({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)', '--shine': 'none' });

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ ...style, transition: style.transform?.includes('0deg') ? 'all 0.5s cubic-bezier(0.1,0.8,0.2,1)' : 'none' }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-10" style={{ background: 'var(--shine, none)' }} />
      {children}
    </div>
  );
}

/* ── FLOATING ORBS ── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { size: 6, top: '15%', left: '8%', color: '#6366f1', delay: '0s', dur: '6s' },
        { size: 4, top: '70%', left: '5%', color: '#22d3ee', delay: '1s', dur: '8s' },
        { size: 5, top: '35%', right: '6%', color: '#a78bfa', delay: '2s', dur: '7s' },
        { size: 3, top: '80%', right: '12%', color: '#f472b6', delay: '0.5s', dur: '9s' },
        { size: 4, top: '50%', left: '50%', color: '#6366f1', delay: '3s', dur: '10s' },
      ].map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-slow"
          style={{
            width: `${orb.size * 4}px`,
            height: `${orb.size * 4}px`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            background: orb.color,
            boxShadow: `0 0 ${orb.size * 8}px ${orb.color}`,
            opacity: 0.6,
            animationDelay: orb.delay,
            animationDuration: orb.dur,
          }}
        />
      ))}
    </div>
  );
}

/* ── MAIN HOME ── */
export default function Home() {
  const heroRef = useRef(null);
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [cardHovered, setCardHovered] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  // Scan line animation
  useEffect(() => {
    const id = setInterval(() => setScanLine(p => (p + 1) % 100), 20);
    return () => clearInterval(id);
  }, []);

  const handleCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCardRotate({ x: (y - 0.5) * -18, y: (x - 0.5) * 18 });
    setShinePos({ x: x * 100, y: y * 100 });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712]">
      {/* Global Aurora BG */}
      <AuroraBackground className="-z-10" />

      {/* ══════════════════════════════════
          HERO SECTION
      ══════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Particle Canvas Full BG */}
        <div className="absolute inset-0 -z-5">
          <ParticleCanvas />
        </div>

        {/* Floating Orbs */}
        <FloatingOrbs />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

            {/* ── LEFT CONTENT ── */}
            <div className="lg:col-span-7 space-y-8">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 backdrop-blur-md"
              >
                <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Powered by Google Gemini 1.5 Flash · Next-Gen AI Engine v2.0</span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white"
              >
                Transform your<br />resume into a{' '}
                <span className="text-shimmer">
                  <TypewriterText />
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-xl text-lg text-slate-400 leading-relaxed"
              >
                Don't guess what recruiters want.{' '}
                <span className="text-slate-200 font-medium">Scan, analyze, and optimize</span>{' '}
                your resume with deep-learning AI — built for ATS algorithms that gatekeep 75% of applications.
              </motion.p>

              {/* Trust bullets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-x-6 gap-y-2"
              >
                {['No credit card required', 'Free ATS scan', '10× your interview rate'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <MagneticButton strength={0.3}>
                  <Link to="/register">
                    <button className="relative flex items-center gap-2 px-8 py-4 text-base font-bold rounded-2xl text-white btn-primary-glow overflow-hidden group">
                      <span className="relative z-10 flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Get Started Free
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      {/* Shimmer sweep */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </Link>
                </MagneticButton>

                <MagneticButton strength={0.2}>
                  <Link to="/login">
                    <button className="flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-sm transition-all duration-300">
                      <Play className="h-4 w-4" />
                      See Demo
                    </button>
                  </Link>
                </MagneticButton>
              </motion.div>

              {/* Social Proof Avatars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-3"
              >
                <div className="flex -space-x-2.5">
                  {['PS', 'AM', 'SP', 'RK', 'NJ'].map((init, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-[#030712] flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: `hsl(${220 + i * 25}, 70%, 55%)`, zIndex: 5 - i }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-white font-semibold">50,000+</span> resumes optimized · 
                  <span className="text-yellow-400"> ★★★★★</span> 4.9/5
                </p>
              </motion.div>
            </div>

            {/* ── RIGHT: 3D SCANNER CARD ── */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, type: 'spring', stiffness: 60, delay: 0.2 }}
                className="relative w-full max-w-[380px]"
              >
                {/* Outer glow ring */}
                <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 blur-2xl animate-pulse-subtle" />
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 animate-border-glow" style={{ padding: '1px' }}>
                  <div className="w-full h-full rounded-[2rem] bg-[#030712]" />
                </div>

                {/* Card Body */}
                <div
                  onMouseMove={handleCardMove}
                  onMouseLeave={() => { setCardRotate({ x: 0, y: 0 }); setCardHovered(false); }}
                  onMouseEnter={() => setCardHovered(true)}
                  style={{
                    transform: `perspective(1000px) rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg)`,
                    transition: cardHovered ? 'none' : 'transform 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)',
                  }}
                  className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-2xl overflow-hidden cursor-pointer"
                >
                  {/* Shine layer */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.07) 0%, transparent 55%)` }}
                  />

                  {/* Scanning laser */}
                  {cardHovered && (
                    <div
                      className="absolute inset-x-0 h-[2px] z-20 pointer-events-none"
                      style={{
                        top: `${scanLine}%`,
                        background: 'linear-gradient(to right, transparent, #22d3ee, transparent)',
                        boxShadow: '0 0 12px #22d3ee, 0 0 30px rgba(34,211,238,0.4)',
                      }}
                    />
                  )}

                  {/* Corner brackets */}
                  {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-4 h-4 border-indigo-500/60`}
                      style={{
                        borderTopWidth: i < 2 ? '2px' : '0',
                        borderBottomWidth: i >= 2 ? '2px' : '0',
                        borderLeftWidth: i % 2 === 0 ? '2px' : '0',
                        borderRightWidth: i % 2 === 1 ? '2px' : '0',
                      }}
                    />
                  ))}

                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white tracking-wide">RESUME SCANNER</p>
                        <p className="text-[10px] text-slate-500 font-mono">v2.0 · NEURAL MODE</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Score Ring */}
                  <div className="flex flex-col items-center py-6 mb-6">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="6" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="6"
                          strokeLinecap="round" strokeDasharray="263.9" strokeDashoffset="28"
                          className="animate-[spin_8s_linear_infinite]"
                          style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#22d3ee" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">89%</span>
                        <span className="text-[10px] text-indigo-400 font-bold tracking-wider">ATS SCORE</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-3">
                    {[
                      { label: 'Keyword Match', pct: 88, color: '#6366f1' },
                      { label: 'Formatting', pct: 95, color: '#22d3ee' },
                      { label: 'Skills Align', pct: 78, color: '#a78bfa' },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-[11px] font-semibold mb-1">
                          <span className="text-slate-400">{label}</span>
                          <span style={{ color }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full animate-pulse-subtle"
                            style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}, ${color}88)`, boxShadow: `0 0 8px ${color}60` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">GEMINI · NEURAL PARSE</span>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] text-cyan-400 font-mono">ONLINE</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS BAR
      ══════════════════════════════════ */}
      <section className="relative py-16 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-cyan-500/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, suffix, label, icon: Icon }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="stat-card text-center group"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-300">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <div className="text-4xl font-black text-white mb-1">
                  <AnimatedCounter target={value} suffix={suffix} duration={2200} />
                </div>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════ */}
      <section id="features" className="relative py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
              <Layers className="h-3.5 w-3.5" />
              Professional Capabilities
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Everything you need to{' '}
              <span className="text-gradient-primary">land your dream job</span>
            </h2>
            <p className="mx-auto max-w-xl text-slate-400 text-lg">
              Six powerful AI tools, one unified platform — built to bypass ATS systems and impress recruiters.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc, color, badge }, idx) => {
              const c = colorMap[color];
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <TiltCard className="h-full">
                    <div
                      className="glass-card glass-card-hover h-full rounded-2xl p-7 group"
                      style={{ border: `1px solid ${c.border}20` }}
                    >
                      {/* Badge */}
                      <div className="flex justify-between items-start mb-5">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                          style={{ background: c.bg, boxShadow: `0 0 20px ${c.glow}` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: c.text }} />
                        </div>
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide"
                          style={{ background: `${c.bg}`, borderColor: c.border, color: c.text }}
                        >
                          {badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>

                      {/* Arrow link */}
                      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: c.text }}>
                        <span>Explore feature</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section id="how-it-works" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
              <Cpu className="h-3.5 w-3.5" />
              Simple 4-Step Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              How <span className="text-shimmer">ResumeAI</span> Works
            </h2>
          </motion.div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            {STEPS.map(({ n, icon: Icon, title, desc }, idx) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative text-center group"
              >
                {/* Step circle */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto bg-indigo-500/10 border border-indigo-500/20 group-hover:border-indigo-500/60 group-hover:bg-indigo-500/20 transition-all duration-300">
                  <Icon className="h-7 w-7 text-indigo-400" />
                  {/* Ripple */}
                  <div className="absolute inset-0 rounded-2xl border border-indigo-500/30 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-500" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-indigo-500 text-[10px] font-black text-white flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section id="testimonials" className="relative py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-300">
              <Star className="h-3.5 w-3.5" />
              Real Results, Real People
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Loved by <span className="text-gradient-primary">50,000+ professionals</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, avatar, text, rating, color }, idx) => {
              const c = colorMap[color];
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                >
                  <TiltCard>
                    <div className="glass-card glass-card-hover rounded-2xl p-7 h-full" style={{ border: `1px solid ${c.border}30` }}>
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <p className="text-slate-300 leading-relaxed text-sm mb-6">"{text}"</p>

                      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white"
                          style={{ background: `linear-gradient(135deg, ${c.text}, ${c.glow})` }}
                        >
                          {avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{name}</p>
                          <p className="text-xs text-slate-500">{role}</p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TRUST BADGES ROW
      ══════════════════════════════════ */}
      <section className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                icon: Zap, color: 'indigo',
                title: 'AI-Powered Parsing',
                desc: 'Integrated directly with Google Gemini 1.5 Flash for advanced real-time text analysis and deep contextual understanding.',
              },
              {
                icon: Shield, color: 'cyan',
                title: 'Secure Data Vault',
                desc: 'Your data is 100% safe. End-to-end token validation, zero-retention policy, and encrypted storage at rest.',
              },
            ].map(({ icon: Icon, color, title, desc }) => {
              const c = colorMap[color];
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-5 rounded-2xl border bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:bg-white/[0.06]"
                  style={{ borderColor: `${c.border}30` }}
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                    <Icon className="h-6 w-6" style={{ color: c.text }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FINAL CTA BANNER
      ══════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        {/* Aurora CTA background */}
        <div className="absolute inset-0">
          <div className="aurora-blob" style={{ width: '80%', height: '100%', top: '10%', left: '10%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 40%, transparent 70%)', animationDuration: '12s' }} />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
              <Globe className="h-3.5 w-3.5" />
              Join 50,000+ professionals worldwide
            </div>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight">
              Your next job is{' '}
              <span className="text-shimmer">one upload away</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-xl mx-auto">
              Stop sending resumes into the void. Start getting callbacks. Free forever — no credit card needed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <MagneticButton strength={0.35}>
              <Link to="/register">
                <button className="relative flex items-center gap-2.5 px-10 py-5 text-lg font-bold rounded-2xl text-white btn-primary-glow overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Rocket className="h-5 w-5" />
                    Start Optimizing Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Footer note */}
          <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-indigo-500" />
            Free ATS scan · No signup required for demo · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Resume<span className="text-indigo-400">AI</span></span>
          </div>
          <p className="text-xs text-slate-600">© 2026 ResumeAI · Built with Gemini 1.5 Flash · Made with ♥</p>
          <div className="flex gap-5 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
