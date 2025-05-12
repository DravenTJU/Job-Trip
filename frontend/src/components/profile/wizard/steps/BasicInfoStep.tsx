import React, { useState, ChangeEvent, FormEvent } from 'react';

interface BasicInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    headline: data.headline || '',
    photo: data.photo || '',
    biography: data.biography || ''
  });
  
  const [errors, setErrors] = useState({
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
      headline: '',
      biography: ''
    };
    
    let isValid = true;
    
    if (!formData.headline.trim()) {
      newErrors.headline = '请输入您的职业标题';
      isValid = false;
    } else if (formData.headline.length > 100) {
      newErrors.headline = '职业标题不能超过100个字符';
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
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              职业标题 <span className="text-red-500">*</span>
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
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              个人照片
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="photo"
                id="photo"
                value={formData.photo}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                placeholder="输入照片URL地址"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">输入您的照片网址(后续将支持直接上传)</p>
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
          
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoStep; 