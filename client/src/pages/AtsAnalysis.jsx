import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { analysisService } from '../services/analysis.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import AtsScoreGauge from '../components/analysis/AtsScoreGauge';
import SkillsList from '../components/analysis/SkillsList';

export default function AtsAnalysis() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    resumeService
      .list()
      .then((res) => {
        const list = res.data.data.resumes;
        setResumes(list);
        if (list.length) setSelectedId(list[0]._id);
      })
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setFetching(false));
  }, []);

  const runAnalysis = async () => {
    if (!selectedId) {
      toast.error('Select a resume first');
      return;
    }
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await analysisService.runATS(selectedId);
      setAnalysis(res.data.data.analysis);
      toast.success('ATS analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card title="Run ATS Analysis">
        {resumes.length ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Select Resume</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.fileName}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={runAnalysis} loading={loading}>
              Analyze Resume
            </Button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Upload a resume first to run ATS analysis.</p>
        )}
      </Card>

      {analysis && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="flex items-center justify-center lg:col-span-1">
            <AtsScoreGauge score={analysis.atsScore} />
          </Card>
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <SkillsList title="Missing Skills" items={analysis.missingSkills} variant="missing" />
            </Card>
            <Card title="Strengths">
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                {analysis.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Card>
            <Card title="Weaknesses">
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                {analysis.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </Card>
            <Card title="Suggestions">
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                {analysis.suggestions?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
