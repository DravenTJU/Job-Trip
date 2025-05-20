import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Sparkles, 
  Chrome, 
  User, 
  BriefcaseBusiness,
  PieChart,
  Briefcase,
  Settings,
  Sun,
  Moon,
  Languages,
  LogOut,
  Github,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSidebar } from '@/context/SidebarContext';
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
  const { isCollapsed, toggleSidebar } = useSidebar();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState('');

  // 获取时间问候语
  useEffect(() => {
    const getTimeGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        return t('greetings.morning', '早上好');
      } else if (hour >= 12 && hour < 18) {
        return t('greetings.afternoon', '下午好');
      } else {
        return t('greetings.evening', '晚上好');
      }
    };

    setGreeting(getTimeGreeting());
    
    // 每分钟更新一次问候语（以防跨越时间段）
    const intervalId = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [t, currentLanguage]);

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
    <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="flex flex-col h-full">
        {/* 顶部Logo区域 */}
        <div className="sidebar-logo">
          <div className="flex items-center">
            <div className="p-1.5 bg-indigo-100 rounded dark:bg-indigo-900">
              <BriefcaseBusiness className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {!isCollapsed && (
              <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">{t('app.name', 'JobTrip')}</span>
            )}
          </div>
        </div>

        {/* Logo和主菜单之间的分隔线 */}
        <div className="sidebar-divider"></div>

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
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.name : ''}
            >
              <div className={`${isActive(item.path) ? 'sidebar-menu-icon-active' : 'sidebar-menu-icon-inactive'}`}>
                {item.icon}
              </div>
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </div>

        {/* 用户信息区域 */}
        <div className={`sidebar-user flex-col ${isCollapsed ? 'items-center' : ''}`}>
          {isCollapsed ? (
            <div className="icon-container icon-container-primary flex-shrink-0 mb-2">
              {user?.username?.charAt(0) || 'U'}
            </div>
          ) : (
            <div className="flex items-center w-full mb-2">
              <div className="icon-container icon-container-primary flex-shrink-0">
                {user?.username?.charAt(0) || 'U'}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate" title={user?.username}>
                  {greeting}, {user?.username || t('common.user', '用户')}
                </p>
              </div>
            </div>
          )}

          {/* 操作按钮区域 */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
            {/* 收起/展开按钮 */}
            <button 
              onClick={toggleSidebar}
              title={isCollapsed ? t('sidebar.expand', "展开侧边栏") : t('sidebar.collapse', "收起侧边栏")}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            
            {!isCollapsed && (
              <>
                {/* GitHub链接按钮 */}
                <a 
                  href="https://github.com/DravenTJU/Job-Trip" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title={t('common.github', "GitHub仓库")}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                >
                  <Github size={18} />
                </a>
                
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
