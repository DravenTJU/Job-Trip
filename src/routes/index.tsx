import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// 布局
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// 懒加载组件
const HomePage = lazy(() => import('@/pages/HomePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const WelcomePage = lazy(() => import('@/pages/WelcomePage'));
const ResumeBuilderPage = lazy(() => import('@/pages/ResumeBuilderPage'));
const ResumeFormPage = lazy(() => import('@/pages/ResumeFormPage'));
const JobsPage = lazy(() => import('@/pages/JobsPage'));
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'));
const JobFormPage = lazy(() => import('@/pages/JobFormPage'));
const JobApplicationForm = lazy(() => import('@/pages/JobApplicationForm'));
const StatsPage = lazy(() => import('@/pages/StatsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ChromeExtensionPage = lazy(() => import('@/pages/ChromeExtensionPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CoverLetterPage = lazy(() => import('@/pages/CoverLetterPage'));
const AccountSettingsPage = lazy(() => import('@/pages/AccountSettingsPage'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* 公开路由 */}
        <Route path="/" element={<LayoutRoute element={<HomePage />} />} />
        <Route path="/login" element={<LayoutRoute element={<LoginPage />} />} />
        <Route path="/register" element={<LayoutRoute element={<RegisterPage />} />} />
        <Route path="/forgot-password" element={<LayoutRoute element={<ForgotPasswordPage />} />} />
        <Route path="/reset-password" element={<LayoutRoute element={<ResetPasswordPage />} />} />
        
        {/* 受保护的路由 */}
        <Route path="/welcome" element={<ProtectedLayoutRoute element={<WelcomePage />} />} />
        <Route path="/dashboard" element={<ProtectedLayoutRoute element={<DashboardPage />} />} />
        <Route path="/resume-builder" element={<ProtectedLayoutRoute element={<ResumeBuilderPage />} />} />
        <Route path="/resume-form" element={<ProtectedLayoutRoute element={<ResumeFormPage />} />} />
        <Route path="/jobs" element={<ProtectedLayoutRoute element={<JobsPage />} />} />
        <Route path="/jobs/:id" element={<ProtectedLayoutRoute element={<JobDetailPage />} />} />
        <Route path="/jobs/new" element={<ProtectedLayoutRoute element={<JobFormPage />} />} />
        <Route path="/jobs/:id/apply" element={<ProtectedLayoutRoute element={<JobApplicationForm />} />} />
        <Route path="/stats" element={<ProtectedLayoutRoute element={<StatsPage />} />} />
        <Route path="/profile" element={<ProtectedLayoutRoute element={<ProfilePage />} />} />
        <Route path="/chrome-extension" element={<ProtectedLayoutRoute element={<ChromeExtensionPage />} />} />
        <Route path="/cover-letters" element={<ProtectedLayoutRoute element={<CoverLetterPage />} />} />
        <Route path="/settings" element={<ProtectedLayoutRoute element={<AccountSettingsPage />} />} />
        
        {/* 404 页面 */}
        <Route path="*" element={<LayoutRoute element={<NotFoundPage />} />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 