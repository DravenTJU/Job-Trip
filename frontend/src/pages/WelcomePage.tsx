import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, CheckCircle } from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';

/**
 * 欢迎页面组件
 * 展示给登录用户的欢迎页面，引导用户完成核心功能的使用流程
 * 基于项目使命：简化求职过程，自动化数据收集，提高求职效率
 */
const WelcomePage: React.FC = () => {
  const { t } = useTranslation(['common', 'welcome']);
  const { user } = useAppSelector((state) => state.auth);
  const userName = user?.username || t('welcome:defaultUser', '求职者');

  // 入门步骤数据
  const onboardingSteps = [
    {
      id: 1,
      title: t('welcome:steps.installExtension.title', '安装 Chrome 扩展'),
      description: t('welcome:steps.installExtension.description', '获取并安装 JobTrip 的浏览器扩展，自动从 LinkedIn、Seek 和 Indeed 等平台收集职位信息。'),
      status: 'pending',
      path: '/chrome-extension'
    },
    {
      id: 2,
      title: t('welcome:steps.browseJobs.title', '浏览您的职位列表'),
      description: t('welcome:steps.browseJobs.description', '查看自动抓取或手动添加的职位信息，所有数据都集中在一处，方便您快速筛选和比较。'),
      status: 'pending',
      path: '/jobs'
    },
    {
      id: 3,
      title: t('welcome:steps.trackApplications.title', '跟踪申请状态'),
      description: t('welcome:steps.trackApplications.description', '轻松跟踪每个职位的申请进度（新发现、已申请、面试中等），避免错过重要机会。'),
      status: 'pending',
      path: '/dashboard'
    },
    {
      id: 4,
      title: t('welcome:steps.completeProfile.title', '完善您的个人档案'),
      description: t('welcome:steps.completeProfile.description', '创建专业的个人档案，包括教育背景、工作经验和技能，为简历生成和职位匹配奠定基础。'),
      status: 'pending',
      path: '/profile'
    },
    {
      id: 5,
      title: t('welcome:steps.generateResume.title', '生成针对性简历'),
      description: t('welcome:steps.generateResume.description', '基于您的档案和目标职位，智能生成量身定制的简历，提高求职成功率。'),
      status: 'pending',
      path: '/resume-builder'
    },
    {
      id: 6,
      title: t('welcome:steps.createCoverLetter.title', '创建个性化求职信'),
      description: t('welcome:steps.createCoverLetter.description', '为特定职位自动生成定制求职信，突出您与职位要求的匹配点，节省宝贵时间。'),
      status: 'pending',
      path: '/cover-letters'
    },
  ];

  return (
    <div className="container-lg px-4">
      {/* 欢迎标语和愉快图案背景 */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 mb-8 py-12 px-6 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-5 left-10 w-6 h-6 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-green-300 rounded"></div>
          <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-red-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-blue-300 transform rotate-45"></div>
          <div className="absolute top-1/3 left-1/2 w-7 h-7 bg-purple-300 rounded-lg"></div>
        </div>
        
        <div className="relative">
          <div className="text-4xl md:text-4xl font-bold text-indigo-800 dark:text-indigo-300">
            {t('welcome:greeting', '欢迎回来，')} {userName}！
          </div>
          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
            {t('welcome:intro', 'JobTrip 职途助手为您简化求职流程，自动收集多平台职位信息并提供统一管理。完成以下步骤，轻松组织您的求职过程，减少手动追踪工作，让您专注于获得理想职位。')}
          </p>
        </div>
      </div>

      {/* 入门步骤 */}
      <div className="section space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t('welcome:sectionTitle', '开始使用您的一站式求职助手')}
        </h2>
        <div className="space-y-4">
          {onboardingSteps.map((step) => (
            <div 
              key={step.id} 
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-5"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.status === 'completed' 
                      ? 'border-green-500 bg-green-100 dark:bg-green-900/30' 
                      : 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{step.id}</span>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.id === 1 && (
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors">
                        <Download className="w-4 h-4" />
                        {t('welcome:downloadExtension', '下载 Chrome 扩展')}
                      </button>
                    )}
                    <Link 
                      to={step.path} 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {step.id === 1 ? t('welcome:viewInstructions', '查看安装说明') : t('welcome:start', '开始')}
                      <ChevronRight className="w-4 h-4" />
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