import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { jobMatchService } from '../services/jobMatch.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';
import SkillsList from '../components/analysis/SkillsList';

export default function JobMatching() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [match, setMatch] = useState(null);
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
      .finally(() => setFetching(false));
  }, []);

  const handleMatch = async () => {
    if (!selectedId || jobDescription.length < 50) {
      toast.error('Select resume and paste job description (min 50 chars)');
      return;
    }
    setLoading(true);
    setMatch(null);
    try {
      const res = await jobMatchService.create({ resumeId: selectedId, jobDescription });
      setMatch(res.data.data.match);
      toast.success('Job match complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Match failed');
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
      <Card title="Job Description Matching">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Select Resume</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              disabled={!resumes.length}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          </div>
          <Textarea
            label="Job Description"
            rows={8}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <Button onClick={handleMatch} loading={loading} disabled={!resumes.length}>
            Compare with Resume
          </Button>
        </div>
      </Card>

      {match && (
        <Card title="Match Results">
          <div className="mb-6 text-center">
            <span className="text-5xl font-bold text-primary-600">{match.matchScore}%</span>
            <p className="text-sm text-slate-500">Match Score</p>
          </div>
          <div className="space-y-6">
            <SkillsList title="Missing Skills" items={match.missingSkills} variant="missing" />
            <SkillsList title="Recommended Skills" items={match.recommendedSkills} variant="recommended" />
          </div>
        </Card>
      )}
    </div>
  );
}
