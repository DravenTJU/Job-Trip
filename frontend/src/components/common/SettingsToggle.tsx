import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages } from 'lucide-react';

interface SettingsToggleProps {
  className?: string;
}

/**
 * 设置切换组件
 * 用于切换语言和暗色模式
 */
const SettingsToggle: React.FC<SettingsToggleProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // 检测当前系统主题
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 从localStorage获取主题设置，如果没有则使用系统主题
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      setIsDarkMode(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
      
      // 设置初始主题
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, []);

  // 监听暗色模式变化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  // 切换暗色模式
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 切换语言
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setIsLangMenuOpen(false);
  };

  // 获取当前语言显示名称
  const getCurrentLanguageName = () => {
    switch (i18n.language) {
      case 'zh-CN':
        return '简体中文';
      case 'zh-TW':
        return '繁體中文';
      case 'en-US':
      case 'en':
        return 'English';
      default:
        return 'English';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* 暗色模式切换 */}
      <button
        onClick={toggleDarkMode}
        className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-lg transition-colors"
        aria-label={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>

      {/* 语言切换 */}
      <div className="relative">
        <button
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-lg transition-colors flex items-center gap-1 text-xs"
          aria-label="切换语言"
        >
          <Languages className="h-4 w-4" />
        </button>

        {/* 语言下拉菜单 */}
        {isLangMenuOpen && (
          <div className="absolute right-0 mt-1 w-32 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-100/10 z-30 py-1">
            <button
              onClick={() => changeLanguage('en-US')}
              className={`block px-4 py-2 text-sm w-full text-left ${
                i18n.language === 'en-US' || i18n.language === 'en'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('zh-CN')}
              className={`block px-4 py-2 text-sm w-full text-left ${
                i18n.language === 'zh-CN'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
            >
              简体中文
            </button>
            <button
              onClick={() => changeLanguage('zh-TW')}
              className={`block px-4 py-2 text-sm w-full text-left ${
                i18n.language === 'zh-TW'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
            >
              繁體中文
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsToggle; 