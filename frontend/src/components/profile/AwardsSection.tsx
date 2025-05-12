import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { HonorAward } from '../../types/profile';
import ProfileSection from './ProfileSection';
import AwardForm from './forms/AwardForm';
import { 
  addHonorAward, 
  updateHonorAward,
  deleteHonorAward 
} from '../../redux/slices/profileSlice';

interface AwardsSectionProps {
  honorsAwards: HonorAward[];
}

const AwardsSection: React.FC<AwardsSectionProps> = ({ honorsAwards }) => {
  const dispatch = useAppDispatch();
  const [editingItem, setEditingItem] = useState<HonorAward | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingItem(null);
  };

  const handleEdit = (award: HonorAward) => {
    setEditingItem(award);
    setIsAdding(false);
  };

  const handleSave = (data: HonorAward) => {
    if (isAdding) {
      dispatch(addHonorAward(data));
    } else if (editingItem?._id) {
      dispatch(updateHonorAward({ honorAwardId: editingItem._id, honorAward: data }));
    }
    
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleDelete = (awardId: string) => {
    if (window.confirm('确定要删除此荣誉奖项吗？')) {
      dispatch(deleteHonorAward(awardId));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  if (isAdding || editingItem) {
    return (
      <AwardForm
        initialData={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProfileSection
      title="荣誉与奖项"
      onAddNew={handleAddNew}
      isEmpty={honorsAwards.length === 0}
      emptyMessage="添加你获得的荣誉和奖项"
    >
      <div className="space-y-6">
        {honorsAwards.map((award) => (
          <div
            key={award._id}
            className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-5 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/5 hover:ring-indigo-500/20 dark:hover:ring-indigo-500/20 transition-shadow"
          >
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {award.title}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {award.issuer}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(award)}
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => award._id && handleDelete(award._id)}
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
                {new Date(award.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
              </span>
            </div>
            
            {award.description && (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm mt-2">
                {award.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </ProfileSection>
  );
};

export default AwardsSection; 