import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { featuresService } from '../services/features.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Code, Eye, Copy, Download, Sparkles, FileCode, Monitor } from 'lucide-react';

export default function PortfolioGenerator() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [htmlCode, setHtmlCode] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'

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

  const handleGenerate = async () => {
    if (!selectedResumeId) {
      toast.error('Select a resume first');
      return;
    }
    setLoading(true);
    setHtmlCode('');
    try {
      const res = await featuresService.generatePortfolio(selectedResumeId);
      setHtmlCode(res.data.data.htmlCode || '');
      toast.success('Portfolio website code generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate portfolio website');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!htmlCode) return;
    navigator.clipboard.writeText(htmlCode);
    toast.success('HTML code copied to clipboard!');
  };

  const handleDownload = () => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded portfolio.html!');
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <Code className="h-10 w-10 text-pink-200 animate-pulse shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">AI Portfolio Website Generator</h1>
            <p className="text-pink-100 text-sm">Generate a ready-to-deploy, responsive HTML portfolio site using Tailwind CSS directly from your resume.</p>
          </div>
        </div>
      </div>

      {/* Setup Config */}
      <Card title="Portfolio Configuration">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Select Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              disabled={!resumes.length}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleGenerate} loading={loading} disabled={!resumes.length} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Generate Portfolio
          </Button>
        </div>
      </Card>

      {htmlCode && (
        <div className="space-y-4 animate-fadeIn">
          {/* Workspaces Control Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
            {/* View Mode buttons */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-slate-900 shadow text-indigo-600 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Live Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  viewMode === 'code'
                    ? 'bg-white dark:bg-slate-900 shadow text-indigo-600 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                <FileCode className="h-3.5 w-3.5" /> Source Code
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button onClick={handleCopy} variant="secondary" className="text-xs py-1.5 px-3">
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </Button>
              <Button onClick={handleDownload} className="text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Download className="h-3.5 w-3.5" /> Download HTML
              </Button>
            </div>
          </div>

          {/* Interactive Workspace area */}
          {viewMode === 'preview' ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-2 shadow-lg">
              <iframe
                title="Portfolio Live Preview"
                srcDoc={htmlCode}
                sandbox="allow-scripts"
                className="w-full h-[650px] rounded-xl bg-white"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 shadow-lg">
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-[650px] bg-transparent text-slate-300 font-mono text-xs outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>
          )}
        </div>
      )}

      {!htmlCode && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center h-full min-h-[300px]">
          <FileCode className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No portfolio generated</h3>
          <p className="max-w-xs text-sm text-slate-400 mt-1">
            Configure your resume in the setup panel above and click "Generate Portfolio" to build a customized personal website.
          </p>
        </div>
      )}
    </div>
  );
}
