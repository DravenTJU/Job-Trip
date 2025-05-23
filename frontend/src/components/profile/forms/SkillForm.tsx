import React, { useState } from 'react';
import { Skill } from '../../../types/profile';
import { useTranslation } from 'react-i18next';
import GenericListbox, { SelectOption } from '@/components/common/GenericListbox';

interface SkillFormProps {
  initialData?: Skill;
  onSave: (data: Skill) => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState<Skill>(
    initialData || {
      name: '',
      level: 'intermediate',
      endorsements: 0,
      category: ''
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

  const skillCategories = [
    t('skill_category_frontend', '前端开发'),
    t('skill_category_backend', '后端开发'),
    t('skill_category_mobile', '移动开发'),
    t('skill_category_database', '数据库'),
    t('skill_category_ai', '人工智能'),
    t('skill_category_data_science', '数据科学'),
    t('skill_category_cloud', '云服务'),
    t('skill_category_devops', '运维'),
    t('skill_category_design', '设计'),
    t('skill_category_product', '产品管理'),
    t('skill_category_project', '项目管理'),
    t('skill_category_language', '语言'),
    t('skill_category_soft_skills', '软技能'),
    t('skill_category_other', '其他')
  ];

  // 转换为GenericListbox需要的选项格式
  const categoryOptions: SelectOption[] = skillCategories.map((category) => ({
    id: category,
    label: category,
  }));

  const levelOptions: SelectOption[] = [
    { id: 'beginner', label: t('skill_level_beginner', '入门') },
    { id: 'intermediate', label: t('skill_level_intermediate', '中级') },
    { id: 'advanced', label: t('skill_level_advanced', '高级') },
    { id: 'expert', label: t('skill_level_expert', '专家') }
  ];

  // 处理类别选择变化
  const handleCategoryChange = (option: SelectOption | null) => {
    if (option) {
      setFormData(prev => ({ ...prev, category: option.id.toString() }));
    }
  };

  // 处理级别选择变化
  const handleLevelChange = (option: SelectOption | null) => {
    if (option) {
      // 确保转换为Skill.level允许的联合类型
      const level = option.id.toString() as 'beginner' | 'intermediate' | 'advanced' | 'expert';
      setFormData(prev => ({ ...prev, level }));
    }
  };

  // 查找当前选中的类别选项
  const selectedCategory = categoryOptions.find(option => option.id === formData.category) || null;
  
  // 查找当前选中的级别选项
  const selectedLevel = levelOptions.find(option => option.id === formData.level) || null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {initialData ? t('edit_skill', '编辑技能') : t('add_skill', '添加技能')}
      </h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('skill_name', '技能名称')} *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={t('skill_name_placeholder', '例如：React、Python、UI设计')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <GenericListbox
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          label={t('skill_category', '技能类别')}
          placeholder={t('select_category', '请选择类别')}
          required={true}
          name="category"
        />
      </div>
      
      <div>
        <GenericListbox
          options={levelOptions}
          value={selectedLevel}
          onChange={handleLevelChange}
          label={t('skill_level', '技能水平')}
          required={true}
          name="level"
        />
      </div>
      
      {initialData && (
        <div>
          <label htmlFor="endorsements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('endorsements', '认可数')}
          </label>
          <input
            type="number"
            id="endorsements"
            name="endorsements"
            value={formData.endorsements}
            onChange={handleChange}
            min={0}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      )}
      
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

export default SkillForm; 