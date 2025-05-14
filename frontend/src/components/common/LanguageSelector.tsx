import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons';
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
  
  // 按钮样式
  const buttonStyle = `px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700
    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
    ${sizeClasses[size]}`;
  
  // 按钮选中样式
  const activeButtonStyle = `bg-indigo-500 text-white border-indigo-500
    hover:bg-indigo-600 hover:border-indigo-600 dark:hover:bg-indigo-600`;
  
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
  
  // 按钮组风格
  return (
    <div className="flex space-x-2">
      {Object.entries(supportedLanguages).map(([code, name]) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`${buttonStyle} ${currentLanguage === code ? activeButtonStyle : ''}`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector; 