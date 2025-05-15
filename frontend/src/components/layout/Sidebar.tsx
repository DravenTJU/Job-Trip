import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Sparkles, 
  Chrome, 
  User, 
  Users, 
  File, 
  Plus,
  BriefcaseBusiness,
  PieChart,
  Briefcase,
  UserCircle,
  BriefcaseIcon,
  Settings,
  Sun,
  Moon,
  Languages,
  LogOut
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { logout } from '@/redux/slices/authSlice';
import LanguageSelector from '@/components/common/LanguageSelector';

/**
 * 侧边栏导航组件
 * 登录后显示
 */
const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { mode, toggleTheme } = useTheme();
  const { currentLanguage } = useLanguage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  // 检查当前路径是否匹配给定的路径
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 处理退出登录
  const handleLogout = () => {
    dispatch(logout());
    setSettingsMenuOpen(false); // 关闭设置菜单
    navigate('/login');
  };

  // 主菜单项
  const mainMenuItems = [
    { 
      name: t('nav.home', '欢迎'), 
      path: '/welcome', 
      icon: <Home className="sidebar-menu-icon" /> 
    },
    { 
      name: t('nav.chromeExtension', 'Chrome扩展'), 
      path: '/chrome-extension', 
      icon: <Chrome className="sidebar-menu-icon" /> 
    },
    {
      name: t('nav.jobs', '职位列表'), 
      path: '/jobs', 
      icon: <Briefcase className="sidebar-menu-icon" /> 
    },
    { 
      name: t('nav.jobTracking', '职位跟踪'), 
      path: '/dashboard', 
      icon: <PieChart className="sidebar-menu-icon" /> 
    },
    { 
      name: t('nav.profile', '个人档案'), 
      path: '/profile', 
      icon: <User className="sidebar-menu-icon" /> 
    },
    { 
      name: t('nav.resumeBuilder', '简历生成'), 
      path: '/resume-builder', 
      icon: <FileText className="sidebar-menu-icon" /> 
    },
    { 
      name: t('nav.coverLetter', 'AI求职信'), 
      path: '/cover-letters', 
      icon: <Sparkles className="sidebar-menu-icon" /> 
    }
  ];

  return (
    <div className="sidebar">
      <div className="flex flex-col h-full">
        {/* 顶部Logo区域 */}
        <div className="sidebar-logo">
          <div className="flex items-center">
            <div className="p-1.5 bg-indigo-100 rounded dark:bg-indigo-900">
              <BriefcaseBusiness className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">{t('app.name', 'JobTrip')}</span>
          </div>
        </div>

        {/* 主菜单 */}
        <div className="sidebar-content">
          {mainMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-menu-item ${
                isActive(item.path)
                  ? 'sidebar-menu-item-active'
                  : 'sidebar-menu-item-inactive'
              }`}
            >
              <div className={`${isActive(item.path) ? 'sidebar-menu-icon-active' : 'sidebar-menu-icon-inactive'}`}>
                {item.icon}
              </div>
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* 用户信息区域 */}
        <div className="sidebar-user">
          <div className="flex items-center flex-1 min-w-0">
            <div className="icon-container icon-container-primary flex-shrink-0">
              {user?.username?.charAt(0) || 'U'}
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate" title={user?.username}>
                {user?.username || t('common.user', '用户')}
              </p>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className="flex items-center space-x-1 ml-2">
            {/* 主题切换按钮 */}
            <button 
              onClick={toggleTheme} 
              title={mode === 'dark' ? t('theme.switchToLight', "切换到浅色模式") : t('theme.switchToDark', "切换到深色模式")}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* 语言切换按钮 */}
            <div className="relative">
              <button 
                title={t('language.switchLanguage', "切换语言")}
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)} 
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              >
                <Languages size={18} />
              </button>
              {languageMenuOpen && (
                <div 
                  className="absolute right-0 bottom-full mb-2 w-40 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-20"
                  onMouseLeave={() => setLanguageMenuOpen(false)}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                    <LanguageSelector variant="popup" size="md" />
                  </div>
                </div>
              )}
            </div>

            {/* 设置按钮和弹出菜单 */}
            <div className="relative">
              <button 
                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                title={t('settings.title', "设置")}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings size={18} />
              </button>
              {settingsMenuOpen && (
                <div 
                  className="absolute right-0 bottom-full mb-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-20"
                  onMouseLeave={() => setSettingsMenuOpen(false)}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <Link 
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 w-full text-left" 
                      role="menuitem"
                      onClick={() => setSettingsMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      {t('settings.accountSettings', "账号设置")}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" 
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-2" />
                      {t('auth.logout', "退出登录")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
