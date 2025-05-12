import React from 'react';

interface ProfileCompletenessProps {
  completeness: number;
}

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ completeness }) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">档案完整度</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completeness}% 完成</span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400">{completeness < 100 ? '继续完善' : '已完成'}</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-500 h-2.5 rounded-full" 
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
        
        {completeness < 100 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            完善您的档案可以提高职业机会匹配度
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCompleteness; 