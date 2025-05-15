import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { Skill } from '../../types/profile';
import ProfileSection from './ProfileSection';
import SkillForm from './forms/SkillForm';
import { useTranslation } from 'react-i18next';
import { 
  addSkill, 
  updateSkill,
  deleteSkill 
} from '../../redux/slices/profileSlice';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('profile');
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingItem(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingItem(skill);
    setIsAdding(false);
  };

  const handleSave = (data: Skill) => {
    if (isAdding) {
      dispatch(addSkill(data));
    } else if (editingItem?._id) {
      dispatch(updateSkill({ skillId: editingItem._id, skill: data }));
    }
    
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleDelete = (skillId: string) => {
    if (window.confirm(t('confirm_delete_skill', '确定要删除此技能吗？'))) {
      dispatch(deleteSkill(skillId));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  // 按类别对技能进行分组
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || t('skill_category_other', '其他');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getLevelIndicator = (level: string) => {
    switch (level) {
      case 'beginner':
        return { label: t('skill_level_beginner', '入门'), color: 'bg-blue-200 dark:bg-blue-900', width: 'w-1/4' };
      case 'intermediate':
        return { label: t('skill_level_intermediate', '中级'), color: 'bg-green-200 dark:bg-green-900', width: 'w-2/4' };
      case 'advanced':
        return { label: t('skill_level_advanced', '高级'), color: 'bg-orange-200 dark:bg-orange-900', width: 'w-3/4' };
      case 'expert':
        return { label: t('skill_level_expert', '专家'), color: 'bg-red-200 dark:bg-red-900', width: 'w-full' };
      default:
        return { label: t('unknown', '未知'), color: 'bg-gray-200 dark:bg-gray-800', width: 'w-1/4' };
    }
  };

  if (isAdding || editingItem) {
    return (
      <SkillForm
        initialData={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProfileSection
      title={t('skills', '技能')}
      onAddNew={handleAddNew}
      isEmpty={skills.length === 0}
      emptyMessage={t('add_skills_prompt', '添加你的技能展示专业能力')}
    >
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              {category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map((skill) => {
                const level = getLevelIndicator(skill.level);
                
                return (
                  <div 
                    key={skill._id}
                    className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-4 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/5 hover:ring-indigo-500/20 dark:hover:ring-indigo-500/20 transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                          {skill.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                            <div className={`${level.color} ${level.width} h-2 rounded-full`}></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{level.label}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => skill._id && handleDelete(skill._id)}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {skill.endorsements > 0 && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                        </svg>
                        <span>{t('endorsements_count', `${skill.endorsements}人认可`)}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
};

export default SkillsSection; 