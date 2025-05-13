import React, { useState, ChangeEvent, FormEvent } from 'react';

interface BasicInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate, onNext }) => {
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
      newErrors.firstName = '请输入您的名字';
      isValid = false;
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = '名字不能超过50个字符';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = '请输入您的姓氏';
      isValid = false;
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = '姓氏不能超过50个字符';
      isValid = false;
    }
    
    if (!formData.headline.trim()) {
      newErrors.headline = '请输入您的职位名称';
      isValid = false;
    } else if (formData.headline.length > 100) {
      newErrors.headline = '职位名称不能超过100个字符';
      isValid = false;
    }
    
    if (!formData.biography.trim()) {
      newErrors.biography = '请输入您的个人简介';
      isValid = false;
    } else if (formData.biography.length > 2000) {
      newErrors.biography = '个人简介不能超过2000个字符';
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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">基本信息</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                姓氏 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                    errors.lastName ? 'border-red-500' : ''
                  }`}
                  placeholder="例如：张"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                名字 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                    errors.firstName ? 'border-red-500' : ''
                  }`}
                  placeholder="例如：明"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              职位名称 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="headline"
                id="headline"
                value={formData.headline}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                  errors.headline ? 'border-red-500' : ''
                }`}
                placeholder="例如：资深前端开发工程师"
              />
              {errors.headline && <p className="mt-1 text-sm text-red-500">{errors.headline}</p>}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">您的职业称谓，会显示在您的档案顶部</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="biography" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              个人简介 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="biography"
                name="biography"
                rows={4}
                value={formData.biography}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                  errors.biography ? 'border-red-500' : ''
                }`}
                placeholder="介绍您的专业背景、技能和经验..."
              />
              {errors.biography && <p className="mt-1 text-sm text-red-500">{errors.biography}</p>}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">简要描述您的专业背景和优势</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoStep; 