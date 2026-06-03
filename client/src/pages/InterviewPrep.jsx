import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resume.service';
import { interviewService } from '../services/interview.service';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';
import { Brain, HelpCircle, CheckCircle, AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';

export default function InterviewPrep() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loadingEval, setLoadingEval] = useState({});

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

  const handleStartInterview = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first');
      return;
    }
    setLoadingQuestions(true);
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setEvaluations({});
    try {
      const res = await interviewService.generate(selectedResumeId, jobDescription);
      setQuestions(res.data.data.questions || []);
      toast.success('Mock interview questions generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluateAnswer = async (qId, questionText) => {
    const answer = answers[qId] || '';
    if (answer.trim().length < 10) {
      toast.error('Please write a longer answer (min 10 characters) to evaluate');
      return;
    }

    setLoadingEval(prev => ({ ...prev, [qId]: true }));
    try {
      const res = await interviewService.evaluate(questionText, answer);
      setEvaluations(prev => ({ ...prev, [qId]: res.data.data }));
      toast.success('Evaluation complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to evaluate answer');
    } finally {
      setLoadingEval(prev => ({ ...prev, [qId]: false }));
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <Brain className="h-10 w-10 text-violet-200 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold">AI Mock Interview Simulator</h1>
            <p className="text-violet-100 text-sm">Prepare for interviews with tailored questions based on your resume and target job role.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Setup panel */}
        <div className="md:col-span-1 space-y-6">
          <Card title="Session Setup">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Select Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  disabled={!resumes.length}
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fileName}
                    </option>
                  ))}
                </select>
                {!resumes.length && (
                  <p className="mt-1 text-xs text-rose-500">Upload a resume first to prepare.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Target Job Description (Optional)</label>
                <textarea
                  rows={5}
                  placeholder="Paste target job description to get highly tailored technical questions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>

              <Button
                onClick={handleStartInterview}
                loading={loadingQuestions}
                disabled={!resumes.length}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                Start Mock Interview
              </Button>
            </div>
          </Card>

          {/* Question List navigation */}
          {questions.length > 0 && (
            <Card title="Questions Panel">
              <div className="space-y-2">
                {questions.map((q, idx) => {
                  const evalData = evaluations[q.id];
                  const hasAnswer = (answers[q.id] || '').trim().length > 0;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition text-sm ${
                        currentIdx === idx
                          ? 'bg-violet-50 border border-violet-200 text-violet-900'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700'
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        evalData 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : hasAnswer 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 truncate">
                        <p className="font-semibold truncate">{q.question}</p>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                          {q.type} {evalData && `• Score: ${evalData.score}/100`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Right Active Question panel */}
        <div className="md:col-span-2">
          {questions.length > 0 ? (
            <div className="space-y-6">
              {/* Question Details */}
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                      <HelpCircle className="h-3 w-3" /> Question {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {questions[currentIdx].type}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    {questions[currentIdx].question}
                  </h2>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Your Answer</label>
                    <Textarea
                      rows={6}
                      placeholder="Type your response here. Try to use the STAR method (Situation, Task, Action, Result) for behavioral questions, or detail code concepts for technical ones..."
                      value={answers[questions[currentIdx].id] || ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [questions[currentIdx].id]: e.target.value }))}
                      disabled={loadingEval[questions[currentIdx].id]}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleEvaluateAnswer(questions[currentIdx].id, questions[currentIdx].question)}
                      loading={loadingEval[questions[currentIdx].id]}
                      disabled={loadingEval[questions[currentIdx].id]}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Submit & Evaluate Answer
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Evaluation Results Card */}
              {evaluations[questions[currentIdx].id] && (
                <div className="animate-fadeIn space-y-6">
                  {/* Score circle */}
                  <div className="grid gap-6 sm:grid-cols-3">
                    <Card className="flex flex-col items-center justify-center p-6 text-center sm:col-span-1">
                      <div className="relative flex h-28 w-28 items-center justify-center">
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke={evaluations[questions[currentIdx].id].score >= 80 ? '#10b981' : evaluations[questions[currentIdx].id].score >= 60 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 42}
                            strokeDashoffset={2 * Math.PI * 42 * (1 - evaluations[questions[currentIdx].id].score / 100)}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="text-3xl font-extrabold text-slate-800">
                          {evaluations[questions[currentIdx].id].score}
                        </span>
                      </div>
                      <h4 className="mt-3 font-semibold text-slate-700 text-sm">Response Score</h4>
                    </Card>

                    <div className="space-y-4 sm:col-span-2">
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                        <h4 className="flex items-center gap-1.5 text-sm font-bold text-emerald-800 mb-2">
                          <CheckCircle className="h-4 w-4" /> Answer Strengths
                        </h4>
                        <ul className="list-inside list-disc space-y-1 text-xs text-emerald-900/80">
                          {evaluations[questions[currentIdx].id].strengths?.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                        <h4 className="flex items-center gap-1.5 text-sm font-bold text-amber-800 mb-2">
                          <AlertTriangle className="h-4 w-4" /> Areas for Improvement
                        </h4>
                        <ul className="list-inside list-disc space-y-1 text-xs text-amber-900/80">
                          {evaluations[questions[currentIdx].id].improvements?.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Model Answer Card */}
                  <Card>
                    <div className="space-y-2">
                      <h4 className="flex items-center gap-1.5 text-sm font-bold text-indigo-800">
                        <Sparkles className="h-4 w-4 text-indigo-500" /> Model Answer Reference
                      </h4>
                      <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line font-medium">
                          {evaluations[questions[currentIdx].id].modelAnswer}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center h-full min-h-[300px]">
              <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No active interview session</h3>
              <p className="max-w-xs text-sm text-slate-400 mt-1">
                Configure your resume and job details in the left panel, and click "Start Mock Interview" to begin your training session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
