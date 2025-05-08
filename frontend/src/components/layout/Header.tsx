import React from 'react';
import { BriefcaseIcon, Moon, Sun, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAppSelector } from '@/hooks/reduxHooks';

/**
 * 应用程序头部导航栏组件
 */
const Header: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
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
      </nav>
    );
  }
  
  return null;
};

export default Header; 
