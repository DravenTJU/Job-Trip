import React, { useState, ChangeEvent, FormEvent } from 'react';

interface EducationStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

const EducationStep: React.FC<EducationStepProps> = ({ data, onUpdate, onNext, onPrevious, onSkip }) => {
  const [educations, setEducations] = useState<Education[]>(data.educations || []);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
    location: ''
  });
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEducation({
      ...currentEducation,
      [name]: value
    });

    // 清除错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!currentEducation.institution.trim()) {
      newErrors.institution = '请输入学校/机构名称';
      isValid = false;
    }

    if (!currentEducation.degree.trim()) {
      newErrors.degree = '请输入学位/证书名称';
      isValid = false;
    }

    if (!currentEducation.field.trim()) {
      newErrors.field = '请输入专业/领域';
      isValid = false;
    }

    if (!currentEducation.startDate.trim()) {
      newErrors.startDate = '请选择开始日期';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddEducation = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (editIndex >= 0) {
        // 更新现有教育经历
        const updatedEducations = [...educations];
        updatedEducations[editIndex] = currentEducation;
        setEducations(updatedEducations);
        setEditIndex(-1);
      } else {
        // 添加新教育经历
        setEducations([...educations, currentEducation]);
      }

      // 重置表单
      setCurrentEducation({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
        location: ''
      });
      setShowForm(false);
    }
  };

  const handleEditEducation = (index: number) => {
    setCurrentEducation(educations[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
  };

  const handleCancelEdit = () => {
    setCurrentEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      location: ''
    });
    setEditIndex(-1);
    setShowForm(false);
    setErrors({});
  };

  const handleNext = () => {
    onUpdate({
      ...data,
      educations
    });
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">教育经历</h2>
      
      {/* 已添加的教育经历列表 */}
      {educations.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">已添加的教育经历</h3>
          <div className="space-y-4">
            {educations.map((education, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{education.institution}</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {education.degree} • {education.field}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                      {education.startDate} - {education.endDate || '至今'}
                    </p>
                    {education.location && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{education.location}</p>
                    )}
                    {education.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{education.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditEducation(index)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(index)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">没有教育经历</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">添加您的教育背景信息以增强您的档案</p>
        </div>
      )}

      {/* 添加/编辑教育经历表单 */}
      {showForm ? (
        <form onSubmit={handleAddEducation} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                学校/机构 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="institution"
                  id="institution"
                  value={currentEducation.institution}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                    errors.institution ? 'border-red-500' : ''
                  }`}
                />
                {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                地点
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={currentEducation.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                学位/证书 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="degree"
                  id="degree"
                  value={currentEducation.degree}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                    errors.degree ? 'border-red-500' : ''
                  }`}
                />
                {errors.degree && <p className="mt-1 text-sm text-red-500">{errors.degree}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                专业/领域 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="field"
                  id="field"
                  value={currentEducation.field}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                    errors.field ? 'border-red-500' : ''
                  }`}
                />
                {errors.field && <p className="mt-1 text-sm text-red-500">{errors.field}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                开始日期 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="month"
                  name="startDate"
                  id="startDate"
                  value={currentEducation.startDate}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                    errors.startDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                结束日期
              </label>
              <div className="mt-1">
                <input
                  type="month"
                  name="endDate"
                  id="endDate"
                  value={currentEducation.endDate}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                描述
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={currentEducation.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                  placeholder="您可以描述学习成果、课程、活动或其他相关信息"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              {editIndex >= 0 ? '更新' : '添加'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加教育经历
          </button>
        </div>
      )}
      
      {/* 导航按钮 */}
      <div className="flex justify-between pt-5 border-t border-gray-200 dark:border-gray-700 mt-8">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          上一步
        </button>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            跳过此步
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            下一步
            <svg
              className="ml-2 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationStep; 