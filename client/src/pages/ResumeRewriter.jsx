import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Copy, CheckCheck, Sparkles, ChevronRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { rewriterService } from '../services/rewriter.service';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import PageHeader from '../components/ui/PageHeader';

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

function BulletItem({ text, index }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 hover:border-violet-500/20 hover:bg-violet-500/5 transition-all duration-200"
    >
      <ChevronRight className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
      <span className="text-sm text-slate-200 leading-relaxed flex-1">{text}</span>
      <button onClick={copy} className="shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-all opacity-0 group-hover:opacity-100">
        {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </motion.li>
  );
}

export default function ResumeRewriter() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [bulletsText, setBulletsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resumeService.list().then((res) => {
      const list = res.data.data.resumes;
      setResumes(list);
      if (list.length) setSelectedId(list[0]._id);
    });
  }, []);

  const handleRewrite = async () => {
    if (!selectedId) { toast.error('Select a resume'); return; }
    setLoading(true); setResult(null);
    try {
      const bullets = bulletsText.split('\n').map((b) => b.trim()).filter(Boolean);
      const res = await rewriterService.rewrite({ resumeId: selectedId, bullets: bullets.length ? bullets : undefined });
      setResult(res.data.data);
      toast.success('Bullets rewritten!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rewrite failed');
    } finally { setLoading(false); }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="mx-auto max-w-3xl space-y-6">
      <PageHeader icon={PenLine} title="AI Resume Rewriter" subtitle="Enhance your bullet points for maximum ATS impact" badge="Gemini AI" color="violet" />

      <motion.div variants={fadeUp}>
        <Card tilt>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Resume</label>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none transition-all">
                {resumes.map((r) => <option key={r._id} value={r._id} className="bg-slate-900">{r.fileName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Bullet Points <span className="text-slate-600 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                rows={6}
                placeholder={"• Led team of 5 engineers\n• Increased performance by 40%\n\nLeave empty to extract from resume automatically"}
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none resize-none transition-all font-mono"
              />
            </div>
            <button
              onClick={handleRewrite}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white btn-primary-glow disabled:opacity-50 transition-all"
            >
              {loading ? <><Spinner className="h-4 w-4" /> Rewriting with AI...</> : <><Sparkles className="h-4 w-4" /> Rewrite Bullets</>}
            </button>
          </div>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5">
              <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '60%' }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 text-center">Gemini is rewriting your bullets...</p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      <AnimatePresence>
        {result?.bullets && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            <Card>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <h3 className="font-bold text-white text-sm">AI-Improved Bullets</h3>
                  <span className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
                    {result.bullets.length} bullets
                  </span>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(result.bullets.join('\n')); toast.success('All copied!'); }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 transition-colors px-2 py-1 rounded-lg hover:bg-violet-500/10"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy All
                </button>
              </div>
              <ul className="space-y-2.5">
                {result.bullets.map((b, i) => <BulletItem key={i} text={b} index={i} />)}
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
