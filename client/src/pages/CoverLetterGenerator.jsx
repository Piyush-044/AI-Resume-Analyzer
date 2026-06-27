import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Copy, Check, Sparkles, ChevronDown, FileText, Briefcase } from 'lucide-react';
import { resumeService } from '../services/resume.service';
import { coverLetterService } from '../services/coverLetter.service';
import PageHeader from '../components/ui/PageHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function CoverLetterGenerator() {
  const [resumes, setResumes]               = useState([]);
  const [selectedId, setSelectedId]         = useState('');
  const [jobRole, setJobRole]               = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter]       = useState('');
  const [loading, setLoading]               = useState(false);
  const [copied, setCopied]                 = useState(false);

  useEffect(() => {
    resumeService.list().then((res) => {
      const list = res.data.data.resumes;
      setResumes(list);
      if (list.length) setSelectedId(list[0]._id);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedId || !jobRole.trim()) {
      toast.error('Select resume and enter job role');
      return;
    }
    setLoading(true);
    setCoverLetter('');
    try {
      const res = await coverLetterService.generate({ resumeId: selectedId, jobRole, jobDescription });
      setCoverLetter(res.data.data.coverLetter);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="mx-auto max-w-3xl space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          icon={Mail}
          title="Cover Letter Generator"
          subtitle="Generate personalized professional letters in seconds"
          badge="AI Powered"
          color="pink"
        />
      </motion.div>

      {/* Input Card */}
      <motion.div variants={itemVariants}>
        <div
          className="glass-card rounded-2xl p-6 space-y-5"
          style={{ boxShadow: '0 0 50px -15px rgba(236,72,153,0.15)' }}
        >
          {/* Resume Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <FileText className="h-4 w-4 text-pink-400" />
              Select Resume
            </label>
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white
                           placeholder-slate-600 backdrop-blur-sm transition-all duration-200
                           focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20
                           hover:border-white/20"
                style={{ colorScheme: 'dark' }}
              >
                {resumes.length === 0 && (
                  <option value="" className="bg-gray-900 text-slate-400">No resumes uploaded yet</option>
                )}
                {resumes.map((r) => (
                  <option key={r._id} value={r._id} className="bg-gray-900 text-white">
                    {r.fileName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Job Role */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Briefcase className="h-4 w-4 text-pink-400" />
              Job Role
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white
                         placeholder-slate-600 backdrop-blur-sm transition-all duration-200
                         focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20
                         hover:border-white/20"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <FileText className="h-4 w-4 text-pink-400/70" />
              Job Description
              <span className="text-xs font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              rows={4}
              placeholder="Paste the job description here for a more tailored cover letter..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white
                         placeholder-slate-600 backdrop-blur-sm transition-all duration-200 resize-none
                         focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20
                         hover:border-white/20"
            />
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white
                       transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
              boxShadow: loading
                ? 'none'
                : '0 0 30px rgba(236,72,153,0.4), 0 4px 20px rgba(236,72,153,0.3)',
            }}
          >
            {!loading && (
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5 }}
              />
            )}
            <span className="relative flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Animated Progress Bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-full"
            style={{ height: '3px', background: 'rgba(255,255,255,0.05)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6366f1, #ec4899, #6366f1)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                width: ['0%', '70%', '90%'],
              }}
              transition={{
                backgroundPosition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
                width: { duration: 4, ease: 'easeInOut' },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output Card */}
      <AnimatePresence>
        {coverLetter && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="glass-card rounded-2xl p-6"
              style={{ boxShadow: '0 0 50px -15px rgba(236,72,153,0.12)' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background: 'rgba(236,72,153,0.12)',
                      border: '1px solid rgba(236,72,153,0.25)',
                    }}
                  >
                    <Mail className="h-4 w-4 text-pink-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">Your Cover Letter</h3>
                </div>

                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5
                             px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-sm
                             transition-all duration-200 hover:border-pink-500/40 hover:text-pink-300"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5 text-pink-400" />
                        Copied!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              <div
                className="mb-4 h-px w-full"
                style={{ background: 'linear-gradient(90deg, rgba(236,72,153,0.3), transparent)' }}
              />

              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                {coverLetter}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
