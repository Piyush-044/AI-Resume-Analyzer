import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { featuresService } from '../services/features.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';
import { Edit, Download, Printer, Plus, Trash2, Sparkles, FileText } from 'lucide-react';

export default function ResumeBuilder() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Parsed Resume Fields
  const [personalInfo, setPersonalInfo] = useState({ fullName: '', email: '', phone: '', website: '', summary: '' });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const handleParse = async () => {
    if (!selectedResumeId) {
      toast.error('Select a resume first');
      return;
    }
    setLoading(true);
    setIsLoaded(false);
    try {
      const res = await featuresService.parseResume(selectedResumeId);
      const parsed = res.data.data;
      setPersonalInfo(parsed.personalInfo || { fullName: '', email: '', phone: '', website: '', summary: '' });
      setEducation(parsed.education || []);
      setExperience(parsed.experience || []);
      setSkills(parsed.skills || []);
      setIsLoaded(true);
      toast.success('Resume parsed into builder!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // State mutators for list fields
  const handleAddEducation = () => {
    setEducation(prev => [...prev, { school: '', degree: '', year: '' }]);
  };
  const handleRemoveEducation = (idx) => {
    setEducation(prev => prev.filter((_, i) => i !== idx));
  };
  const handleUpdateEducation = (idx, field, value) => {
    setEducation(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleAddExperience = () => {
    setExperience(prev => [...prev, { company: '', role: '', duration: '', description: '' }]);
  };
  const handleRemoveExperience = (idx) => {
    setExperience(prev => prev.filter((_, i) => i !== idx));
  };
  const handleUpdateExperience = (idx, field, value) => {
    setExperience(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleAddSkill = () => {
    setSkills(prev => [...prev, 'New Skill']);
  };
  const handleRemoveSkill = (idx) => {
    setSkills(prev => prev.filter((_, i) => i !== idx));
  };
  const handleUpdateSkill = (idx, value) => {
    setSkills(prev => prev.map((item, i) => i === idx ? value : item));
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Styles for native print overlay */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-resume, #printable-resume * {
            visibility: visible;
          }
          #printable-resume {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-indigo-600 p-6 text-white shadow-xl print:hidden">
        <div className="flex items-center gap-3">
          <Edit className="h-10 w-10 text-teal-200 animate-pulse shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">AI Resume Builder & Exporter</h1>
            <p className="text-teal-100 text-sm">Parse, edit details inside form layouts, and export beautifully designed print templates to PDF.</p>
          </div>
        </div>
      </div>

      {/* Setup Config */}
      <Card title="Builder Core" className="print:hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Load Existing Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              disabled={!resumes.length}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleParse} loading={loading} disabled={!resumes.length} className="bg-teal-600 hover:bg-teal-700 text-white">
            Parse & Build
          </Button>
        </div>
      </Card>

      {isLoaded && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Form Editor */}
          <div className="space-y-6 print:hidden">
            <Card title="Contact Info & Summary">
              <div className="space-y-3">
                <Input
                  label="Full Name"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  />
                </div>
                <Input
                  label="Website / Portfolio"
                  value={personalInfo.website}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                />
                <Textarea
                  label="Professional Summary"
                  rows={4}
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                />
              </div>
            </Card>

            <Card
              title="Experience"
              action={
                <Button onClick={handleAddExperience} className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-250 text-slate-700 dark:bg-slate-800 dark:text-white">
                  <Plus className="h-3 w-3" /> Add Work
                </Button>
              }
            >
              <div className="space-y-6">
                {experience.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 space-y-3 relative group">
                    <button
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-0 right-0 p-1 text-rose-500 hover:bg-rose-50 rounded transition"
                      title="Remove experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid gap-3 sm:grid-cols-2 pr-6">
                      <Input
                        label="Company"
                        value={item.company}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                      />
                      <Input
                        label="Role"
                        value={item.role}
                        onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                      />
                    </div>
                    <Input
                      label="Duration (e.g. 2022 - Present)"
                      value={item.duration}
                      onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)}
                    />
                    <Textarea
                      label="Description"
                      rows={3}
                      value={item.description}
                      onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Education"
              action={
                <Button onClick={handleAddEducation} className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-250 text-slate-700 dark:bg-slate-800 dark:text-white">
                  <Plus className="h-3 w-3" /> Add Edu
                </Button>
              }
            >
              <div className="space-y-6">
                {education.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 space-y-3 relative group">
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-0 right-0 p-1 text-rose-500 hover:bg-rose-50 rounded transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Input
                      label="School / University"
                      value={item.school}
                      onChange={(e) => handleUpdateEducation(idx, 'school', e.target.value)}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Degree"
                        value={item.degree}
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                      />
                      <Input
                        label="Timeline"
                        value={item.year}
                        onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Skills"
              action={
                <Button onClick={handleAddSkill} className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-250 text-slate-700 dark:bg-slate-800 dark:text-white">
                  <Plus className="h-3 w-3" /> Add Skill
                </Button>
              }
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={s}
                      onChange={(e) => handleUpdateSkill(idx, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-teal-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Live Printable View */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl print:hidden">
              <h3 className="font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-teal-500" /> Live Resume Template
              </h3>
              <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 px-3">
                <Printer className="h-4 w-4" /> Print / Save PDF
              </Button>
            </div>

            {/* Resume Layout Template wrapper */}
            <div id="printable-resume" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-8 text-black shadow-lg font-sans">
              <div className="text-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900">{personalInfo.fullName || 'Name Placeholder'}</h1>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600 mt-2">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                  {personalInfo.website && <span>• {personalInfo.website}</span>}
                </div>
              </div>

              {personalInfo.summary && (
                <div className="mb-6">
                  <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-2 border-b pb-1">Summary</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
                </div>
              )}

              {experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-3 border-b pb-1">Work History</h2>
                  <div className="space-y-4">
                    {experience.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between text-sm">
                          <h3 className="font-bold text-slate-800">{item.role || 'Role'}</h3>
                          <span className="text-slate-500 font-semibold">{item.duration}</span>
                        </div>
                        <span className="text-xs text-indigo-600 font-bold block mb-1">{item.company || 'Company'}</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-3 border-b pb-1">Education</h2>
                  <div className="space-y-3">
                    {education.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div>
                          <h3 className="font-bold text-slate-800">{item.school || 'School'}</h3>
                          <span className="text-xs text-slate-500 font-medium block">{item.degree || 'Degree'}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">{item.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-2 border-b pb-1">Key Skills</h2>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {skills.map((s, idx) => (
                      <span key={idx} className="border text-xs px-2.5 py-1 rounded bg-slate-50 text-slate-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isLoaded && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center h-full min-h-[300px] print:hidden">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No active builder session</h3>
          <p className="max-w-xs text-sm text-slate-400 mt-1">
            Select an uploaded resume above and click "Parse & Build" to populate the edit form sections.
          </p>
        </div>
      )}
    </div>
  );
}
