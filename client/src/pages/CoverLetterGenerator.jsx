import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { coverLetterService } from '../services/coverLetter.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';

export default function CoverLetterGenerator() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resumeService.list().then((res) => {
      const list = res.data.data.resumes;
      setResumes(list);
      if (list.length) setSelectedId(list[0]._id);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedId || !jobRole.trim()) {
      toast.error('Select resume and enter job role');
      return;
    }
    setLoading(true);
    setCoverLetter('');
    try {
      const res = await coverLetterService.generate({
        resumeId: selectedId,
        jobRole,
        jobDescription,
      });
      setCoverLetter(res.data.data.coverLetter);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card title="Cover Letter Generator">
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
          <Input label="Job Role" placeholder="e.g. Senior Software Engineer" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
          <Textarea
            label="Job Description (optional)"
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <Button onClick={handleGenerate} loading={loading}>
            Generate Cover Letter
          </Button>
        </div>
      </Card>

      {coverLetter && (
        <Card
          title="Your Cover Letter"
          action={
            <Button variant="secondary" onClick={copyToClipboard}>
              Copy
            </Button>
          }
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{coverLetter}</div>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}
    </div>
  );
}
