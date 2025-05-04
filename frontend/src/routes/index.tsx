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

// 加载指示器
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// 包装带布局的路由
const LayoutRoute = ({ element }: { element: React.ReactNode }) => (
  <Layout>{element}</Layout>
);

// 包装需要认证的路由
const ProtectedLayoutRoute = ({ element }: { element: React.ReactNode }) => (
  <ProtectedRoute>
    <Layout>{element}</Layout>
  </ProtectedRoute>
);

/**
 * 应用程序路由配置组件
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
        {/* 带布局的公开路由 */}
        <Route path="/" element={<LayoutRoute element={<HomePage />} />} />
        
        {/* 需要认证的路由 */}
        <Route path="/dashboard" element={<ProtectedLayoutRoute element={<DashboardPage />} />} />
        <Route path="/welcome" element={<ProtectedLayoutRoute element={<WelcomePage />} />} />
        <Route path="/resume-builder" element={<ProtectedLayoutRoute element={<ResumeBuilderPage />} />} />
        <Route path="/resume-form/new" element={<ProtectedLayoutRoute element={<ResumeFormPage />} />} />
        <Route path="/resume-form/:id" element={<ProtectedLayoutRoute element={<ResumeFormPage />} />} />
        <Route path="/cover-letters" element={<ProtectedLayoutRoute element={<CoverLetterPage />} />} />
        <Route path="/chrome-extension" element={<ProtectedLayoutRoute element={<ChromeExtensionPage />} />} />
        
        {/* 职位相关路由 */}
        <Route path="/jobs" element={<ProtectedLayoutRoute element={<JobsPage />} />} />
        <Route path="/jobs/new" element={<ProtectedLayoutRoute element={<JobFormPage />} />} />
        <Route path="/jobs/edit/:id" element={<ProtectedLayoutRoute element={<JobFormPage />} />} />
        <Route path="/jobs/:id" element={<ProtectedLayoutRoute element={<JobDetailPage />} />} />
        
        {/* 申请跟踪相关路由 */}
        <Route path="/application/new" element={<ProtectedLayoutRoute element={<JobApplicationForm />} />} />
        <Route path="/application/edit/:id" element={<ProtectedLayoutRoute element={<JobApplicationForm />} />} />
        
        {/* 其他应用路由 */}
        <Route path="/stats" element={<ProtectedLayoutRoute element={<StatsPage />} />} />
        <Route path="/profile" element={<ProtectedLayoutRoute element={<ProfilePage />} />} />
        
        {/* 404页面 */}
        <Route path="/404" element={<LayoutRoute element={<NotFoundPage />} />} />
        
        {/* 重定向到404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};


export default AppRoutes; 

