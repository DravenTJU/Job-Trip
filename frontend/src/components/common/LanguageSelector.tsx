import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'popup';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 语言选择器组件
 * 允许用户在支持的语言之间切换
 */
const LanguageSelector: FC<LanguageSelectorProps> = ({ 
  variant = 'dropdown',
  size = 'md' 
}) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  
  // 样式类根据尺寸
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  // 下拉菜单样式
  const dropdownStyle = `h-10 pl-3 pr-10 py-2 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl 
    border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow
    ${sizeClasses[size]}`;
  
  // 弹出菜单风格
  if (variant === 'popup') {
    return (
      <div className="relative">
        <div className="py-1" role="menu" aria-orientation="vertical">
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code);
              }}
              className={`flex items-center w-full px-4 py-2 text-left ${sizeClasses[size]} 
                    ${currentLanguage === code
                  ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              role="menuitem"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  if (variant === 'dropdown') {
    return (
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className={dropdownStyle}
        aria-label={t('settings.chooseLanguage')}
      >
        {Object.entries(supportedLanguages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    );
  }
};

export default LanguageSelector; 