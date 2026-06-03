import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { featuresService } from '../services/features.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Linkedin, Copy, Check, Sparkles, User, Briefcase, FileText } from 'lucide-react';

export default function LinkedInOptimizer() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState(null);
  
  const [copiedKey, setCopiedKey] = useState('');

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

  const handleOptimize = async () => {
    if (!selectedResumeId) {
      toast.error('Select a resume first');
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const res = await featuresService.optimizeLinkedIn(selectedResumeId);
      setData(res.data.data);
      toast.success('LinkedIn optimization complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to optimize LinkedIn profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(''), 2000);
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <Linkedin className="h-10 w-10 text-blue-200 animate-pulse shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">AI LinkedIn Profile Optimizer</h1>
            <p className="text-blue-100 text-sm">Optimize your profile content to maximize views and rank higher in recruiter searches.</p>
          </div>
        </div>
      </div>

      <Card title="Optimize Configuration">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Select Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              disabled={!resumes.length}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleOptimize} loading={loading} disabled={!resumes.length} className="bg-blue-600 hover:bg-blue-700 text-white">
            Generate LinkedIn Content
          </Button>
        </div>
      </Card>

      {data && (
        <div className="space-y-6 animate-fadeIn">
          {/* Headline Card */}
          <Card className="relative overflow-hidden">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                <Sparkles className="h-5 w-5 text-blue-500" /> Suggested Headline
              </h3>
              <button
                onClick={() => handleCopy(data.headline, 'headline')}
                className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              >
                {copiedKey === 'headline' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200 border-l-4 border-blue-500 pl-4 py-1 italic bg-slate-50 dark:bg-slate-800/40 rounded-r-lg">
              {data.headline}
            </p>
          </Card>

          {/* About Bio Card */}
          <Card>
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                <User className="h-5 w-5 text-blue-500" /> Suggested "About" Summary
              </h3>
              <button
                onClick={() => handleCopy(data.about, 'about')}
                className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              >
                {copiedKey === 'about' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-4">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {data.about}
              </p>
            </div>
          </Card>

          {/* Experience snippets */}
          {data.experienceSnippets && data.experienceSnippets.length > 0 && (
            <Card title="Suggested Experience Descriptions">
              <div className="space-y-4">
                {data.experienceSnippets.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:shadow-sm transition">
                    <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-2 mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">{item.role}</h4>
                        <span className="text-xs text-slate-400 font-semibold">{item.company}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.bullet, `exp-${idx}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
                      >
                        {copiedKey === `exp-${idx}` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/20 px-3 py-2 rounded-lg leading-relaxed">
                      • {item.bullet}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {!data && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center h-full min-h-[250px]">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No content optimized yet</h3>
          <p className="max-w-xs text-sm text-slate-400 mt-1">
            Pick a resume and click the generate button to create professional headlines, summaries, and experience builders.
          </p>
        </div>
      )}
    </div>
  );
}
