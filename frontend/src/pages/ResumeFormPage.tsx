import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchResume, createResume, updateResume, clearResume, generateTailoredResume } from '@/redux/slices/resumesSlice';
import { CreateResumeData, ResumeType } from '@/types';
import Loader from '@/components/common/Loader';
import { Plus, Trash } from 'lucide-react';
import { formatDateForInput } from '@/utils/dateUtils';
import profileService from '@/services/profileService';
import { mapProfileToResume } from '@/utils/profileToResumeMapper';
import { UserProfile } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import Toast, { ToastType } from '@/components/common/Toast';

/**
 * 简历表单页面组件
 * 用于创建和编辑简历
 */
const ResumeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const baseId = searchParams.get('baseId');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resume, isLoading, error } = useAppSelector((state) => state.resumes);
  const { t } = useTranslation('resume');
  
  // Toast消息状态
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  
  // 用户档案状态
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateResumeData>({
    name: '',
    content: '',
    type: typeParam === ResumeType.TAILORED ? ResumeType.TAILORED : ResumeType.BASE,
    targetPosition: '',
    targetJob: '',
    tailored: typeParam === ResumeType.TAILORED,
  });
  
  // 教育背景数据
  const [educations, setEducations] = useState<Array<{
    education: string;
    school: string;
    major: string;
    startDate: string;
    endDate: string;
  }>>([{
    education: '',
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  }]);
  
  // 工作经历数据
  const [workExperiences, setWorkExperiences] = useState<Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }>>([{
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    responsibilities: ''
  }]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const isEditMode = Boolean(id);

  // 加载简历数据（编辑模式或基于现有简历创建定制简历）
  useEffect(() => {
    if (isEditMode && id) {
      // 编辑模式：加载要编辑的简历
      dispatch(fetchResume(id));
    } else if (baseId) {
      // 基于现有简历创建定制简历：加载基础简历
      dispatch(fetchResume(baseId));
    }

    // 组件卸载时清除当前简历
    return () => {
      dispatch(clearResume());
    };
  }, [dispatch, id, baseId, isEditMode]);

  // 获取当前用户信息
  const { user } = useAppSelector((state) => state.auth);

  // 在创建新简历时获取用户档案数据
  useEffect(() => {
    // 仅在新建简历模式下获取用户档案
    if (!isEditMode && !baseId) {
      const fetchUserProfile = async () => {
        try {
          setIsLoadingProfile(true);
          setProfileError(null);
          const profileData = await profileService.getUserProfile();
          setUserProfile(profileData);
          
          // 使用档案数据映射和填充表单
          if (profileData) {
            const { personalInfo, educations: mappedEducations, workExperiences: mappedWorkExperiences, skillsText } = mapProfileToResume(profileData);
            
            // 设置教育背景和工作经历
            setEducations(mappedEducations);
            setWorkExperiences(mappedWorkExperiences);
            
            // 使用setTimeout确保DOM元素已经存在
            setTimeout(() => {
              // 填充个人信息
              const fullNameElement = document.getElementById('fullName') as HTMLInputElement;
              const emailElement = document.getElementById('email') as HTMLInputElement;
              const phoneElement = document.getElementById('phone') as HTMLInputElement;
              const locationElement = document.getElementById('location') as HTMLInputElement;
              const skillsElement = document.getElementById('skills') as HTMLTextAreaElement;
              
              if (fullNameElement) fullNameElement.value = personalInfo.fullName;
              if (emailElement) emailElement.value = personalInfo.email;
              if (phoneElement) phoneElement.value = personalInfo.phone;
              if (locationElement) locationElement.value = personalInfo.location;
              if (skillsElement) skillsElement.value = skillsText;
            }, 100);
            
            // 显示成功提示
            setToast({
              show: true,
              message: t('profile_data_filled', '已自动填充您的个人档案信息，您可以根据需要修改'),
              type: 'success'
            });
          }
        } catch (error) {
          console.error('获取用户档案失败:', error);
          setProfileError(t('profile_load_error', '无法加载用户档案数据，请刷新页面重试'));
          
          // 显示错误提示
          setToast({
            show: true,
            message: t('profile_load_error', '无法加载用户档案数据，请刷新页面重试'),
            type: 'error'
          });
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchUserProfile();
    }
  }, [isEditMode, baseId, t]);

  // 当简历数据加载完成后，更新表单数据
  useEffect(() => {    
    // 如果是新建简历模式且有用户数据，预填用户信息
    if (!isEditMode && !baseId && user && !userProfile) {
      setTimeout(() => {
        // 预填个人信息
        const fullNameElement = document.getElementById('fullName') as HTMLInputElement;
        const emailElement = document.getElementById('email') as HTMLInputElement;
        
        // 组合姓名
        const fullName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.firstName || user.lastName || '';
          
        if (fullNameElement && fullName) fullNameElement.value = fullName;
        if (emailElement && user.email) emailElement.value = user.email;
      }, 100);
    }
    if (resume && (isEditMode || baseId)) {
      // 如果是基于现有简历创建定制简历，修改部分字段
      if (baseId && !isEditMode) {
        setFormData({
          name: `${resume.name} - 定制版`,
          content: resume.content,
          type: ResumeType.TAILORED,
          targetPosition: resume.targetPosition || '',
          targetJob: '',
          tailored: true,
        });
      } else {
        // 编辑模式：保持原有数据
        setFormData({
          name: resume.name,
          content: resume.content,
          type: resume.type,
          targetPosition: resume.targetPosition || '',
          targetJob: resume.targetJob || '',
          tailored: resume.tailored,
        });
      }
      
      // 从resume.content中解析教育背景和工作经历的逻辑
      try {
        const resumeData = JSON.parse(resume.content);
        
        // 填充教育背景数据
        if (resumeData.educations && Array.isArray(resumeData.educations) && resumeData.educations.length > 0) {
          // 确保日期格式正确
          const formattedEducations = resumeData.educations.map((edu: any) => ({
            ...edu,
            startDate: edu.startDate ? formatDateForInput(edu.startDate) : '',
            endDate: edu.endDate ? formatDateForInput(edu.endDate) : ''
          }));
          setEducations(formattedEducations);
        }
        
        // 填充工作经历数据
        if (resumeData.workExperiences && Array.isArray(resumeData.workExperiences) && resumeData.workExperiences.length > 0) {
          // 确保日期格式正确
          const formattedWorkExperiences = resumeData.workExperiences.map((work: any) => ({
            ...work,
            startDate: work.startDate ? formatDateForInput(work.startDate) : '',
            endDate: work.endDate ? formatDateForInput(work.endDate) : ''
          }));
          setWorkExperiences(formattedWorkExperiences);
        }
        
        // 填充技能数据
        if (resumeData.skills && typeof resumeData.skills === 'string') {
          setTimeout(() => {
            const skillsElement = document.getElementById('skills') as HTMLTextAreaElement;
            if (skillsElement) skillsElement.value = resumeData.skills;
          }, 0);
        }
        
        // 填充个人信息
        if (resumeData.personalInfo) {
          const { fullName, email, phone, location } = resumeData.personalInfo;
          setTimeout(() => {
            const fullNameElement = document.getElementById('fullName') as HTMLInputElement;
            const emailElement = document.getElementById('email') as HTMLInputElement;
            const phoneElement = document.getElementById('phone') as HTMLInputElement;
            const locationElement = document.getElementById('location') as HTMLInputElement;
            
            if (fullNameElement && fullName) fullNameElement.value = fullName;
            if (emailElement && email) emailElement.value = email;
            if (phoneElement && phone) phoneElement.value = phone;
            if (locationElement && location) locationElement.value = location;
          }, 0);
        }
      } catch (error) {
        console.error('解析简历内容失败:', error);
        // 解析失败时保留默认值
      }
    }
  }, [resume, isEditMode]);

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      // 如果类型是定制简历，自动设置tailored为true
      const resumeType = value === ResumeType.TAILORED.toString() ? ResumeType.TAILORED : ResumeType.BASE;
      const isTailored = resumeType === ResumeType.TAILORED;
      setFormData({
        ...formData,
        type: resumeType,
        tailored: isTailored,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // 处理教育背景变更
  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value
    };
    setEducations(updatedEducations);
  };
  
  // 处理工作经历变更
  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    const updatedWorkExperiences = [...workExperiences];
    updatedWorkExperiences[index] = {
      ...updatedWorkExperiences[index],
      [field]: value
    };
    setWorkExperiences(updatedWorkExperiences);
  };
  
  // 添加教育背景
  const addEducation = () => {
    setEducations([...educations, {
      education: '',
      school: '',
      major: '',
      startDate: '',
      endDate: ''
    }]);
  };
  
  // 删除教育背景
  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };
  
  // 添加工作经历
  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: ''
    }]);
  };
  
  // 删除工作经历
  const removeWorkExperience = (index: number) => {
    if (workExperiences.length > 1) {
      setWorkExperiences(workExperiences.filter((_, i) => i !== index));
    }
  };

  // 处理AI生成定制简历
  const handleGenerateTailoredResume = async () => {
    if (!formData.targetPosition || !formData.targetJob || !formData.content) {
      setGenerationError(t('fill_target_fields', '请填写目标职位、目标工作和简历内容'));
      
      // 显示错误提示
      setToast({
        show: true,
        message: t('fill_target_fields', '请填写目标职位、目标工作和简历内容'),
        type: 'error'
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      setGenerationError(null);
      
      const resultAction = await dispatch(generateTailoredResume({
        baseContent: formData.content,
        targetPosition: formData.targetPosition,
        targetJob: formData.targetJob
      }));
      
      if (generateTailoredResume.fulfilled.match(resultAction)) {
        setFormData({
          ...formData,
          content: resultAction.payload
        });
        
        // 显示成功提示
        setToast({
          show: true,
          message: t('generation_success', '定制简历生成成功'),
          type: 'success'
        });
      } else if (generateTailoredResume.rejected.match(resultAction)) {
        setGenerationError(resultAction.payload as string || t('generation_failed', '生成失败，请重试'));
        
        // 显示错误提示
        setToast({
          show: true,
          message: resultAction.payload as string || t('generation_failed', '生成失败，请重试'),
          type: 'error'
        });
      }
    } catch (error) {
      setGenerationError((error as Error).message);
      
      // 显示错误提示
      setToast({
        show: true,
        message: (error as Error).message,
        type: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 将教育背景和工作经历数据整合到content中
    const resumeContent = JSON.stringify({
      educations,
      workExperiences,
      skills: (document.getElementById('skills') as HTMLTextAreaElement)?.value || '',
      personalInfo: {
        fullName: (document.getElementById('fullName') as HTMLInputElement)?.value || '',
        email: (document.getElementById('email') as HTMLInputElement)?.value || '',
        phone: (document.getElementById('phone') as HTMLInputElement)?.value || '',
        location: (document.getElementById('location') as HTMLInputElement)?.value || ''
      }
    });
    
    const updatedFormData = {
      ...formData,
      content: resumeContent
    };
    
    try {
      if (isEditMode && id) {
        await dispatch(updateResume({ id, data: updatedFormData }));
        
        // 显示成功提示
        setToast({
          show: true,
          message: t('resume_update_success', '简历更新成功'),
          type: 'success'
        });
      } else {
        await dispatch(createResume(updatedFormData));
        
        // 显示成功提示
        setToast({
          show: true,
          message: t('resume_create_success', '简历创建成功'),
          type: 'success'
        });
      }
      
      // 延迟导航，给用户时间看到成功提示
      setTimeout(() => {
        navigate('/resume-builder');
      }, 1500);
    } catch (error) {
      // 显示错误提示
      setToast({
        show: true,
        message: t('save_failed', '保存失败，请重试'),
        type: 'error'
      });
    }
  };

  // 处理Toast关闭
  const handleToastClose = () => {
    setToast(prev => ({
      ...prev,
      show: false
    }));
  };

  if (isLoading && isEditMode) {
    return <Loader />;
  }

  return (
    <div className="container-lg px-4">
      <div className="section space-y-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {isEditMode ? t('edit_resume', '编辑简历') : t('create_resume', '创建新简历')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isEditMode 
            ? t('update_resume_description', '更新您的简历信息，使其保持最新状态') 
            : t('create_resume_description', '创建一份新的简历，展示您的技能和经验')}
        </p>
      </div>

      {/* 加载提示 */}
      {isLoadingProfile && <div className="text-center py-4">{t('loading_profile', '正在加载个人档案数据...')}</div>}

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 mb-8">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name"><h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{t('resume_name', '简历名称')}</h3></label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('resume_name_placeholder', '例如：软件工程师简历')}
              />
            </div>

            {/* 简历类型已隐藏，默认为基础简历，除非URL参数指定为定制简历 */}
            <input
              type="hidden"
              id="type"
              name="type"
              value={formData.type}
            />

            {formData.type === ResumeType.TAILORED && (
              <>
                <div className="mb-6">
                  <label htmlFor="targetPosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('target_position', '目标职位')}</label>
                  <input
                    type="text"
                    id="targetPosition"
                    name="targetPosition"
                    className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    value={formData.targetPosition}
                    onChange={handleChange}
                    placeholder={t('target_position_placeholder', '例如：前端工程师')}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="targetJob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('target_job', '目标工作')}</label>
                  <input
                    type="text"
                    id="targetJob"
                    name="targetJob"
                    className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    value={formData.targetJob}
                    onChange={handleChange}
                    placeholder={t('target_job_placeholder', '例如：Google前端工程师')}
                    required
                  />
                </div>
                
                {generationError && (
                  <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400 mb-6">
                    {generationError}
                  </div>
                )}
                
                <div className="mb-6">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
                    onClick={handleGenerateTailoredResume}
                    disabled={isGenerating}
                  >
                    {isGenerating ? t('generating', '生成中...') : t('generate_tailored_resume', 'AI生成定制简历内容')}
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t('generate_tailored_resume_tip', '点击按钮使用AI根据您的基础简历内容和目标职位生成定制简历')}
                  </p>
                </div>
              </>
            )}

              {/* 个人信息部分 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('personal_info', '个人信息')}</h3>
                </div>
                <div className="mb-6">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('full_name', '姓名')}</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder={t('full_name_placeholder', '请输入您的姓名')}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email', '邮箱')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder={t('email_placeholder', '请输入您的邮箱')}
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone', '电话')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder={t('phone_placeholder', '请输入您的电话号码')}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location', '所在地')}</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder={t('location_placeholder', '城市，省份')}
                  />
                </div>
              </div>
              
              {/* 教育背景部分 */}
              <div className="form-section">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('education_background', '教育背景')}</h3>
                  <button 
                    type="button" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={addEducation}
                  >
                    <Plus className="w-4 h-4" />
                    {t('add_education', '添加教育经历')}
                  </button>
                </div>
                
                {educations.map((education, index) => (
                  <div key={index} className="education-item mb-4 p-3 border rounded">
                    <div className="education-header flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium">{t('education_experience', '教育经历')} #{index + 1}</h4>
                      {educations.length > 1 && (
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm" 
                          onClick={() => removeEducation(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor={`education-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('degree', '学历')}</label>
                      <input
                        type="text"
                        id={`education-${index}`}
                        name={`education-${index}`}
                        className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        value={education.education}
                        onChange={(e) => handleEducationChange(index, 'education', e.target.value)}
                        placeholder={t('degree_placeholder', '最高学历')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="mb-2">
                        <label htmlFor={`school-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('school', '学校')}</label>
                        <input
                          type="text"
                          id={`school-${index}`}
                          name={`school-${index}`}
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                          value={education.school}
                          onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                          placeholder={t('school_placeholder', '毕业院校')}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor={`major-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('major', '专业')}</label>
                        <input
                          type="text"
                          id={`major-${index}`}
                          name={`major-${index}`}
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                          value={education.major}
                          onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                          placeholder={t('major_placeholder', '所学专业')}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-2">
                        <label htmlFor={`eduStartDate-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('start_date', '入学时间')}</label>
                        <input
                          type="date"
                          id={`eduStartDate-${index}`}
                          name={`eduStartDate-${index}`}
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                          value={formatDateForInput(education.startDate)}
                          onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor={`eduEndDate-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('end_date', '毕业时间')}</label>
                        <input
                          type="date"
                          id={`eduEndDate-${index}`}
                          name={`eduEndDate-${index}`}
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                          value={formatDateForInput(education.endDate)}
                          onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 工作经历部分 */}
              <div className="form-section mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('work_experience', '工作经历')}</h3>
                  <button 
                    type="button" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={addWorkExperience}
                  >
                    <Plus className="w-4 h-4" />
                    {t('add_work_experience', '添加工作经历')}
                  </button>
                </div>
                
                {workExperiences.map((experience, index) => (
                  <div key={index} className="work-experience-item mb-4 p-3 border rounded">
                    <div className="work-experience-header flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium">{t('work_experience_item', '工作经历')} #{index + 1}</h4>
                      {workExperiences.length > 1 && (
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm" 
                          onClick={() => removeWorkExperience(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('company', '公司名称')}</label>
                      <input
                        type="text"
                        id={`company-${index}`}
                        name={`company-${index}`}
                        className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        value={experience.company}
                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                        placeholder={t('company_placeholder', '公司名称')}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('position', '职位')}</label>
                      <input
                        type="text"
                        id={`position-${index}`}
                        name={`position-${index}`}
                        className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        value={experience.position}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                        placeholder={t('position_placeholder', '担任职位')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="mb-2">
                        <label htmlFor={`workStartDate-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('work_start_date', '开始时间')}</label>
                        <input
                          type="date"
                          id={`workStartDate-${index}`}
                          name={`workStartDate-${index}`}
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                          value={formatDateForInput(experience.startDate)}
                          onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor={`workEndDate-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('work_end_date', '结束时间')}</label>
                        <input
                          type="date"
                          id={`workEndDate-${index}`}
                          name={`workEndDate-${index}`}
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                          value={formatDateForInput(experience.endDate)}
                          onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`responsibilities-${index}`} className="form-label">{t('job_responsibilities', '工作职责与成就')}</label>
                      <textarea
                        id={`responsibilities-${index}`}
                        name={`responsibilities-${index}`}
                        className="w-full min-h-[120px] px-3 py-2 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow resize-y"
                        rows={4}
                        value={experience.responsibilities}
                        onChange={(e) => handleWorkExperienceChange(index, 'responsibilities', e.target.value)}
                        placeholder={t('responsibilities_placeholder', '描述您的主要职责和取得的成就，例如：\n• 负责项目X的前端开发，使用React和TypeScript\n• 优化了页面加载速度，提升了30%的性能\n• 带领3人小组完成了关键功能的开发')}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 技能部分 */}
              <div className="form-section mb-8">
              <label htmlFor="skills"><h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{t('skills', '专业技能')}</h3></label>
              <div className="mb-4">
                  <textarea
                    id="skills"
                    name="skills"
                    className="w-full min-h-[120px] px-3 py-2 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow resize-y"
                    rows={4}
                    placeholder={t('skills_placeholder', '列出您的专业技能，例如：\n• 前端开发：React, Vue, TypeScript, HTML5, CSS3\n• 后端开发：Node.js, Express, MongoDB\n• 工具：Git, Docker, Webpack\n• 语言：JavaScript, Python, Java')}
                  />
                </div>
              </div>
              
              {/* 隐藏的内容字段，用于存储结构化数据 */}
              <input
                type="hidden"
                id="content"
                name="content"
                value={formData.content}
              />

            <div className="flex justify-end gap-4 mt-8">
              <button 
                type="button" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigate('/resume-builder')}
              >
                {t('cancel', '取消')}
              </button>
              <button 
                type="submit" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {isEditMode ? t('update_resume', '更新简历') : t('create_resume', '创建简历')}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* 显示Toast消息 */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={30000}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
};

export default ResumeFormPage;