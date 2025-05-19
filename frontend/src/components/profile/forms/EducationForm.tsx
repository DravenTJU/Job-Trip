import React, { useState, useEffect } from 'react';
import { Education } from '../../../types/profile';
import { useTranslation } from 'react-i18next';
import { formatDateForInput } from '@/utils/dateUtils';

interface EducationFormProps {
  initialData?: Education;
  onSave: (data: Education) => void;
  onCancel: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState<Education>(
    initialData || {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: null,
      description: '',
      location: '',
    }
  );
  
  const [currentEducation, setCurrentEducation] = useState(
    initialData ? !initialData.endDate : false
  );

  // 初始化时处理日期格式
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        startDate: formatDateForInput(initialData.startDate),
        endDate: initialData.endDate ? formatDateForInput(initialData.endDate) : null
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrentEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setCurrentEducation(isChecked);
    setFormData((prev) => ({
      ...prev,
      endDate: isChecked ? null : prev.endDate || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {initialData ? t('edit_education', '编辑教育经历') : t('add_education', '添加教育经历')}
      </h2>
      
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('school', '学校')} *
        </label>
        <input
          type="text"
          id="institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          required
          placeholder={t('school_placeholder', '例如：北京大学')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('degree', '学位')} *
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            placeholder={t('degree_placeholder', '例如：学士、硕士、博士')}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('major', '专业')} *
          </label>
          <input
            type="text"
            id="field"
            name="field"
            value={formData.field}
            onChange={handleChange}
            required
            placeholder={t('major_placeholder', '例如：计算机科学')}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('start_date', '开始日期')} *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={typeof formData.startDate === 'string' ? formData.startDate : ''}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('end_date', '结束日期')} {currentEducation ? '' : '*'}
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="currentEducation"
                checked={currentEducation}
                onChange={handleCurrentEducationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="currentEducation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('currently_studying', '正在就读')}
              </label>
            </div>
          </div>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate && typeof formData.endDate === 'string' ? formData.endDate : ''}
            onChange={handleChange}
            disabled={currentEducation}
            required={!currentEducation}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('location', '所在地')}
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder={t('location_placeholder', '例如：北京市海淀区')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('description', '描述')}
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder={t('education_description_placeholder', '描述你的学习成果、课程、项目等')}
          className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
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

export default EducationForm; 