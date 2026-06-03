import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { careerService } from '../services/career.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Route, BookOpen, Award, Code, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function CareerRoadmap() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [targetRole, setTargetRole] = useState('');
  
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);
  
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    resumeService
      .list()
      .then((res) => {
        const list = res.data.data.resumes;
        setResumes(list);
        if (list.length) setSelectedResumeId(list[0]._id);
      })
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setFetchingResumes(false));
  }, []);

  const handleGenerateRoadmap = async () => {
    if (!selectedResumeId || !targetRole.trim()) {
      toast.error('Select a resume and input your target career role');
      return;
    }
    setLoadingRoadmap(true);
    setRoadmap(null);
    try {
      const res = await careerService.roadmap(selectedResumeId, targetRole);
      setRoadmap(res.data.data);
      toast.success('Roadmap generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate career roadmap');
    } finally {
      setLoadingRoadmap(false);
    }
  };

  if (fetchingResumes) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <Route className="h-10 w-10 text-emerald-200 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold">AI Career Roadmap Generator</h1>
            <p className="text-emerald-100 text-sm">Generate a customized upskilling timeline to transition into your desired career role.</p>
          </div>
        </div>
      </div>

      {/* Setup Panel */}
      <Card title="Upskilling Plan Configuration">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Select Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              disabled={!resumes.length}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Desired Target Role</label>
            <input
              type="text"
              placeholder="e.g. Senior DevOps Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-1">
            <Button
              onClick={handleGenerateRoadmap}
              loading={loadingRoadmap}
              disabled={!resumes.length || !targetRole.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Generate Roadmap
            </Button>
          </div>
        </div>
      </Card>

      {/* Roadmap Output */}
      {roadmap && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-1.5">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Target Role Roadmap: <span className="text-emerald-600">{roadmap.targetRole}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">A step-by-step master plan tailored from your current experience.</p>
          </div>

          <div className="relative pl-6 md:pl-10 space-y-8">
            {/* Timeline vertical bar */}
            <div className="absolute left-[30px] md:left-[38px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-400 to-indigo-500" />

            {roadmap.phases?.map((p, idx) => (
              <div key={idx} className="relative group">
                {/* Milestone Node */}
                <div className="absolute -left-9 md:-left-[54px] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-emerald-500 shadow-md transition group-hover:scale-110">
                  <span className="text-xs font-bold text-emerald-700">{p.phaseNumber}</span>
                </div>

                {/* Milestone Details Card */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 pb-3 mb-4">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition">
                      {p.title}
                    </h3>
                    <span className="mt-1 md:mt-0 text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block self-start">
                      Phase {p.phaseNumber}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Skills & Resources */}
                    <div className="space-y-4">
                      {/* Skills to learn */}
                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" /> Core Skills to Master
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {p.skillsToLearn?.map((s, i) => (
                            <span key={i} className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                          <BookOpen className="h-4 w-4 text-emerald-500" /> Learning Resources
                        </h4>
                        <ul className="space-y-1.5">
                          {p.resources?.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                              <ArrowRight className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Project Idea card */}
                    <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-50/50 border border-slate-100 p-4">
                      <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-500 mb-2">
                        <Code className="h-4 w-4 text-indigo-500" /> Suggested Portfolio Project
                      </h4>
                      <h5 className="text-sm font-bold text-slate-800 mb-1">
                        {p.projectIdea?.title}
                      </h5>
                      <p className="text-xs leading-relaxed text-slate-500">
                        {p.projectIdea?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
            <div className="flex items-start gap-3">
              <Award className="h-6 w-6 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-violet-900">Career Pivot Milestones</h4>
                <p className="text-xs leading-relaxed text-violet-700/80 mt-1">
                  Once you build the portfolio projects under these phases and list these core skills on your resume, run another ATS Analysis to see how your compatibility score increases for your desired target roles!
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
