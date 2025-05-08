import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAppSelector } from '@/hooks/reduxHooks';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 应用程序主布局组件
 * 包含页眉和页脚，负责整体页面布局
 * 登录后使用左侧边栏布局
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // 未登录用户显示标准布局（顶部导航）
  if (!isAuthenticated) {
    return (
      <div className="layout">
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
  // 已登录用户显示侧边栏布局
  return (
    <div className="layout-sidebar">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full ml-0 md:ml-64">
        <main className="main-content-sidebar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 