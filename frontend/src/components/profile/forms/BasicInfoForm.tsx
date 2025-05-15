import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BasicInfoFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    headline: string;
    biography: string;
    contactInfo: {
      email: string;
      phone: string;
      website: string;
      address: string;
      socialMedia: {
        linkedin: string;
        github: string;
        twitter: string;
        other: Array<{ name: string; url: string }>;
      };
    };
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);
  const [newSocialMedia, setNewSocialMedia] = useState({ name: '', url: '' });
  const { t } = useTranslation('profile');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        socialMedia: {
          ...prev.contactInfo.socialMedia,
          [name]: value
        }
      }
    }));
  };

  const handleAddSocialMedia = () => {
    if (newSocialMedia.name && newSocialMedia.url) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          socialMedia: {
            ...prev.contactInfo.socialMedia,
            other: [
              ...prev.contactInfo.socialMedia.other,
              { name: newSocialMedia.name, url: newSocialMedia.url }
            ]
          }
        }
      }));
      setNewSocialMedia({ name: '', url: '' });
    }
  };

  const handleRemoveSocialMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        socialMedia: {
          ...prev.contactInfo.socialMedia,
          other: prev.contactInfo.socialMedia.other.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('first_name', '名')} *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder={t('first_name_placeholder', '例如：三')}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('last_name', '姓')} *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder={t('last_name_placeholder', '例如：张')}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>

      <div>
        <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('job_title', '职位名称')} *
        </label>
        <input
          type="text"
          id="headline"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          required
          placeholder={t('job_title_placeholder', '例如：资深前端工程师 | React专家')}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="biography" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('personal_bio', '个人简介')} *
        </label>
        <textarea
          id="biography"
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          required
          rows={4}
          placeholder={t('personal_bio_placeholder', '简单介绍一下自己的专业背景、兴趣和目标')}
          className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('contact_info', '联系方式')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email', '电子邮箱')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.contactInfo.email}
              onChange={handleContactInfoChange}
              required
              className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('phone', '电话号码')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.contactInfo.phone}
              onChange={handleContactInfoChange}
              className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('personal_website', '个人网站')}
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.contactInfo.website}
            onChange={handleContactInfoChange}
            placeholder="https://"
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('location', '所在地')}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.contactInfo.address}
            onChange={handleContactInfoChange}
            placeholder={t('location_placeholder', '例如：北京市海淀区')}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('social_media', '社交媒体')}</h3>
        
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.contactInfo.socialMedia.linkedin}
            onChange={handleSocialMediaChange}
            placeholder="https://linkedin.com/in/your-profile"
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GitHub
          </label>
          <input
            type="url"
            id="github"
            name="github"
            value={formData.contactInfo.socialMedia.github}
            onChange={handleSocialMediaChange}
            placeholder="https://github.com/your-username"
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Twitter
          </label>
          <input
            type="url"
            id="twitter"
            name="twitter"
            value={formData.contactInfo.socialMedia.twitter}
            onChange={handleSocialMediaChange}
            placeholder="https://twitter.com/your-username"
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('other_social_media', '其他社交媒体')}
          </label>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSocialMedia.name}
                onChange={(e) => setNewSocialMedia({ ...newSocialMedia, name: e.target.value })}
                placeholder={t('platform_name', '平台名称')}
                className="w-1/3 h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
              <input
                type="url"
                value={newSocialMedia.url}
                onChange={(e) => setNewSocialMedia({ ...newSocialMedia, url: e.target.value })}
                placeholder={t('link', '链接')}
                className="flex-1 h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
              <button
                type="button"
                onClick={handleAddSocialMedia}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {t('add', '添加')}
              </button>
            </div>
            
            {formData.contactInfo.socialMedia.other.length > 0 && (
              <ul className="space-y-2">
                {formData.contactInfo.socialMedia.other.map((item, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100/50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}: </span>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{item.url}</a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialMedia(index)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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

export default BasicInfoForm; 