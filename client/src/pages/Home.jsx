import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSearch, Briefcase, PenLine, Mail, Zap, Shield, Sparkles, FileText, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: FileSearch, title: 'ATS Analysis', desc: 'Get your ATS score with actionable keyword insights', color: 'indigo' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Compare your resume against any job description details', color: 'cyan' },
  { icon: PenLine, title: 'AI Rewriter', desc: 'Improve resume bullet points for high ATS compatibility', color: 'violet' },
  { icon: Mail, title: 'Cover Letters', desc: 'Generate customized, professional cover letters instantly', color: 'fuchsia' },
];

export default function Home() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineX, setShineX] = useState(50);
  const [shineY, setShineY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rX = ((y / rect.height) - 0.5) * -15; // Limit rotation to 15deg
    const rY = ((x / rect.width) - 0.5) * 15;
    setRotateX(rX);
    setRotateY(rY);

    setShineX((x / rect.width) * 100);
    setShineY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShineX(50);
    setShineY(50);
    setIsHovered(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#030712] dark:via-[#080d1a] dark:to-[#020408] transition-colors duration-500">
      
      {/* Background Animated Cyber Grid */}
      <div className="absolute inset-0 -z-10 cyber-grid opacity-70 pointer-events-none" />

      {/* Rotating Radial Light Blobs */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[130px] animate-pulse-subtle pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] -z-10 h-[700px] w-[700px] rounded-full bg-purple-500/10 blur-[150px] animate-pulse-subtle pointer-events-none" style={{ animationDelay: '2s' }} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Text Intro Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/35 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Next-Gen AI Resume Engine v2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white leading-[1.05]"
            >
              Transform your resume into a{' '}
              <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-accent-cyan bg-clip-text text-transparent drop-shadow-sm">
                Career Magnet
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-lg text-slate-600 dark:text-slate-350 leading-relaxed font-medium"
            >
              Don't guess what recruiters want. Scan your resume with our deep-learning parsing parser, identify key skill gaps, and optimize for ATS algorithms automatically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/register">
                <Button className="px-8 py-4 text-base font-semibold shadow-lg shadow-indigo-500/25">
                  Get Started Free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="px-8 py-4 text-base font-semibold border-slate-300 dark:border-slate-800">
                  Access Portal
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Holographic 3D Interactive Scanner Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
              className="relative w-full max-w-[380px] h-[480px] perspective-1000"
            >
              {/* Glowing Background Light Aura behind the card */}
              <div className="absolute inset-0 -z-5 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-[40px] transition-opacity duration-300 group-hover:opacity-30" />

              {/* The 3D Interactive Card Body */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setIsHovered(true)}
                style={{
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.1, 0.8, 0.2, 1)',
                }}
                className="relative w-full h-full rounded-3xl border border-white/30 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/40 dark:bg-slate-900/40 preserve-3d cursor-pointer"
              >
                {/* Virtual Light Reflection Layer */}
                <div
                  style={{
                    background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`,
                  }}
                  className="absolute inset-0 rounded-3xl pointer-events-none z-10"
                />

                {/* Cyber Scanner Laser Lines (Only animates on Hover) */}
                {isHovered && (
                  <div className="absolute inset-x-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser z-20" />
                )}

                {/* Visual Content Inside Card */}
                <div className="flex flex-col h-full justify-between translate-z-20">
                  {/* Card Header */}
                  <div className="flex justify-between items-center">
                    <FileText className="h-9 w-9 text-indigo-500" />
                    <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  </div>

                  {/* Card Center: Scanning target area */}
                  <div className="my-auto flex flex-col items-center py-6 border border-dashed border-indigo-500/30 rounded-2xl bg-indigo-500/5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
                      <Briefcase className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">ATS SCANNER</span>
                    <span className="text-xs text-slate-400 mt-1">Drag Resume Here</span>
                  </div>

                  {/* Card Footer: Holographic Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>SCAN SPEED</span>
                      <span className="text-cyan-400">1.2ms</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full w-3/4 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-mono">
                      SYSTEM ONLINE - GEMINI FLASH 1.5
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* Bento Grid Feature List */}
      <section className="py-24 border-t border-slate-200/50 bg-white/20 backdrop-blur-md dark:border-slate-800/30 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Professional Capabilities
            </h2>
            <p className="mx-auto max-w-xl text-slate-500 dark:text-slate-400">
              Everything you need to bypass applicant tracking algorithms and stand out.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, color }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -6,
                  scale: 1.01,
                  boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.18)',
                  borderColor: 'rgba(99, 102, 241, 0.4)'
                }}
                className="group relative rounded-2xl border border-slate-200 bg-white/40 p-8 text-left backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/30 transition-all duration-300"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform duration-300 dark:bg-slate-800/80 dark:text-indigo-400">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Trust Badges */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="grid gap-8 md:grid-cols-2">
          
          <div className="flex gap-5 rounded-2xl border border-slate-200 bg-white/30 p-8 text-left backdrop-blur-sm dark:border-slate-800/30 dark:bg-slate-900/20">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-500 shrink-0 dark:bg-indigo-950/40">
              <Zap className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">AI-Powered Parsing</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Integrated directly with Google Gemini 1.5 Flash for advanced real-time text analysis.
              </p>
            </div>
          </div>

          <div className="flex gap-5 rounded-2xl border border-slate-200 bg-white/30 p-8 text-left backdrop-blur-sm dark:border-slate-800/30 dark:bg-slate-900/20">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-500 shrink-0 dark:bg-teal-950/40">
              <Shield className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Secure Data Vault</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Your data is safe. End-to-end token validation ensures resumes remain private.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
