import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  const { t } = useTranslation('landing');
  
  return (
    <div className="py-16 md:py-24 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800">
      <div className="container-lg mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg transition-colors"
            >
              {t('cta.button')}
            </Link>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-transparent text-white border border-white hover:bg-white/10 transition-colors"
            >
              {t('cta.secondaryButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection; 