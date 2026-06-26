import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Spinner from './components/ui/Spinner';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UploadResume = lazy(() => import('./pages/UploadResume'));
const AtsAnalysis = lazy(() => import('./pages/AtsAnalysis'));
const JobMatching = lazy(() => import('./pages/JobMatching'));
const ResumeRewriter = lazy(() => import('./pages/ResumeRewriter'));
const CoverLetterGenerator = lazy(() => import('./pages/CoverLetterGenerator'));
const Profile = lazy(() => import('./pages/Profile'));
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'));
const CareerRoadmap = lazy(() => import('./pages/CareerRoadmap'));
const LinkedInOptimizer = lazy(() => import('./pages/LinkedInOptimizer'));
const PortfolioGenerator = lazy(() => import('./pages/PortfolioGenerator'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const JobsBoard = lazy(() => import('./pages/JobsBoard'));
const ResumeCompare = lazy(() => import('./pages/ResumeCompare'));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <Spinner className="h-12 w-12" />
        </div>
      }
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/analysis" element={<AtsAnalysis />} />
          <Route path="/job-match" element={<JobMatching />} />
          <Route path="/rewriter" element={<ResumeRewriter />} />
          <Route path="/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/career-roadmap" element={<CareerRoadmap />} />
          <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
          <Route path="/portfolio-generator" element={<PortfolioGenerator />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/jobs-board" element={<JobsBoard />} />
          <Route path="/resume-compare" element={<ResumeCompare />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
