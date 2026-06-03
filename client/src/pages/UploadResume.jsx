import { useEffect, useState } from 'react';
import { Upload, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function UploadResume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchResumes = () => {
    resumeService
      .list()
      .then((res) => setResumes(res.data.data.resumes))
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    setUploading(true);
    try {
      await resumeService.upload(file);
      toast.success('Resume uploaded!');
      fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await resumeService.delete(id);
      toast.success('Resume deleted');
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card title="Upload PDF Resume">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 transition hover:border-primary-400 hover:bg-primary-50/50">
          <Upload className="h-10 w-10 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">
            {uploading ? 'Uploading...' : 'Click to upload PDF (max 5MB)'}
          </p>
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </Card>

      <Card title="Your Resumes">
        {resumes.length ? (
          <ul className="divide-y divide-slate-100">
            {resumes.map((r) => (
              <li key={r._id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary-600" />
                  <div>
                    <p className="font-medium text-slate-900">{r.fileName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(r.uploadedAt).toLocaleString()} ·{' '}
                      {r.fileSize ? `${(r.fileSize / 1024).toFixed(1)} KB` : 'PDF'}
                    </p>
                  </div>
                </div>
                <Button variant="danger" onClick={() => handleDelete(r._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={FileText}
            title="No resumes yet"
            description="Upload your first PDF resume to get started"
          />
        )}
      </Card>
    </div>
  );
}
