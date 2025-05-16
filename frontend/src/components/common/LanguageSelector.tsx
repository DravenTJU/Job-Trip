import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import GenericListbox, { SelectOption } from './GenericListbox';

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
  const dropdownStyle = `h-10 ${sizeClasses[size]}`;
  
  // 转换语言选项为GenericListbox所需格式
  const languageOptions: SelectOption[] = useMemo(() => {
    return Object.entries(supportedLanguages).map(([code, name]) => ({
      id: code,
      label: name,
    }));
  }, [supportedLanguages]);
  
  // 获取当前选择的语言选项
  const selectedLanguage = languageOptions.find(option => option.id === currentLanguage) || null;
  
  // 处理语言变更
  const handleLanguageChange = (option: SelectOption | null) => {
    if (option) {
      changeLanguage(option.id.toString());
    }
  };
  
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
      <GenericListbox
        options={languageOptions}
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className={dropdownStyle}
        buttonClassName="!h-10"
        ariaLabel={t('settings.chooseLanguage')}
        name="language"
      />
    );
  }
};

export default LanguageSelector; 