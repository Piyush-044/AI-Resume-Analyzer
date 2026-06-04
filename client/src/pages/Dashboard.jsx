import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Target, TrendingUp } from 'lucide-react';
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
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Resumes"
          value={stats?.totalResumes ?? 0}
          icon={FileText}
          color="primary"
        />
        <StatCard
          title="Latest ATS Score"
          value={stats?.latestAtsScore != null ? `${stats.latestAtsScore}%` : '—'}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Analyses Run"
          value={stats?.recentAnalyses?.length ?? 0}
          subtitle="Recent"
          icon={TrendingUp}
          color="blue"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <Card title="ATS Score Trend">
          <ScoreChart data={stats?.scoreHistory} />
        </Card>
        <Card title="Quick Actions">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { to: '/upload', label: 'Upload Resume' },
              { to: '/analysis', label: 'Run ATS Analysis' },
              { to: '/job-match', label: 'Match Job Description' },
              { to: '/cover-letter', label: 'Generate Cover Letter' },
            ].map(({ to, label }) => (
              <motion.div
                key={to}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex"
              >
                <Link
                  to={to}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-3 text-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800/80 transition-colors duration-200"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Analyses">
          {stats?.recentAnalyses?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                    <th className="pb-2 font-semibold">Resume</th>
                    <th className="pb-2 font-semibold">Score</th>
                    <th className="pb-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAnalyses.map((a) => (
                    <tr key={a._id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                      <td className="py-2.5 text-slate-800 dark:text-slate-200">{a.resumeId?.fileName || '—'}</td>
                      <td className="py-2.5 font-semibold text-primary-600 dark:text-primary-400">{a.atsScore}%</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No analyses yet.</p>
          )}
        </Card>
        <Card title="Job Match History">
          {stats?.recentJobMatches?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                    <th className="pb-2 font-semibold">Resume</th>
                    <th className="pb-2 font-semibold">Match</th>
                    <th className="pb-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentJobMatches.map((m) => (
                    <tr key={m._id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                      <td className="py-2.5 text-slate-800 dark:text-slate-200">{m.resumeId?.fileName || '—'}</td>
                      <td className="py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">{m.matchScore}%</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No job matches yet.</p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

