import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Zap, Target, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { analysisService } from '../services/analysis.service';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import AtsScoreGauge from '../components/analysis/AtsScoreGauge';
import SkillsList from '../components/analysis/SkillsList';
import PageHeader from '../components/ui/PageHeader';

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

function ListCard({ icon: Icon, title, items = [], color = 'indigo' }) {
  const colors = {
    indigo: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.2)', text: '#818cf8', dot: 'bg-indigo-400' },
    emerald:{ bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)', text: '#34d399', dot: 'bg-emerald-400' },
    red:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.2)',  text: '#f87171', dot: 'bg-red-400' },
    amber:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', text: '#fbbf24', dot: 'bg-amber-400' },
  };
  const c = colors[color];
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon className="h-4.5 w-4.5" style={{ color: c.text }} />
        </div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items?.map((item, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2.5 text-sm text-slate-300 rounded-lg px-3 py-2 bg-white/[0.03] border border-white/[0.04]">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />
            {item}
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

export default function AtsAnalysis() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    resumeService.list().then((res) => {
      const list = res.data.data.resumes;
      setResumes(list);
      if (list.length) setSelectedId(list[0]._id);
    }).catch(() => toast.error('Failed to load resumes')).finally(() => setFetching(false));
  }, []);

  const runAnalysis = async () => {
    if (!selectedId) { toast.error('Select a resume first'); return; }
    setLoading(true); setAnalysis(null);
    try {
      const res = await analysisService.runATS(selectedId);
      setAnalysis(res.data.data.analysis);
      toast.success('ATS analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-24"><Spinner /></div>;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="mx-auto max-w-5xl space-y-6">
      <PageHeader icon={FileSearch} title="ATS Analysis" subtitle="Deep-scan your resume against ATS algorithms" badge="AI Powered" color="indigo" />

      {/* Control Card */}
      <motion.div variants={fadeUp}>
        <Card glow={loading} tilt>
          {resumes.length ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Resume</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                >
                  {resumes.map((r) => <option key={r._id} value={r._id} className="bg-slate-900">{r.fileName}</option>)}
                </select>
              </div>
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white btn-primary-glow disabled:opacity-50 transition-all"
              >
                {loading ? <><Spinner className="h-4 w-4" /> Analyzing...</> : <><Zap className="h-4 w-4" /> Analyze Resume</>}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-slate-400">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <p className="text-sm">Upload a resume first to run ATS analysis.</p>
            </div>
          )}

          {/* Loading scanner */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '60%' }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 text-center">Gemini AI is scanning your resume...</p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Results */}
      {analysis && (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
          {/* Score + overview row */}
          <motion.div variants={fadeUp} className="grid gap-5 lg:grid-cols-3">
            <Card className="flex items-center justify-center lg:col-span-1">
              <AtsScoreGauge score={analysis.atsScore} />
            </Card>
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
              {[
                { icon: TrendingUp, label: 'ATS Score', val: `${analysis.atsScore}%`, color: '#818cf8' },
                { icon: Target, label: 'Skills Matched', val: `${(analysis.presentSkills || []).length} found`, color: '#34d399' },
                { icon: AlertTriangle, label: 'Missing Skills', val: `${(analysis.missingSkills || []).length} gaps`, color: '#f87171' },
                { icon: Lightbulb, label: 'Suggestions', val: `${(analysis.suggestions || []).length} tips`, color: '#fbbf24' },
              ].map(({ icon: Icon, label, val, color }) => (
                <Card key={label} className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                    <p className="text-lg font-bold text-white">{val}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Detail cards */}
          <motion.div variants={fadeUp}>
            <Card>
              <SkillsList title="Missing Skills" items={analysis.missingSkills} variant="missing" />
            </Card>
          </motion.div>
          <motion.div variants={fadeUp} className="grid gap-5 md:grid-cols-3">
            <ListCard icon={TrendingUp} title="Strengths" items={analysis.strengths} color="emerald" />
            <ListCard icon={AlertTriangle} title="Weaknesses" items={analysis.weaknesses} color="red" />
            <ListCard icon={Lightbulb} title="Suggestions" items={analysis.suggestions} color="amber" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
