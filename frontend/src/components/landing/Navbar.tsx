import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Menu, X, BriefcaseBusiness } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useTranslation('landing');
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 监听滚动事件，用于改变导航栏背景
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 导航链接列表
  const navLinks = [
    { name: t('nav.chromeExtension'), href: '#chrome-extension' },
    { name: t('nav.jobList'), href: '#job-list' },
    { name: t('nav.tracking'), href: '#tracking' },
    { name: t('nav.profile'), href: '#profile' },
    { name: t('nav.resume'), href: '#resume' },
    { name: t('nav.coverLetter'), href: '#coverLetter' }
  ];
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 mr-4">
            <BriefcaseBusiness 
              className="h-8 w-auto text-indigo-500"
              aria-hidden="true"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
              Job<span className="text-indigo-500">Trip</span>
            </span>
          </Link>
          
          {/* 桌面端导航链接 */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center justify-center space-x-1 md:space-x-2">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/50 backdrop-blur-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ring-1 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700 transition-all duration-200 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="hidden xl:flex items-center ml-auto space-x-2 md:space-x-3">
            {/* 语言切换下拉框 */}
            <select
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-gray-600 dark:text-gray-300 border-0 rounded-lg focus:ring-1 focus:ring-indigo-500 text-xs md:text-sm"
            >
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            
            {/* 主题切换 */}
            <ThemeToggle />
            
            {/* 登录/注册按钮 */}
            <Link 
              to="/login"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/50 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white whitespace-nowrap transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link 
              to="/register"
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-500/25 transition-colors whitespace-nowrap"
            >
              {t('nav.signup')}
            </Link>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="xl:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center justify-between px-3 py-2">
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-gray-600 dark:text-gray-300 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {Object.entries(supportedLanguages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <ThemeToggle />
            </div>
            <div className="flex flex-col space-y-2 px-3 pt-2">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-2 text-center rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.signup')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 