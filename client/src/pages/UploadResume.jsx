import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, FileText, Plus, Calendar, HardDrive, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function UploadResume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchResumes = () => {
    resumeService.list()
      .then((res) => setResumes(res.data.data.resumes))
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }
    setUploading(true);
    try {
      await resumeService.upload(file);
      toast.success('Resume uploaded successfully!');
      fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => { handleUpload(e.target.files?.[0]); e.target.value = ''; };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleUpload(e.dataTransfer.files?.[0]);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await resumeService.delete(id);
      toast.success('Resume deleted');
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-3xl space-y-6">
      <PageHeader icon={Upload} title="Upload Resume" subtitle="Upload your PDF resume to analyze with AI" badge="PDF Only" color="indigo" />

      {/* Upload Zone */}
      <motion.div variants={itemVariants}>
        <Card tilt>
          <motion.label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            animate={dragOver ? { scale: 1.02 } : { scale: 1 }}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-14 transition-all duration-300 overflow-hidden group
              ${dragOver
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-white/10 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/5'
              }`}
          >
            {/* Animated scanning line on upload */}
            {uploading && (
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scan-line" />
            )}

            {/* Icon */}
            <motion.div
              animate={uploading ? { y: [0, -10, 0] } : dragOver ? { scale: 1.2 } : { scale: 1 }}
              transition={uploading ? { repeat: Infinity, duration: 1.2 } : {}}
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
                dragOver
                  ? 'border-indigo-400 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                  : 'border-white/10 bg-white/5 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10'
              }`}
            >
              <Upload className={`h-7 w-7 transition-colors ${dragOver ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
            </motion.div>

            <p className="text-base font-semibold text-white mb-1">
              {uploading ? 'Uploading...' : dragOver ? 'Drop it here!' : 'Drop PDF or click to browse'}
            </p>
            <p className="text-sm text-slate-500">PDF only · Max 5MB</p>

            {uploading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-indigo-400">
                <Spinner className="h-4 w-4" />
                <span>Processing with AI...</span>
              </div>
            )}

            <input type="file" accept=".pdf" className="hidden" onChange={handleFileInput} disabled={uploading} />
          </motion.label>
        </Card>
      </motion.div>

      {/* Resume List */}
      <motion.div variants={itemVariants}>
        <Card title={`Your Resumes ${resumes.length ? `(${resumes.length})` : ''}`}>
          {resumes.length ? (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {resumes.map((r, idx) => (
                  <motion.li
                    key={r._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:border-indigo-500/40 transition-all">
                        <FileText className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{r.fileName}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(r.uploadedAt).toLocaleDateString()}
                          </span>
                          {r.fileSize && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <HardDrive className="h-3 w-3" />
                              {(r.fileSize / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="h-3 w-3" /> Uploaded
                      </span>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-14 w-14 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-slate-600" />
              </div>
              <p className="font-semibold text-slate-400 mb-1">No resumes yet</p>
              <p className="text-sm text-slate-600">Upload your first PDF resume to get started</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
