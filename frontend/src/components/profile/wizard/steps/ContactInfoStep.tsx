import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ContactInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState({
    contactInfo: {
      email: data.contactInfo?.email || '',
      phone: data.contactInfo?.phone || '',
      website: data.contactInfo?.website || '',
      address: data.contactInfo?.address || '',
      socialMedia: {
        linkedin: data.contactInfo?.socialMedia?.linkedin || '',
        github: data.contactInfo?.socialMedia?.github || '',
        twitter: data.contactInfo?.socialMedia?.twitter || ''
      }
    }
  });
  
  const [errors, setErrors] = useState({
    email: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // 处理嵌套属性 (如 socialMedia.linkedin)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        contactInfo: {
          ...formData.contactInfo,
          [parent]: {
            ...formData.contactInfo[parent as keyof typeof formData.contactInfo] as Record<string, any>,
            [child]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        contactInfo: {
          ...formData.contactInfo,
          [name]: value
        }
      });
    }
    
    // 清除错误
    if (name === 'email' && errors.email) {
      setErrors({
        ...errors,
        email: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: ''
    };
    
    let isValid = true;
    
    // 验证邮箱格式（如果填写了）
    if (formData.contactInfo.email && !/^\S+@\S+\.\S+$/.test(formData.contactInfo.email)) {
      newErrors.email = t('invalid_email', '请输入有效的电子邮箱地址');
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{t('contact_info', '联系信息')}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('email', '电子邮箱')}
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                  errors.email ? 'ring-red-500 dark:ring-red-500' : 'ring-gray-900/5 dark:ring-gray-100/5'
                } focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('phone', '电话号码')}
            </label>
            <div className="mt-1">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                placeholder="+86 123 4567 8910"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('personal_website', '个人网站')}
            </label>
            <div className="mt-1">
              <input
                type="url"
                name="website"
                id="website"
                value={formData.contactInfo.website}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('location', '地址')}
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="address"
                id="address"
                value={formData.contactInfo.address}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                placeholder={t('location_placeholder', '城市, 国家')}
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('social_media', '社交媒体')}</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="socialMedia.linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  LinkedIn
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="socialMedia.linkedin"
                    id="socialMedia.linkedin"
                    value={formData.contactInfo.socialMedia.linkedin}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="socialMedia.github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="socialMedia.github"
                    id="socialMedia.github"
                    value={formData.contactInfo.socialMedia.github}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="socialMedia.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Twitter
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="socialMedia.twitter"
                    id="socialMedia.twitter"
                    value={formData.contactInfo.socialMedia.twitter}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactInfoStep; 