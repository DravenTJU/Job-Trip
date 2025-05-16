import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DecorationBlocks from '@/components/common/DecorationBlocks';

const HeroBanner: React.FC = () => {
  const { t } = useTranslation('landing');
  
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* 装饰性方块背景 */}
      <DecorationBlocks count={30} fadeOnScroll={true} />
      
      <div className="container-lg relative z-10 pt-20 pb-16 md:py-28">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1 mb-12 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {t('hero.primaryButton')}
              </Link>
              <Link 
                to="/download" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {t('hero.secondaryButton')}
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-1">
              <img 
                src="/assets/images/landing/dashboard-preview.png" 
                alt="JobTrip Dashboard" 
                className="w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner; 