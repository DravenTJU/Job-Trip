import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Sparkles, 
  Zap, 
  Chrome, 
  User, 
  Users, 
  File, 
  Plus,
  Star,
  UserCircle,
  BriefcaseIcon
} from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';

/**
 * 侧边栏导航组件
 * 登录后显示
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // 检查当前路径是否匹配给定的路径
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 主菜单项
  const mainMenuItems = [
    { 
      name: '欢迎', 
      path: '/welcome', 
      icon: <Home className="sidebar-menu-icon" /> 
    },
    { 
      name: '职位', 
      path: '/jobs', 
      icon: <BriefcaseIcon className="sidebar-menu-icon" /> 
    },
    { 
      name: '简历生成器', 
      path: '/resume-builder', 
      icon: <FileText className="sidebar-menu-icon" /> 
    },
    { 
      name: 'AI求职信和更多', 
      path: '/cover-letters', 
      icon: <Sparkles className="sidebar-menu-icon" /> 
    },
    { 
      name: 'Chrome扩展', 
      path: '/chrome-extension', 
      icon: <Chrome className="sidebar-menu-icon" /> 
    }
  ];

  // 二级菜单项
  const secondaryMenuItems = [
    { 
      name: '个人资料', 
      path: '/profile', 
      icon: <User className="sidebar-menu-icon" /> 
    },
    { 
      name: '用户档案', 
      path: '/user-profile', 
      icon: <UserCircle className="sidebar-menu-icon" /> 
    },
    { 
      name: '联系人', 
      path: '/contacts', 
      icon: <Users className="sidebar-menu-icon" /> 
    },
    { 
      name: '文档', 
      path: '/documents', 
      icon: <File className="sidebar-menu-icon" /> 
    }
  ];

  // 用户创建的工作追踪器
  const jobTrackers = [
    { name: '求职搜索 2025', path: '/job-search/2025' }
  ];

  return (
    <div className="sidebar">
      <div className="flex flex-col h-full">
        {/* 顶部Logo区域 */}
        <div className="sidebar-logo">
          <div className="flex items-center">
            <div className="p-1.5 bg-indigo-100 rounded dark:bg-indigo-900">
              <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">JobTrip</span>
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

          {/* 分割线 */}
          <div className="sidebar-divider"></div>

          {/* 二级菜单 */}
          {secondaryMenuItems.map((item) => (
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

          {/* 分割线 */}
          <div className="sidebar-divider"></div>

          {/* 工作追踪器部分 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">我的求职追踪器</h3>
              <button className="p-1 text-gray-500 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {jobTrackers.map((tracker, index) => (
              <Link
                key={index}
                to={tracker.path}
                className={`sidebar-menu-item ${
                  isActive(tracker.path)
                    ? 'sidebar-menu-item-active'
                    : 'sidebar-menu-item-inactive'
                }`}
              >
                <div className="flex items-center justify-center w-5 h-5 text-white bg-indigo-600 rounded-full dark:bg-indigo-500">
                  <span className="text-xs">{index + 1}</span>
                </div>
                <span className="ml-3">{tracker.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 底部升级区域 */}
        <div className="sidebar-footer">
          <div className="p-3 bg-indigo-50 rounded-lg dark:bg-indigo-900/30">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-sm font-medium text-indigo-800 dark:text-indigo-200">JobTrip Pro</span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">提升您的求职搜索体验</p>
            <button className="btn btn-primary w-full px-3 py-1.5 mt-2 text-xs">
              立即升级
            </button>
          </div>
        </div>

        {/* 用户信息区域 */}
        <div className="sidebar-user">
          <div className="icon-container icon-container-primary">
            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {user?.firstName || user?.username || '用户'}
            </p>
            <Link to="/settings" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              设置
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 