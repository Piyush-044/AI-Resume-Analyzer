import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, Zap, CheckCircle2, XCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { jobMatchService } from '../services/jobMatch.service';
import Card from '../components/ui/Card';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';
import SkillsList from '../components/analysis/SkillsList';
import PageHeader from '../components/ui/PageHeader';

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-black text-white"
          >
            {score}%
          </motion.span>
          <span className="text-xs font-semibold text-slate-400">MATCH SCORE</span>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold border`}
        style={{ color, borderColor: `${color}40`, background: `${color}15` }}>
        {score >= 70 ? '✅ Strong Match' : score >= 40 ? '⚠️ Partial Match' : '❌ Weak Match'}
      </div>
    </div>
  );
}

export default function JobMatching() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    resumeService.list().then((res) => {
      const list = res.data.data.resumes;
      setResumes(list);
      if (list.length) setSelectedId(list[0]._id);
    }).finally(() => setFetching(false));
  }, []);

  const handleMatch = async () => {
    if (!selectedId || jobDescription.length < 50) { toast.error('Select resume and paste job description (min 50 chars)'); return; }
    setLoading(true); setMatch(null);
    try {
      const res = await jobMatchService.create({ resumeId: selectedId, jobDescription });
      setMatch(res.data.data.match);
      toast.success('Job match complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Match failed');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-24"><Spinner /></div>;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={Briefcase} title="Job Matching" subtitle="Compare your resume against any job description" badge="AI Match" color="cyan" />

      <motion.div variants={fadeUp}>
        <Card tilt>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Resume</label>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} disabled={!resumes.length}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-all">
                {resumes.map((r) => <option key={r._id} value={r._id} className="bg-slate-900">{r.fileName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Description</label>
              <textarea
                rows={7}
                placeholder="Paste the full job description here — the more detail, the better the match..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none resize-none transition-all"
              />
            </div>
            <button
              onClick={handleMatch}
              disabled={loading || !resumes.length}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white btn-primary-glow disabled:opacity-50 transition-all"
            >
              {loading ? <><Spinner className="h-4 w-4" /> Matching...</> : <><Target className="h-4 w-4" /> Compare with Resume</>}
            </button>
          </div>
        </Card>
      </motion.div>

      {match && (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreRing score={match.matchScore} />
                <div className="flex-1 space-y-3 w-full">
                  <p className="text-sm font-semibold text-slate-300 mb-4">Score Breakdown</p>
                  {[
                    { label: 'Keyword Alignment', pct: Math.min(100, match.matchScore + 5), color: '#6366f1' },
                    { label: 'Skills Coverage', pct: Math.min(100, match.matchScore - 5), color: '#22d3ee' },
                    { label: 'Role Compatibility', pct: match.matchScore, color: '#a78bfa' },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-400">{label}</span>
                        <span style={{ color }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(to right, ${color}, ${color}88)`, boxShadow: `0 0 8px ${color}60` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={fadeUp} className="grid gap-5 md:grid-cols-2">
            <Card><SkillsList title="Missing Skills" items={match.missingSkills} variant="missing" /></Card>
            <Card><SkillsList title="Recommended Skills" items={match.recommendedSkills} variant="recommended" /></Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
