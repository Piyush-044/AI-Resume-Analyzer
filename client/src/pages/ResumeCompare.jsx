import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { resumeService } from '../services/resume.service';
import { analysisService } from '../services/analysis.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { GitCompare, AlertCircle, FileText, CheckCircle, HelpCircle, XCircle } from 'lucide-react';

export default function ResumeCompare() {
  const [resumes, setResumes] = useState([]);
  const [resumeIdA, setResumeIdA] = useState('');
  const [resumeIdB, setResumeIdB] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Analysis states
  const [analysisA, setAnalysisA] = useState(null);
  const [analysisB, setAnalysisB] = useState(null);
  const [compared, setCompared] = useState(false);

  useEffect(() => {
    resumeService
      .list()
      .then((res) => {
        const list = res.data.data.resumes;
        setResumes(list);
        if (list.length >= 1) setResumeIdA(list[0]._id);
        if (list.length >= 2) setResumeIdB(list[1]._id);
      })
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setFetching(false));
  }, []);

  const handleCompare = async () => {
    if (!resumeIdA || !resumeIdB) {
      toast.error('Please select both resumes to compare');
      return;
    }
    if (resumeIdA === resumeIdB) {
      toast.error('Select two different resumes to compare');
      return;
    }

    setLoading(true);
    setAnalysisA(null);
    setAnalysisB(null);
    setCompared(false);

    try {
      // Load both latest analysis profiles
      const [resA, resB] = await Promise.allSettled([
        analysisService.getLatest(resumeIdA),
        analysisService.getLatest(resumeIdB)
      ]);

      if (resA.status === 'fulfilled' && resA.value?.data?.data?.analysis) {
        setAnalysisA(resA.value.data.data.analysis);
      } else {
        toast.error('Resume A has never been analyzed yet');
      }

      if (resB.status === 'fulfilled' && resB.value?.data?.data?.analysis) {
        setAnalysisB(resB.value.data.data.analysis);
      } else {
        toast.error('Resume B has never been analyzed yet');
      }

      setCompared(true);
      toast.success('Compare profiles loaded!');
    } catch (err) {
      toast.error('Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const selectedA = resumes.find(r => r._id === resumeIdA);
  const selectedB = resumes.find(r => r._id === resumeIdB);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <GitCompare className="h-10 w-10 text-cyan-200 animate-pulse shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">AI Resume Comparison Matrix</h1>
            <p className="text-cyan-100 text-sm">Compare two resumes side-by-side to review differences in ATS Scores, strengths, and keywords.</p>
          </div>
        </div>
      </div>

      {/* Select Box configuration */}
      <Card title="Select Resumes">
        {resumes.length >= 2 ? (
          <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Resume A</label>
              <select
                value={resumeIdA}
                onChange={(e) => setResumeIdA(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id} disabled={r._id === resumeIdB}>
                    {r.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Resume B</label>
              <select
                value={resumeIdB}
                onChange={(e) => setResumeIdB(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id} disabled={r._id === resumeIdA}>
                    {r.fileName}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={handleCompare} loading={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              Compare Resumes
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-slate-500">
            You need to upload at least **two resumes** to run side-by-side comparison matrix.
            <Link to="/upload" className="ml-1 text-cyan-600 hover:underline">Upload Resume now</Link>
          </div>
        )}
      </Card>

      {compared && (
        <div className="grid gap-6 md:grid-cols-2 animate-fadeIn">
          {/* Resume A Column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/20 dark:border-cyan-900/50 p-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base truncate flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" /> {selectedA?.fileName}
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400">Profile A</span>
            </div>

            {analysisA ? (
              <div className="space-y-6">
                {/* ATS Score Card */}
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-4xl font-extrabold text-cyan-600">{analysisA.atsScore}</div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">ATS Compatibility Score</span>
                </Card>

                {/* Missing Skills */}
                <Card title="Missing Skills">
                  <div className="flex flex-wrap gap-1.5">
                    {analysisA.missingSkills?.length > 0 ? (
                      analysisA.missingSkills.map((s, idx) => (
                        <span key={idx} className="rounded-lg bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 text-xs font-semibold dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-950">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No missing skills detected!</span>
                    )}
                  </div>
                </Card>

                {/* Strengths */}
                <Card title="Strengths">
                  <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-350">
                    {analysisA.strengths?.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </Card>

                {/* Weaknesses */}
                <Card title="Weaknesses">
                  <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-355">
                    {analysisA.weaknesses?.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 p-4 text-xs font-semibold text-rose-700 dark:text-rose-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>No ATS report found for this resume. Run <Link to="/analysis" className="underline">ATS Analysis</Link> first.</span>
              </div>
            )}
          </div>

          {/* Resume B Column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-blue-200 bg-blue-50/20 dark:border-blue-900/50 p-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base truncate flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> {selectedB?.fileName}
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400">Profile B</span>
            </div>

            {analysisB ? (
              <div className="space-y-6">
                {/* ATS Score Card */}
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-4xl font-extrabold text-blue-600">{analysisB.atsScore}</div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">ATS Compatibility Score</span>
                </Card>

                {/* Missing Skills */}
                <Card title="Missing Skills">
                  <div className="flex flex-wrap gap-1.5">
                    {analysisB.missingSkills?.length > 0 ? (
                      analysisB.missingSkills.map((s, idx) => (
                        <span key={idx} className="rounded-lg bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 text-xs font-semibold dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-950">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No missing skills detected!</span>
                    )}
                  </div>
                </Card>

                {/* Strengths */}
                <Card title="Strengths">
                  <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-350">
                    {analysisB.strengths?.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </Card>

                {/* Weaknesses */}
                <Card title="Weaknesses">
                  <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-355">
                    {analysisB.weaknesses?.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 p-4 text-xs font-semibold text-rose-700 dark:text-rose-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>No ATS report found for this resume. Run <Link to="/analysis" className="underline">ATS Analysis</Link> first.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
