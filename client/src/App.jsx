import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import AtsAnalysis from './pages/AtsAnalysis';
import JobMatching from './pages/JobMatching';
import ResumeRewriter from './pages/ResumeRewriter';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import Profile from './pages/Profile';
import InterviewPrep from './pages/InterviewPrep';
import CareerRoadmap from './pages/CareerRoadmap';
import LinkedInOptimizer from './pages/LinkedInOptimizer';
import PortfolioGenerator from './pages/PortfolioGenerator';
import ResumeBuilder from './pages/ResumeBuilder';
import JobsBoard from './pages/JobsBoard';
import ResumeCompare from './pages/ResumeCompare';

export default function App() {
  return (
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
  );
}
