import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * 404页面 - 当访问不存在的路由时显示，使用职业指南针/导航概念
 */
const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('notFound');
  
  return (
    <div className="min-h-screen py-16 flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-5xl mx-auto">
          {/* 左侧内容 - 文本和按钮 */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
              <span className="block text-[#6366F1]">404</span>
              {t('title', '职业导航系统无法定位此页面')}
            </h1>
            
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              {t('subtitle', '您似乎偏离了求职旅途')}
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              {t('description', '我们的职涯GPS无法找到您要访问的目的地。请尝试返回首页重新导航，或联系我们获取帮助。')}
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white dark:text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                <Home className="w-4 h-4" />
                {t('homeButton', '返回首页')}
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backButton', '返回上一页')}
              </button>
            </div>
          </div>
          
          {/* 右侧内容 - 指南针图形 */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative">
              {/* 外圆 - 指南针外圈 */}
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 flex items-center justify-center">
                {/* 内圆 - 指南针刻度盘 */}
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-gray-50 dark:bg-gray-700 relative flex items-center justify-center">
                  {/* 指南针刻度标记 - 北 */}
                  <div className="absolute top-4 text-center">
                    <div className="h-5 w-1 bg-indigo-500 mx-auto mb-1"></div>
                    <span className="text-sm font-bold">{t('compass.north', 'N')}</span>
                  </div>
                  
                  {/* 指南针刻度标记 - 东 */}
                  <div className="absolute right-4 text-center">
                    <div className="h-1 w-5 bg-indigo-500 mx-auto mb-1"></div>
                    <span className="text-sm font-bold">{t('compass.east', 'E')}</span>
                  </div>
                  
                  {/* 指南针刻度标记 - 南 */}
                  <div className="absolute bottom-4 text-center">
                    <div className="h-5 w-1 bg-indigo-500 mx-auto mb-1"></div>
                    <span className="text-sm font-bold">{t('compass.south', 'S')}</span>
                  </div>
                  
                  {/* 指南针刻度标记 - 西 */}
                  <div className="absolute left-4 text-center">
                    <div className="h-1 w-5 bg-indigo-500 mx-auto mb-1"></div>
                    <span className="text-sm font-bold">{t('compass.west', 'W')}</span>
                  </div>
                  
                  {/* 404° 文本 - 移到上方 */}
                  <div className="absolute text-[#6366F1] font-bold text-lg animate-pulse" style={{ top: '35%' }}>
                    404°
                  </div>
                  
                  {/* 指针 - 有动画效果，摆动到404° */}
                  <div className="absolute w-1 h-24 md:h-32 bg-gradient-to-t from-indigo-600 to-indigo-400 origin-bottom rotate-[134deg] transition-transform duration-1000 animate-pulse"
                    style={{ bottom: '50%', transformOrigin: 'center bottom' }}
                  ></div>
                  
                  {/* 中心点 */}
                  <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-md z-10"></div>
                </div>
                
                {/* 指南针图标装饰 */}
                <div className="absolute -top-4 -right-4 bg-indigo-500 text-white p-2 rounded-full shadow-lg">
                  <Compass className="w-6 h-6" />
                </div>
              </div>
              
              {/* 装饰性元素 - 小点 */}
              <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-800"></div>
              <div className="absolute top-1/4 -right-3 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 