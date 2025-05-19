import React, { useState, useEffect } from 'react';
import { Certification } from '../../../types/profile';
import { useTranslation } from 'react-i18next';
import { formatDateForInput } from '@/utils/dateUtils';

interface CertificationFormProps {
  initialData?: Certification;
  onSave: (data: Certification) => void;
  onCancel: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState<Certification>(
    initialData || {
      name: '',
      issuer: '',
      issueDate: '',
      expirationDate: null,
      credentialId: '',
      credentialUrl: ''
    }
  );
  
  const [neverExpires, setNeverExpires] = useState(!initialData?.expirationDate);
  
  // 初始化时处理日期格式
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        issueDate: formatDateForInput(initialData.issueDate),
        expirationDate: initialData.expirationDate ? formatDateForInput(initialData.expirationDate) : null
      }));
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpirationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setNeverExpires(isChecked);
    setFormData((prev) => ({
      ...prev,
      expirationDate: isChecked ? null : prev.expirationDate || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {initialData ? t('edit_certification', '编辑证书') : t('add_certification', '添加证书')}
      </h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('certification_name', '证书名称')} *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={t('certification_name_placeholder', '例如：AWS 解决方案架构师')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('certification_issuer', '颁发机构')} *
        </label>
        <input
          type="text"
          id="issuer"
          name="issuer"
          value={formData.issuer}
          onChange={handleChange}
          required
          placeholder={t('certification_issuer_placeholder', '例如：Amazon Web Services')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('issue_date', '颁发日期')} *
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={typeof formData.issueDate === 'string' ? formData.issueDate : ''}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('expiration_date', '到期日期')} {neverExpires ? '' : '*'}
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="neverExpires"
                checked={neverExpires}
                onChange={handleExpirationToggle}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="neverExpires" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('never_expires', '永不过期')}
              </label>
            </div>
          </div>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate && typeof formData.expirationDate === 'string' ? formData.expirationDate : ''}
            onChange={handleChange}
            disabled={neverExpires}
            required={!neverExpires}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('credential_id', '证书编号')}
        </label>
        <input
          type="text"
          id="credentialId"
          name="credentialId"
          value={formData.credentialId}
          onChange={handleChange}
          placeholder={t('credential_id_placeholder', '例如：AWS-ASA-12345')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('credential_url', '证书链接')}
        </label>
        <input
          type="url"
          id="credentialUrl"
          name="credentialUrl"
          value={formData.credentialUrl}
          onChange={handleChange}
          placeholder="https://"
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('credential_url_help', '提供证书验证的在线链接（如有）')}
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

export default CertificationForm; 