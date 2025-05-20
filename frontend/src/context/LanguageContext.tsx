import React, { createContext, useState, useContext, useEffect, ReactNode, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateProfile } from '@/redux/slices/authSlice';
import { supportedLanguages, defaultLanguage } from '@/i18n';

// 语言上下文类型
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  supportedLanguages: Record<string, string>;
  languageVersion: number; // 添加语言版本号，用于触发重新渲染
}

// 创建上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 自定义钩子
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage必须在LanguageProvider内部使用');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// 语言提供者组件
export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // 初始化语言状态
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || defaultLanguage);
  // 添加语言版本状态，用于强制组件重新渲染
  const [languageVersion, setLanguageVersion] = useState(0);
  
  // 同步用户语言偏好
  useEffect(() => {
    if (isAuthenticated && user?.preferences?.language) {
      // 如果用户已登录且有语言偏好，则切换到该语言
      if (user.preferences.language !== currentLanguage) {
        i18n.changeLanguage(user.preferences.language);
      }
    }
  }, [user, isAuthenticated, i18n, currentLanguage]);

  // 语言变更处理函数
  const changeLanguage = async (lang: string) => {
    // 切换i18n语言
    await i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    // 增加语言版本号，触发使用该上下文的组件重新渲染
    setLanguageVersion(prev => prev + 1);
    
    // 如果用户已登录，更新用户语言偏好
    if (isAuthenticated && user && user.preferences) {
      const preferences = {
        theme: user.preferences.theme || 'light',
        notifications: user.preferences.notifications || false,
        language: lang
      };
      
      dispatch(updateProfile({ preferences }));
    }
  };

  // 当i18n语言变更时同步状态
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // 提供上下文值
  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    supportedLanguages,
    languageVersion // 添加到上下文中
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// 创建一个高阶组件，使组件在语言变化时重新渲染
export const withLanguageUpdates = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    // 使用语言版本号作为依赖，当语言变化时重新渲染
    const { languageVersion } = useLanguage();
    
    // 组件的key会随着languageVersion变化，强制React重新挂载组件
    return <Component key={languageVersion} {...props} />;
  };
  
  // 设置显示名称，方便调试
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withLanguageUpdates(${displayName})`;
  
  return WrappedComponent;
}; 