import React from 'react';
import { useTranslation } from 'react-i18next';

const ClientLogos: React.FC = () => {
  const { t } = useTranslation('landing');
  
  // 公司标志数据
  const companies = [
    { name: 'Google', logo: '/assets/images/landing/company-logos/google.svg' },
    { name: 'Microsoft', logo: '/assets/images/landing/company-logos/microsoft.svg' },
    { name: 'Amazon', logo: '/assets/images/landing/company-logos/amazon.svg' },
    { name: 'Apple', logo: '/assets/images/landing/company-logos/apple.svg' },
    { name: 'Meta', logo: '/assets/images/landing/company-logos/meta.svg' },
    { name: 'LinkedIn', logo: '/assets/images/landing/company-logos/linkedin.svg' },
    { name: 'Uber', logo: '/assets/images/landing/company-logos/uber.svg' },
    { name: 'Airbnb', logo: '/assets/images/landing/company-logos/airbnb.svg' }
  ];
  
  return (
    <div className="py-8 md:py-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container-lg mx-auto px-4">
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
          {t('clientLogos.title')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <div key={company.name} className="h-10 w-20 md:w-24 flex items-center justify-center">
              <img 
                src={company.logo} 
                alt={company.name} 
                className="h-6 md:h-8 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientLogos; 