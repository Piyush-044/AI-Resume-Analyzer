import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { rewriterService } from '../services/rewriter.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';

export default function ResumeRewriter() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [bulletsText, setBulletsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resumeService.list().then((res) => {
      const list = res.data.data.resumes;
      setResumes(list);
      if (list.length) setSelectedId(list[0]._id);
    });
  }, []);

  const handleRewrite = async () => {
    if (!selectedId) {
      toast.error('Select a resume');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const bullets = bulletsText
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean);
      const res = await rewriterService.rewrite({
        resumeId: selectedId,
        bullets: bullets.length ? bullets : undefined,
      });
      setResult(res.data.data);
      toast.success('Bullets rewritten!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rewrite failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card title="AI Resume Rewriter">
        <div className="space-y-4">
          <div>
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
          <Textarea
            label="Bullet Points (optional — leave empty to extract from resume)"
            rows={6}
            placeholder="• Led team of 5 engineers&#10;• Increased performance by 40%"
            value={bulletsText}
            onChange={(e) => setBulletsText(e.target.value)}
          />
          <Button onClick={handleRewrite} loading={loading}>
            Rewrite Bullets
          </Button>
        </div>
      </Card>

      {result?.bullets && (
        <Card title="Improved Bullets">
          <ul className="space-y-3">
            {result.bullets.map((b, i) => (
              <li key={i} className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-slate-800">
                {b}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
