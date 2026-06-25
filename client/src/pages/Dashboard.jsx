import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as motionDom } from 'framer-motion';
import { FileText, Target, TrendingUp, Upload, FileSearch, Briefcase, Mail, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardService } from '../services/dashboard.service';
import StatCard from '../components/dashboard/StatCard';
import ScoreChart from '../components/dashboard/ScoreChart';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
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


export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setStats(res.data.data.stats))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  return (
    <motionDom.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Welcome Title */}
      <motionDom.div variants={itemVariants} className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Workspace Hub
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Analyze your progress and scan new resumes.
          </p>
        </div>
      </motionDom.div>

      {/* Asymmetric Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto">
        
        {/* Box 1: Total Resumes Stat */}
        <motionDom.div variants={itemVariants} className="col-span-1">
          <StatCard
            title="Total Resumes"
            value={stats?.totalResumes ?? 0}
            icon={FileText}
            color="primary"
          />
        </motionDom.div>

        {/* Box 2: Latest ATS Score Stat */}
        <motionDom.div variants={itemVariants} className="col-span-1">
          <StatCard
            title="Latest ATS Score"
            value={stats?.latestAtsScore != null ? `${stats.latestAtsScore}%` : '—'}
            icon={Target}
            color="green"
          />
        </motionDom.div>

        {/* Box 3: Recent Analyses Stat */}
        <motionDom.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-1">
          <StatCard
            title="Analyses Run"
            value={stats?.recentAnalyses?.length ?? 0}
            subtitle="Recent session count"
            icon={TrendingUp}
            color="blue"
          />
        </motionDom.div>

        {/* Box 4: Quick Actions (Full vertical span) */}
        <motionDom.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-1 xl:row-span-2">
          <Card title="Quick Modules" className="h-full flex flex-col justify-between">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-3 flex-1 mt-1">
              {[
                { to: '/upload', label: 'Upload Resume', desc: 'Add new resumes', icon: Upload, color: 'indigo' },
                { to: '/analysis', label: 'ATS Analysis', desc: 'Scan compatibility', icon: FileSearch, color: 'emerald' },
                { to: '/job-match', label: 'Job Matching', desc: 'Match specifications', icon: Briefcase, color: 'violet' },
                { to: '/cover-letter', label: 'Generate Cover', desc: 'Tailor custom cover letter', icon: Mail, color: 'pink' },
              ].map(({ to, label, desc, icon: Icon, color }) => {
                const hoverColors = {
                  indigo: 'hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10',
                  emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/5 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/10',
                  violet: 'hover:border-violet-500/40 hover:shadow-violet-500/5 hover:bg-violet-50/10 dark:hover:bg-violet-950/10',
                  pink: 'hover:border-pink-500/40 hover:shadow-pink-500/5 hover:bg-pink-50/10 dark:hover:bg-pink-950/10',
                };
                const textColors = {
                  indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30',
                  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
                  violet: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30',
                  pink: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30',
                };
                return (
                  <motionDom.div
                    key={to}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex"
                  >
                    <Link
                      to={to}
                      className={`w-full flex items-start gap-4 rounded-xl border border-slate-200/60 dark:border-slate-800/50 p-4 transition-all duration-300 ${hoverColors[color]}`}
                    >
                      <div className={`rounded-xl p-3 shrink-0 ${textColors[color]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </Link>
                  </motionDom.div>
                );
              })}
            </div>
          </Card>
        </motionDom.div>

        {/* Box 5: ATS Score Trend (Spans remaining columns) */}
        <motionDom.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card title="ATS Score History Analytics" className="w-full">
            <ScoreChart data={stats?.scoreHistory} />
          </Card>
        </motionDom.div>

        {/* Box 6: Recent Analyses list */}
        <motionDom.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-1">
          <Card title="Recent Analyses Scans" className="h-full">
            {stats?.recentAnalyses?.length ? (
              <div className="space-y-3">
                {stats.recentAnalyses.slice(0, 4).map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/40 bg-white/30 p-3.5 hover:bg-white/60 dark:border-slate-800/30 dark:bg-slate-950/20 dark:hover:bg-slate-900/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-lg bg-indigo-50/60 p-2 dark:bg-indigo-950/20 text-indigo-500 shrink-0">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {a.resumeId?.fileName || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-450 dark:text-slate-500">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                      <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {a.atsScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No analyses yet.</p>
              </div>
            )}
          </Card>
        </motionDom.div>

        {/* Box 7: Job Match History list */}
        <motionDom.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2">
          <Card title="Job Compatibility Logs" className="h-full">
            {stats?.recentJobMatches?.length ? (
              <div className="space-y-3">
                {stats.recentJobMatches.slice(0, 4).map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/40 bg-white/30 p-3.5 hover:bg-white/60 dark:border-slate-800/30 dark:bg-slate-950/20 dark:hover:bg-slate-900/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-lg bg-emerald-50/60 p-2 dark:bg-emerald-950/20 text-emerald-500 shrink-0">
                        <Target className="h-4.5 w-4.5" />
                      </div>
                      <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {m.resumeId?.fileName || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-450 dark:text-slate-500">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                      <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {m.matchScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Target className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No job matches yet.</p>
              </div>
            )}
          </Card>
        </motionDom.div>

      </div>
    </motionDom.div>
  );
}
