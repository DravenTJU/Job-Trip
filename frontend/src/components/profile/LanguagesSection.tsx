import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { Language } from '../../types/profile';
import ProfileSection from './ProfileSection';
import LanguageForm from './forms/LanguageForm';
import { useTranslation } from 'react-i18next';
import { 
  addLanguage, 
  updateLanguage,
  deleteLanguage 
} from '../../redux/slices/profileSlice';

interface LanguagesSectionProps {
  languages: Language[];
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('profile');
  const [editingItem, setEditingItem] = useState<Language | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingItem(null);
  };

  const handleEdit = (language: Language) => {
    setEditingItem(language);
    setIsAdding(false);
  };

  const handleSave = (data: Language) => {
    if (isAdding) {
      dispatch(addLanguage(data));
    } else if (editingItem?._id) {
      dispatch(updateLanguage({ languageId: editingItem._id, language: data }));
    }
    
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleDelete = (languageId: string) => {
    if (window.confirm(t('confirm_delete_language', '确定要删除此语言能力吗？'))) {
      dispatch(deleteLanguage(languageId));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const getProficiencyIndicator = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner':
        return { label: t('skill_level_beginner', '入门'), color: 'bg-blue-200 dark:bg-blue-900', width: 'w-1/4' };
      case 'intermediate':
        return { label: t('skill_level_intermediate', '中级'), color: 'bg-green-200 dark:bg-green-900', width: 'w-2/4' };
      case 'advanced':
        return { label: t('skill_level_advanced', '高级'), color: 'bg-orange-200 dark:bg-orange-900', width: 'w-3/4' };
      case 'native':
        return { label: t('language_level_native', '母语'), color: 'bg-red-200 dark:bg-red-900', width: 'w-full' };
      default:
        return { label: t('unknown', '未知'), color: 'bg-gray-200 dark:bg-gray-800', width: 'w-1/4' };
    }
  };

  if (isAdding || editingItem) {
    return (
      <LanguageForm
        initialData={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProfileSection
      title={t('languages', '语言能力')}
      onAddNew={handleAddNew}
      isEmpty={languages.length === 0}
      emptyMessage={t('add_languages_prompt', '添加你的语言能力展示沟通技能')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((language) => {
          const proficiency = getProficiencyIndicator(language.proficiency);
          
          return (
            <div 
              key={language._id}
              className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-4 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/5 hover:ring-indigo-500/20 dark:hover:ring-indigo-500/20 transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {language.language}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(language)}
                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => language._id && handleDelete(language._id)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1 mb-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className={`${proficiency.color} ${proficiency.width} h-2 rounded-full`}></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{proficiency.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </ProfileSection>
  );
};

export default LanguagesSection; 