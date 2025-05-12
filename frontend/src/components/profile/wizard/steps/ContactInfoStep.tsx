import React, { useState, ChangeEvent, FormEvent } from 'react';

interface ContactInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
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
      newErrors.email = '请输入有效的电子邮箱地址';
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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">联系信息</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              电子邮箱
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              电话号码
            </label>
            <div className="mt-1">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                placeholder="+86 123 4567 8910"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              个人网站
            </label>
            <div className="mt-1">
              <input
                type="url"
                name="website"
                id="website"
                value={formData.contactInfo.website}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              地址
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="address"
                id="address"
                value={formData.contactInfo.address}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                placeholder="城市, 国家"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">社交媒体</h3>
            
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-5">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onPrevious}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                上一步
              </button>
              
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
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

export default ContactInfoStep; 