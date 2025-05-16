import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';

const Testimonial: React.FC = () => {
  const { t } = useTranslation('landing');
  
  return (
    <div className="py-16 md:py-24 bg-indigo-50/50 dark:bg-indigo-900/10 backdrop-blur-sm">
      <div className="container-lg mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-8 md:p-10">
            <div className="flex flex-col items-center">
              <svg className="h-12 w-12 text-indigo-400 mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-300 mb-6">
                {t('testimonial.text')}
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-800/40 flex items-center justify-center mr-4 ring-2 ring-indigo-500">
                  <User className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('testimonial.author')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('testimonial.position')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial; 