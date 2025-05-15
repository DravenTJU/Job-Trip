import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// 布局
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { withLanguageUpdates } from '@/context/LanguageContext';

// 创建一个包装懒加载组件的函数，自动应用语言更新
const lazyWithLanguageUpdates = (importFunc: () => Promise<any>) => {
  const LazyComponent = lazy(importFunc);
  return withLanguageUpdates(LazyComponent);
};

// 懒加载组件
const LandingPage = lazyWithLanguageUpdates(() => import('@/pages/LandingPage'));
const DashboardPage = lazyWithLanguageUpdates(() => import('@/pages/DashboardPage'));
const WelcomePage = lazyWithLanguageUpdates(() => import('@/pages/WelcomePage'));
const ResumeBuilderPage = lazyWithLanguageUpdates(() => import('@/pages/ResumeBuilderPage'));
const ResumeFormPage = lazyWithLanguageUpdates(() => import('@/pages/ResumeFormPage'));
const JobsPage = lazyWithLanguageUpdates(() => import('@/pages/JobsPage'));
const JobDetailPage = lazyWithLanguageUpdates(() => import('@/pages/JobDetailPage'));
const JobFormPage = lazyWithLanguageUpdates(() => import('@/pages/JobFormPage'));
const SettingsPage = lazyWithLanguageUpdates(() => import('@/pages/SettingsPage'));
const ChromeExtensionPage = lazyWithLanguageUpdates(() => import('@/pages/ChromeExtensionPage'));
const LoginPage = lazyWithLanguageUpdates(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazyWithLanguageUpdates(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazyWithLanguageUpdates(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazyWithLanguageUpdates(() => import('@/pages/auth/ResetPasswordPage'));
const NotFoundPage = lazyWithLanguageUpdates(() => import('@/pages/NotFoundPage'));
const CoverLetterPage = lazyWithLanguageUpdates(() => import('@/pages/CoverLetterPage'));
const ProfilePage = lazyWithLanguageUpdates(() => import('@/pages/profile'));

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

// 包装带布局和保护的路由
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
        <Route path="/" element={<LayoutRoute element={<LandingPage />} />} />
        
        {/* 需要认证的路由 */}
        <Route path="/dashboard" element={<ProtectedLayoutRoute element={<DashboardPage />} />} />
        <Route path="/welcome" element={<ProtectedLayoutRoute element={<WelcomePage />} />} />
        <Route path="/resume-builder" element={<ProtectedLayoutRoute element={<ResumeBuilderPage />} />} />
        <Route path="/resume-form/new" element={<ProtectedLayoutRoute element={<ResumeFormPage />} />} />
        <Route path="/resume-form/:id" element={<ProtectedLayoutRoute element={<ResumeFormPage />} />} />
        <Route path="/cover-letters" element={<ProtectedLayoutRoute element={<CoverLetterPage />} />} />
        <Route path="/chrome-extension" element={<ProtectedLayoutRoute element={<ChromeExtensionPage />} />} />
        <Route path="/settings" element={<ProtectedLayoutRoute element={<SettingsPage />} />} />
        <Route path="/profile" element={<ProtectedLayoutRoute element={<ProfilePage />} />} />
        
        {/* 职位相关路由 */}
        <Route path="/jobs" element={<ProtectedLayoutRoute element={<JobsPage />} />} />
        <Route path="/jobs/new" element={<ProtectedLayoutRoute element={<JobFormPage />} />} />
        <Route path="/jobs/edit/:id" element={<ProtectedLayoutRoute element={<JobFormPage />} />} />
        <Route path="/jobs/:id" element={<ProtectedLayoutRoute element={<JobDetailPage />} />} />
        
        {/* 404页面 */}
        <Route path="/404" element={<LayoutRoute element={<NotFoundPage />} />} />
        
        {/* 重定向到404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 

