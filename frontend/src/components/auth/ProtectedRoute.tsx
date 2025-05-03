import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/reduxHooks';
import Loader from '@/components/common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 路由保护组件
 * 用于保护需要登录才能访问的路由
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // 如果正在加载，显示加载中
  if (isLoading) {
    return <Loader message="验证登录状态..." fullScreen />;
  }

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 已登录，正常显示子组件
  return <>{children}</>;
};

export default ProtectedRoute; 