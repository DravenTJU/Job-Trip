import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Menu, X, BriefcaseBusiness, Languages } from 'lucide-react';
import LanguageSelector from '@/components/common/LanguageSelector';

const Navbar: React.FC = () => {
  const { t } = useTranslation('landing');
  const { currentLanguage, supportedLanguages } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopLangMenuOpen, setDesktopLangMenuOpen] = useState(false);
  const [mobileLangMenuOpen, setMobileLangMenuOpen] = useState(false);
  
  // 监听滚动事件，用于改变导航栏背景
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 滚动到页面顶部
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // 导航链接列表
  const navLinks = [
    { name: t('nav.chromeExtension'), href: '#chrome-extension' },
    { name: t('nav.jobList'), href: '#job-list' },
    { name: t('nav.tracking'), href: '#tracking' },
    { name: t('nav.profile'), href: '#profile' },
    { name: t('nav.resume'), href: '#resume' },
    { name: t('nav.coverLetter'), href: '#coverLetter' }
  ];
  
  // 处理桌面版语言菜单开关
  const toggleDesktopLangMenu = () => {
    setDesktopLangMenuOpen(!desktopLangMenuOpen);
    if (mobileLangMenuOpen) setMobileLangMenuOpen(false);
  };

  // 处理移动版语言菜单开关
  const toggleMobileLangMenu = () => {
    setMobileLangMenuOpen(!mobileLangMenuOpen);
    if (desktopLangMenuOpen) setDesktopLangMenuOpen(false);
  };
  
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
          <a 
            href="/#" 
            className="flex items-center flex-shrink-0 mr-4 cursor-pointer"
            onClick={scrollToTop}
          >
            <BriefcaseBusiness 
              className="h-8 w-auto text-indigo-500"
              aria-hidden="true"
            />
            <span className="ml-2 text-xl font-semibold text-indigo-500">
              JobTrip
            </span>
          </a>
          
          {/* 桌面端导航链接 */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center justify-center space-x-1 md:space-x-2">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium bg-transparent hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 backdrop-blur-lg text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 ring-1 ring-transparent hover:ring-indigo-200 dark:hover:ring-indigo-700 transition-all duration-200 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="hidden xl:flex items-center ml-auto space-x-2 md:space-x-3">
            {/* 语言切换按钮 */}
            <div className="relative">
              <button 
                title={t('language.switchLanguage', "切换语言")}
                onClick={toggleDesktopLangMenu} 
                className="h-8 flex items-center px-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-800/30 hover:ring-2 hover:ring-indigo-500 transition-all"
              >
                <Languages className="w-4 h-4 mr-2" />
                <span className="text-xs md:text-sm">{supportedLanguages[currentLanguage]}</span>
              </button>
              {desktopLangMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-20"
                  onMouseLeave={() => setDesktopLangMenuOpen(false)}
                >
                  <LanguageSelector variant="popup" size="md" />
                </div>
              )}
            </div>
            
            {/* 主题切换 */}
            <ThemeToggle />
            
            {/* 登录/注册按钮 */}
            <Link 
              to="/login"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium bg-transparent hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 whitespace-nowrap transition-colors"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20 focus:outline-none"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="relative flex-1 max-w-[180px]">
                <button 
                  title={t('language.switchLanguage', "切换语言")}
                  onClick={toggleMobileLangMenu} 
                  className="w-full h-9 flex items-center px-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-800/30 hover:ring-2 hover:ring-indigo-500 transition-all"
                >
                  <Languages className="w-4 h-4 mr-2" />
                  <span className="text-sm">{supportedLanguages[currentLanguage]}</span>
                </button>
                {mobileLangMenuOpen && (
                  <div 
                    className="absolute left-0 top-full mt-2 w-40 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-20"
                    onMouseLeave={() => setMobileLangMenuOpen(false)}
                  >
                    <LanguageSelector variant="popup" size="md" />
                  </div>
                )}
              </div>
              <ThemeToggle />
            </div>
            <div className="flex flex-col space-y-2 px-3 pt-2">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"
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