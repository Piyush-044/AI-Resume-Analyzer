import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { featuresService } from '../services/features.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Briefcase, MapPin, DollarSign, Award, ChevronDown, ChevronUp, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function JobsBoard() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [jobs, setJobs] = useState([]);
  
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    resumeService
      .list()
      .then((res) => {
        const list = res.data.data.resumes;
        setResumes(list);
        if (list.length) setSelectedResumeId(list[0]._id);
      })
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setFetching(false));
  }, []);

  const handleGetRecommendations = async () => {
    if (!selectedResumeId) {
      toast.error('Select a resume first');
      return;
    }
    setLoading(true);
    setJobs([]);
    try {
      const res = await featuresService.getJobRecommendations(selectedResumeId);
      setJobs(res.data.data.jobs || []);
      toast.success('Job recommendations loaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId, jobTitle) => {
    setApplyingJobId(jobId);
    setTimeout(() => {
      setApplyingJobId(null);
      toast.success(`Application sent successfully for ${jobTitle}!`);
    }, 1500);
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <Briefcase className="h-10 w-10 text-orange-200 animate-pulse shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">AI Job Recommendation Feed</h1>
            <p className="text-orange-100 text-sm">Discover recommended jobs tailored to your skills, with match compatibility insights.</p>
          </div>
        </div>
      </div>

      {/* Setup Config */}
      <Card title="Recommendations Settings">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Select Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              disabled={!resumes.length}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleGetRecommendations} loading={loading} disabled={!resumes.length} className="bg-orange-600 hover:bg-orange-700 text-white">
            Find Matching Jobs
          </Button>
        </div>
      </Card>

      {jobs.length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            const scoreColor = job.matchScore >= 80 ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' : job.matchScore >= 60 ? 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900' : 'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900';
            
            return (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Job title & details */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="text-orange-600 dark:text-orange-400 font-bold">{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {job.salary}</span>
                    </div>
                  </div>

                  {/* Match score indicator */}
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${scoreColor}`}>
                    <Award className="h-4 w-4" /> {job.matchScore}% Match
                  </div>
                </div>

                {/* Match criteria detail chips */}
                <div className="grid gap-4 md:grid-cols-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                  {/* Matching skills */}
                  <div>
                    <h4 className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchingSkills?.map((s, i) => (
                        <span key={i} className="rounded px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skills */}
                  <div>
                    <h4 className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                      <XCircle className="h-3.5 w-3.5 text-slate-300" /> Missing Requirements
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {job.missingSkills?.map((s, i) => (
                        <span key={i} className="rounded px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 animate-slideDown">
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2">Job Description</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
                      {job.description}
                    </p>
                  </div>
                )}

                {/* Card controls */}
                <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-55 dark:border-slate-850">
                  <button
                    onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  >
                    {isExpanded ? (
                      <span className="flex items-center gap-1">Collapse Details <ChevronUp className="h-4 w-4" /></span>
                    ) : (
                      <span className="flex items-center gap-1">Expand Details <ChevronDown className="h-4 w-4" /></span>
                    )}
                  </button>
                  <Button
                    onClick={() => handleApply(job.id, job.title)}
                    loading={applyingJobId === job.id}
                    disabled={applyingJobId === job.id}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3.5 py-1.5"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center h-full min-h-[300px]">
          <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No active job matches</h3>
          <p className="max-w-xs text-sm text-slate-400 mt-1">
            Pick a resume above and click "Find Matching Jobs" to browse tailored recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
