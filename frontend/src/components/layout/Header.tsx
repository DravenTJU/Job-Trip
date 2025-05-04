import React, { useState } from 'react';
import { BriefcaseIcon, Menu as MenuIcon, Moon, Sun, LogOut, User, ChevronDown, Search, Bell } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';

/**
 * 应用程序头部导航栏组件
 */
const Header: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 处理退出登录
  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate('/login');
  };
  
  // 获取用户显示名称
  const getUserDisplayName = () => {
    if (!user) return 'U';
    if (user.firstName) return user.firstName.charAt(0);
    if (user.username) return user.username.charAt(0);
    return 'U';
  };
  
  // 获取当前页面标题
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/welcome') return '欢迎';
    if (path === '/resume-builder') return '简历生成器';
    if (path === '/cover-letters') return 'AI求职信和更多';
    if (path === '/chrome-extension') return 'Chrome扩展';
    if (path === '/profile') return '个人资料';
    if (path === '/contacts') return '联系人';
    if (path === '/documents') return '文档';
    if (path.includes('/job-search')) return '求职搜索';
    
    return '首页';
  };

  // 未登录用户的标准导航栏
  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50 dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-6 w-6 text-[#6366F1]" />
              <span className="font-bold text-xl dark:text-white">JobTrip</span>
            </Link>
            
            {/* 桌面端导航 */}
            <div className="hidden lg:flex space-x-6">
              <Link to="/jobs" className="text-gray-600 hover:text-gray-900 text-sm dark:text-gray-300 dark:hover:text-white">
                职位追踪器
              </Link>
              <Link to="/resume-builder" className="text-gray-600 hover:text-gray-900 text-sm dark:text-gray-300 dark:hover:text-white">
                AI简历生成器
              </Link>
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-900 text-sm dark:text-gray-300 dark:hover:text-white flex items-center">
                  所有功能 <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 dark:bg-gray-800">
                  <div className="py-1">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      仪表盘
                    </Link>
                    <Link to="/stats" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      数据统计
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      设置
                    </Link>
                  </div>
                </div>
              </div>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 text-sm dark:text-gray-300 dark:hover:text-white">
                价格
              </Link>
              <Link to="/organizations" className="text-gray-600 hover:text-gray-900 text-sm dark:text-gray-300 dark:hover:text-white">
                企业版
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 主题切换按钮 - 隐藏在桌面版，保留功能 */}
            <button 
              onClick={toggleTheme} 
              className="hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link 
              to="/login"
              className="text-gray-600 hover:text-gray-900 text-sm dark:text-gray-300 dark:hover:text-white"
            >
              登录
            </Link>
            <Link 
              to="/register"
              className="bg-[#6366F1] text-white px-4 py-2 rounded-lg hover:bg-[#4F46E5] transition-colors text-sm"
            >
              免费注册
            </Link>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-6 py-2">
              <Link 
                to="/jobs" 
                className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                职位追踪器
              </Link>
              <Link 
                to="/resume-builder" 
                className="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI简历生成器
              </Link>
            </div>
          </div>
        )}
      </nav>
    );
  }
  
  // 已登录用户的顶部栏
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* 移动端菜单按钮和面包屑导航 */}
        <div className="flex items-center">
          <button 
            className="p-1 mr-4 text-gray-500 rounded-md md:hidden hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          
          {/* 面包屑 */}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Link to="/" className="text-sm hover:text-gray-700 dark:hover:text-gray-300">首页</Link>
            <span className="mx-2">/</span>
            <span className="text-sm font-medium text-gray-800 dark:text-white">{getPageTitle()}</span>
          </div>
        </div>
        
        {/* 右侧操作区 */}
        <div className="flex items-center space-x-4">
          {/* 搜索按钮 */}
          <button className="p-1.5 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Search className="w-5 h-5" />
          </button>
          
          {/* 通知按钮 */}
          <button className="p-1.5 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* 主题切换按钮 */}
          <button 
            onClick={toggleTheme} 
            className="p-1.5 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* 用户头像菜单 */}
          <div className="relative group">
            <button className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-full">
              {getUserDisplayName()}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 dark:bg-gray-800">
              <div className="py-1">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  个人资料
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 移动端侧边菜单 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 overflow-y-auto">
            {/* 移动端菜单内容 - 复制自Sidebar组件 */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BriefcaseIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="ml-2 text-lg font-medium text-gray-800 dark:text-white">JobTrip</span>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>
            <div className="p-4">
              <nav className="space-y-2">
                <Link 
                  to="/welcome" 
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  欢迎
                </Link>
                <Link 
                  to="/resume-builder" 
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  简历生成器
                </Link>
                <Link 
                  to="/cover-letters" 
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI求职信和更多
                </Link>
                <Link 
                  to="/chrome-extension" 
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Chrome扩展
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  个人资料
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  退出登录
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 