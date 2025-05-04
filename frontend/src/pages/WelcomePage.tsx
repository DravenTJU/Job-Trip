import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, CheckCircle } from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';

/**
 * 欢迎页面组件
 * 展示给登录用户的欢迎页面
 */
const WelcomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userName = user?.firstName || user?.username || '用户';

  // 入门步骤数据
  const onboardingSteps = [
    {
      id: 1,
      title: '安装Chrome扩展',
      description: '获取JobTrip的chrome扩展，用于收藏职位、查看职位洞察和自动填写申请表。',
      status: 'pending',
      path: '/chrome-extension'
    },
    {
      id: 2,
      title: '将您的前3个职位保存到求职追踪器',
      description: '通过任何求职板或搜索引擎使用chrome扩展保存职位，或手动添加它们。',
      status: 'pending',
      path: '/job-search/2025'
    },
    {
      id: 3,
      title: '创建您的基础简历',
      description: '选择您的目标职位标题，并构建您的最佳基础简历。',
      status: 'pending',
      path: '/resume-builder'
    },
    {
      id: 4,
      title: '为特定职位调整您的简历',
      description: '一旦您创建了基础简历并收藏了一些职位，是时候制作为特定职位申请定制的简历了。',
      status: 'pending',
      path: '/resume-builder/customize'
    },
  ];

  return (
    <div className="container-sm">
      {/* 欢迎标语和愉快图案背景 */}
      <div className="welcome-banner">
        {/* 背景装饰 */}
        <div className="welcome-banner-decoration">
          <div className="absolute top-5 left-10 w-6 h-6 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-green-300 rounded"></div>
          <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-red-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-blue-300 transform rotate-45"></div>
          <div className="absolute top-1/3 left-1/2 w-7 h-7 bg-purple-300 rounded-lg"></div>
        </div>
        
        <div className="relative">
          <h1 className="title-lg mb-6">
            欢迎，{userName}！
          </h1>
          <div className="text-4xl md:text-6xl font-bold text-indigo-800 dark:text-indigo-300">
            Draven!
          </div>
          <p className="mt-6 text-lg text-description max-w-2xl">
            体验JobTrip的全部功能，完成下面的步骤来高效管理您的求职过程，提高成功率，加速您的职业发展。
          </p>
        </div>
      </div>

      {/* 入门步骤 */}
      <div className="section">
        <h2 className="title-md mb-6">开始使用</h2>
        <div className="welcome-steps-container">
          {onboardingSteps.map((step) => (
            <div 
              key={step.id} 
              className="welcome-step"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className={`welcome-step-number ${
                    step.status === 'completed' 
                      ? 'welcome-step-number-completed' 
                      : 'welcome-step-number-pending'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{step.id}</span>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="title-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-description mb-3">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.id === 1 && (
                      <button className="btn btn-primary">
                        <Download className="w-4 h-4 mr-1.5" />
                        下载Chrome扩展
                      </button>
                    )}
                    <Link 
                      to={step.path} 
                      className="btn btn-secondary"
                    >
                      开始 <ChevronRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 