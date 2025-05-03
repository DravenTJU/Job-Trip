import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 主题模式类型
type ThemeMode = 'light' | 'dark';

// 主题上下文接口
interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 自定义钩子函数
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme必须在ThemeProvider内部使用');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储获取主题偏好
  const savedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme: ThemeMode = savedTheme || (prefersDarkMode ? 'dark' : 'light');
  
  const [mode, setMode] = useState<ThemeMode>(defaultTheme);

  // 创建主题
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#4f46e5',
      },
      secondary: {
        main: '#10b981',
      },
    },
  });

  // 切换主题函数
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('themeMode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // 添加事件监听
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }

    // 清理函数
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, []);

  // 应用暗色模式到HTML元素
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  // 提供主题上下文
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 