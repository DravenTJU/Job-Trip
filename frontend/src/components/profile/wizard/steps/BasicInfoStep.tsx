import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { withLanguageUpdates } from '@/context/LanguageContext';

interface BasicInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate, onNext }) => {
  const { t } = useTranslation('profile');
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    headline: data.headline || '',
    biography: data.biography || ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    biography: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除错误
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      headline: '',
      biography: ''
    };
    
    let isValid = true;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('please_enter_first_name', '请输入您的名字');
      isValid = false;
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = t('first_name_too_long', '名字不能超过50个字符');
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('please_enter_last_name', '请输入您的姓氏');
      isValid = false;
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = t('last_name_too_long', '姓氏不能超过50个字符');
      isValid = false;
    }
    
    if (!formData.headline.trim()) {
      newErrors.headline = t('please_enter_job_title', '请输入您的职位名称');
      isValid = false;
    } else if (formData.headline.length > 100) {
      newErrors.headline = t('job_title_too_long', '职位名称不能超过100个字符');
      isValid = false;
    }
    
    if (!formData.biography.trim()) {
      newErrors.biography = t('please_enter_bio', '请输入您的个人简介');
      isValid = false;
    } else if (formData.biography.length > 2000) {
      newErrors.biography = t('bio_too_long', '个人简介不能超过2000个字符');
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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{t('basic_info', '基本信息')}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('last_name', '姓氏')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                    errors.lastName ? 'ring-red-500 dark:ring-red-500' : 'ring-gray-900/5 dark:ring-gray-100/5'
                  } focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100`}
                  placeholder={t('last_name_placeholder', '例如：张')}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('first_name', '名字')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                    errors.firstName ? 'ring-red-500 dark:ring-red-500' : 'ring-gray-900/5 dark:ring-gray-100/5'
                  } focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100`}
                  placeholder={t('first_name_placeholder', '例如：明')}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('job_title', '职位名称')} <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="headline"
                id="headline"
                value={formData.headline}
                onChange={handleChange}
                className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                  errors.headline ? 'ring-red-500 dark:ring-red-500' : 'ring-gray-900/5 dark:ring-gray-100/5'
                } focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100`}
                placeholder={t('job_title_placeholder', '例如：资深前端开发工程师')}
              />
              {errors.headline && <p className="mt-1 text-sm text-red-500">{errors.headline}</p>}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('job_title_help', '您的职业称谓，会显示在您的档案顶部')}</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="biography" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('personal_bio', '个人简介')} <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="biography"
                name="biography"
                rows={4}
                value={formData.biography}
                onChange={handleChange}
                className={`w-full bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                  errors.biography ? 'ring-red-500 dark:ring-red-500' : 'ring-gray-900/5 dark:ring-gray-100/5'
                } focus:ring-2 focus:ring-indigo-500 transition-shadow px-4 py-3 dark:text-gray-100`}
                placeholder={t('personal_bio_placeholder', '介绍您的专业背景、技能和经验...')}
              />
              {errors.biography && <p className="mt-1 text-sm text-red-500">{errors.biography}</p>}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('personal_bio_help', '简要描述您的专业背景和优势')}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withLanguageUpdates(BasicInfoStep); 