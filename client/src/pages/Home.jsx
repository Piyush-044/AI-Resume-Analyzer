import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSearch, Briefcase, PenLine, Mail, Zap, Shield } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: FileSearch, title: 'ATS Analysis', desc: 'Get your ATS score with actionable insights' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Compare your resume against any job description' },
  { icon: PenLine, title: 'AI Rewriter', desc: 'Improve bullet points for ATS compatibility' },
  { icon: Mail, title: 'Cover Letters', desc: 'Generate tailored cover letters instantly' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-grid-pattern min-h-screen">
      {/* Background Aura */}
      <div className="absolute top-[-10%] left-1/2 -z-10 h-[500px] w-[80vw] max-w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-400/20 via-indigo-500/20 to-purple-500/20 blur-[120px] dark:from-primary-600/10 dark:via-indigo-600/10 dark:to-purple-600/10 animate-gradient-xy" />

      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-6xl px-4 py-24 text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white leading-none">
          Land more interviews with{' '}
          <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-400">
            AI-powered
          </span>{' '}
          resume analysis
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-350">
          Upload your resume, get ATS scores, match job descriptions, rewrite bullets, and generate
          cover letters — all powered by Google Gemini.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register">
            <Button className="px-8 py-3 text-base shadow-lg shadow-primary-500/20">Start Free</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="px-8 py-3 text-base">
              Sign In
            </Button>
          </Link>
        </div>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 dark:bg-slate-950/20"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.15)',
                borderColor: 'rgba(99, 102, 241, 0.3)'
              }}
              className="rounded-xl border border-slate-200 bg-white/60 p-6 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/40 transition-colors duration-300"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-slate-800/80 dark:text-primary-400">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-6xl px-4 py-20"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex gap-4 rounded-xl border border-slate-200 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/30">
            <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-950/40 shrink-0">
              <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold dark:text-white">Instant AI Analysis</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
                Powered by Google Gemini for fast, accurate resume insights.
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl border border-slate-200 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/30">
            <div className="rounded-lg bg-teal-50 p-2 dark:bg-teal-950/40 shrink-0">
              <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold dark:text-white">Secure & Private</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
                JWT authentication, encrypted passwords, and secure file uploads.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

