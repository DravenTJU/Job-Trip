import React, { useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import AppRoutes from '@/routes';
import { store } from '@/redux/store';
import { getCurrentUser } from '@/redux/slices/authSlice';

// 配置React Router的未来标志
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

/**
 * 应用程序根组件
 * 提供主题和路由配置
 */
const App: React.FC = () => {
  const initialized = useRef(false);

  // 应用启动时初始化全局状态
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // 只在应用启动时获取一次用户信息
      const initApp = async () => {
        try {
          await store.dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          // 忽略获取用户信息失败的错误
          console.error('初始化应用失败:', error);
        }
      };
      initApp();
    }
  }, []);

  return (
    <BrowserRouter {...routerConfig}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
