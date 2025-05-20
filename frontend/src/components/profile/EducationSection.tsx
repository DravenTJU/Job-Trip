import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { Education } from '../../types/profile';
import ProfileSection from './ProfileSection';
import EducationForm from './forms/EducationForm';
import { useTranslation } from 'react-i18next';
import CustomConfirmDialog from '../common/CustomConfirmDialog';
import { 
  addEducation, 
  updateEducation,
  deleteEducation 
} from '../../redux/slices/profileSlice';

interface EducationSectionProps {
  educations: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ educations }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('profile');
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingItem(null);
  };

  const handleEdit = (education: Education) => {
    setEditingItem(education);
    setIsAdding(false);
  };

  const handleSave = (data: Education) => {
    if (isAdding) {
      dispatch(addEducation(data));
    } else if (editingItem?._id) {
      dispatch(updateEducation({ educationId: editingItem._id, education: data }));
    }
    
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleDelete = (educationId: string) => {
    setEducationToDelete(educationId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (educationToDelete) {
      dispatch(deleteEducation(educationToDelete));
      setShowDeleteConfirm(false);
      setEducationToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  if (isAdding || editingItem) {
    return (
      <EducationForm
        initialData={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <>
      <ProfileSection
        title={t('education', '教育经历')}
        onAddNew={handleAddNew}
        isEmpty={educations.length === 0}
        emptyMessage={t('add_education_prompt', '添加你的教育经历，包括学校、学位和专业')}
      >
        <div className="space-y-6">
          {educations.map((education) => (
            <div
              key={education._id}
              className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-5 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/5 hover:ring-indigo-500/20 dark:hover:ring-indigo-500/20 transition-shadow"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {education.institution}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {education.degree} • {education.field}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(education)}
                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => education._id && handleDelete(education._id)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>
                  {new Date(education.startDate).getFullYear()} - {education.endDate ? new Date(education.endDate).getFullYear() : t('present', '至今')}
                </span>
              </div>
              
              {education.location && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>{education.location}</span>
                </div>
              )}
              
              {education.description && (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm mt-2">
                  {education.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* 删除确认对话框 */}
      <CustomConfirmDialog
        open={showDeleteConfirm}
        title={t('delete_education', '删除教育经历')}
        message={t('confirm_delete_education', '确定要删除此教育经历吗？此操作无法撤销。')}
        confirmText={t('delete', '删除')}
        cancelText={t('cancel', '取消')}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

export default EducationSection; 