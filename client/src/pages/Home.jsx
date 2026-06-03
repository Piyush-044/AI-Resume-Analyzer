import { Link } from 'react-router-dom';
import { FileSearch, Briefcase, PenLine, Mail, Zap, Shield } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: FileSearch, title: 'ATS Analysis', desc: 'Get your ATS score with actionable insights' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Compare your resume against any job description' },
  { icon: PenLine, title: 'AI Rewriter', desc: 'Improve bullet points for ATS compatibility' },
  { icon: Mail, title: 'Cover Letters', desc: 'Generate tailored cover letters instantly' },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Land more interviews with{' '}
          <span className="text-primary-600">AI-powered</span> resume analysis
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Upload your resume, get ATS scores, match job descriptions, rewrite bullets, and generate
          cover letters — all powered by Google Gemini.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register">
            <Button className="px-8 py-3 text-base">Start Free</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="px-8 py-3 text-base">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-slate-200 p-6 text-center">
              <Icon className="mx-auto h-10 w-10 text-primary-600" />
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-6">
            <Zap className="h-8 w-8 shrink-0 text-primary-600" />
            <div>
              <h3 className="font-semibold">Instant AI Analysis</h3>
              <p className="mt-1 text-sm text-slate-500">
                Powered by Google Gemini for fast, accurate resume insights.
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-6">
            <Shield className="h-8 w-8 shrink-0 text-primary-600" />
            <div>
              <h3 className="font-semibold">Secure & Private</h3>
              <p className="mt-1 text-sm text-slate-500">
                JWT authentication, encrypted passwords, and secure file uploads.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
