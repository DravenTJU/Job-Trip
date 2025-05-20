import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  emptyMessage?: string;
  onAddNew?: () => void;
  isEmpty?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
  emptyMessage,
  onAddNew,
  isEmpty = false
}) => {
  // const dispatch = useAppDispatch();
  const { t } = useTranslation(['profile', 'common']);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <div className="flex gap-2">
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {t('common:add')}
            </button>
          )}
        </div>
      </div>
      
      {isEmpty ? (
        <div className="bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage || t('profile:no_data')}</p>
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {t('common:add')}{title}
            </button>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ProfileSection; 