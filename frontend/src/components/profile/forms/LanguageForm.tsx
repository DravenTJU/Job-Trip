import React, { useState } from 'react';
import { Language } from '../../../types/profile';
import { useTranslation } from 'react-i18next';

interface LanguageFormProps {
  initialData?: Language;
  onSave: (data: Language) => void;
  onCancel: () => void;
}

const LanguageForm: React.FC<LanguageFormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState<Language>(
    initialData || {
      language: '',
      proficiency: 'intermediate'
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // 常用语言列表
  const commonLanguages = [
    t('language_chinese', '汉语（中文）'),
    t('language_english', '英语'),
    t('language_japanese', '日语'),
    t('language_korean', '韩语'),
    t('language_french', '法语'),
    t('language_german', '德语'),
    t('language_spanish', '西班牙语'),
    t('language_russian', '俄语'),
    t('language_arabic', '阿拉伯语'),
    t('language_portuguese', '葡萄牙语'),
    t('language_italian', '意大利语')
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {initialData ? t('edit_language', '编辑语言能力') : t('add_language', '添加语言能力')}
      </h2>
      
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('language', '语言')} *
        </label>
        <input
          type="text"
          list="language-options"
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
          placeholder={t('language_placeholder', '例如：英语')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
        <datalist id="language-options">
          {commonLanguages.map(lang => (
            <option key={lang} value={lang} />
          ))}
        </datalist>
      </div>
      
      <div>
        <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('language_proficiency', '熟练程度')} *
        </label>
        <select
          id="proficiency"
          name="proficiency"
          value={formData.proficiency}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        >
          <option value="beginner">{t('skill_level_beginner', '入门')}</option>
          <option value="intermediate">{t('skill_level_intermediate', '中级')}</option>
          <option value="advanced">{t('skill_level_advanced', '高级')}</option>
          <option value="native">{t('language_level_native', '母语')}</option>
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('language_proficiency_explanation', '入门：基本交流、中级：日常会话、高级：流利交流、母语：母语水平')}
        </p>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          {t('cancel', '取消')}
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
          {t('save', '保存')}
        </button>
      </div>
    </form>
  );
};

export default LanguageForm; 