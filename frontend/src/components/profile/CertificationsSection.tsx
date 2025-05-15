import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { Certification } from '../../types/profile';
import ProfileSection from './ProfileSection';
import CertificationForm from './forms/CertificationForm';
import { useTranslation } from 'react-i18next';
import { 
  addCertification, 
  updateCertification,
  deleteCertification 
} from '../../redux/slices/profileSlice';

interface CertificationsSectionProps {
  certifications: Certification[];
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation('profile');
  const [editingItem, setEditingItem] = useState<Certification | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingItem(null);
  };

  const handleEdit = (certification: Certification) => {
    setEditingItem(certification);
    setIsAdding(false);
  };

  const handleSave = (data: Certification) => {
    if (isAdding) {
      dispatch(addCertification(data));
    } else if (editingItem?._id) {
      dispatch(updateCertification({ certificationId: editingItem._id, certification: data }));
    }
    
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleDelete = (certificationId: string) => {
    if (window.confirm(t('confirm_delete_certification', '确定要删除此证书吗？'))) {
      dispatch(deleteCertification(certificationId));
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  if (isAdding || editingItem) {
    return (
      <CertificationForm
        initialData={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProfileSection
      title={t('certifications', '证书与认证')}
      onAddNew={handleAddNew}
      isEmpty={certifications.length === 0}
      emptyMessage={t('add_certifications_prompt', '添加你获得的专业证书和认证')}
    >
      <div className="space-y-6">
        {certifications.map((certification) => (
          <div
            key={certification._id}
            className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-5 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/5 hover:ring-indigo-500/20 dark:hover:ring-indigo-500/20 transition-shadow"
          >
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {certification.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {certification.issuer}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(certification)}
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => certification._id && handleDelete(certification._id)}
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
                {t('issued_on', '颁发于')} {new Date(certification.issueDate).toLocaleDateString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long' })}
                {certification.expirationDate && ` · ${t('valid_until', '有效期至')} ${new Date(certification.expirationDate).toLocaleDateString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long' })}`}
                {!certification.expirationDate && ` · ${t('never_expires', '永久有效')}`}
              </span>
            </div>
            
            {certification.credentialId && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                </svg>
                <span>{t('credential_id', '证书编号')}: {certification.credentialId}</span>
              </div>
            )}
            
            {certification.credentialUrl && (
              <div className="mt-4">
                <a 
                  href={certification.credentialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  {t('view_credential', '查看证书')}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </ProfileSection>
  );
};

export default CertificationsSection; 