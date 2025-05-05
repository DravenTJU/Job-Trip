import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchResume, createResume, updateResume, clearResume, generateTailoredResume } from '@/redux/slices/resumesSlice';
import { CreateResumeData, ResumeType } from '@/types';
import AlertMessage from '@/components/common/AlertMessage';
import Loader from '@/components/common/Loader';
import { Plus, Trash } from 'lucide-react';

/**
 * 简历表单页面组件
 * 用于创建和编辑简历
 */

// 添加样式
import './ResumeFormPage.css';
const ResumeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const baseId = searchParams.get('baseId');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resume, isLoading, error } = useAppSelector((state) => state.resumes);
  
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

  // 当简历数据加载完成后，更新表单数据
  useEffect(() => {    
    // 如果是新建简历模式且有用户数据，预填用户信息
    if (!isEditMode && !baseId && user) {
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
          setEducations(resumeData.educations);
        }
        
        // 填充工作经历数据
        if (resumeData.workExperiences && Array.isArray(resumeData.workExperiences) && resumeData.workExperiences.length > 0) {
          setWorkExperiences(resumeData.workExperiences);
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
      const isTailored = value === ResumeType.TAILORED;
      setFormData({
        ...formData,
        [name]: value,
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
      setGenerationError('请填写目标职位、目标工作和简历内容');
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
      } else if (generateTailoredResume.rejected.match(resultAction)) {
        setGenerationError(resultAction.payload as string || '生成失败，请重试');
      }
    } catch (error) {
      setGenerationError((error as Error).message);
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
      skills: document.getElementById('skills')?.value || '',
      personalInfo: {
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        location: document.getElementById('location')?.value || ''
      }
    });
    
    const updatedFormData = {
      ...formData,
      content: resumeContent
    };
    
    if (isEditMode && id) {
      await dispatch(updateResume({ id, data: updatedFormData }));
    } else {
      await dispatch(createResume(updatedFormData));
    }
    
    // 提交成功后返回简历列表页面
    navigate('/resume-builder');
  };

  if (isLoading && isEditMode) {
    return <Loader />;
  }

  return (
    <div className="container-lg">
      <div className="section">
        <h1 className="title-lg">{isEditMode ? '编辑简历' : '创建新简历'}</h1>
        <p className="text-description">
          {isEditMode 
            ? '更新您的简历信息，使其保持最新状态' 
            : '创建一份新的简历，展示您的技能和经验'}
        </p>
      </div>

      {error && <AlertMessage type="error" message={error} />}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">简历名称</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="例如：软件工程师简历"
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
                <div className="form-group">
                  <label htmlFor="targetPosition" className="form-label">目标职位</label>
                  <input
                    type="text"
                    id="targetPosition"
                    name="targetPosition"
                    className="form-input"
                    value={formData.targetPosition}
                    onChange={handleChange}
                    placeholder="例如：前端工程师"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="targetJob" className="form-label">目标工作</label>
                  <input
                    type="text"
                    id="targetJob"
                    name="targetJob"
                    className="form-input"
                    value={formData.targetJob}
                    onChange={handleChange}
                    placeholder="例如：Google前端工程师"
                    required
                  />
                </div>
                
                {generationError && (
                  <AlertMessage type="error" message={generationError} />
                )}
                
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleGenerateTailoredResume}
                    disabled={isGenerating}
                  >
                    {isGenerating ? '生成中...' : 'AI生成定制简历内容'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    点击按钮使用AI根据您的基础简历内容和目标职位生成定制简历
                  </p>
                </div>
              </>
            )}

              {/* 个人信息部分 */}
              <div className="form-section">
                <h3 className="form-section-title">个人信息</h3>
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">姓名</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-input"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div className="grid-cols-1-2">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">邮箱</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="请输入您的邮箱"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">电话</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input"
                      placeholder="请输入您的电话号码"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="location" className="form-label">所在地</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                    placeholder="城市，省份"
                  />
                </div>
              </div>
              
              {/* 教育背景部分 */}
              <div className="form-section">
                <div className="form-section-header">
                  <h3 className="form-section-title">教育背景</h3>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm" 
                    onClick={addEducation}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加教育经历
                  </button>
                </div>
                
                {educations.map((education, index) => (
                  <div key={index} className="education-item mb-4 p-3 border rounded">
                    <div className="education-header flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium">教育经历 #{index + 1}</h4>
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
                    
                    <div className="form-group">
                      <label htmlFor={`education-${index}`} className="form-label">学历</label>
                      <input
                        type="text"
                        id={`education-${index}`}
                        name={`education-${index}`}
                        className="form-input"
                        value={education.education}
                        onChange={(e) => handleEducationChange(index, 'education', e.target.value)}
                        placeholder="最高学历"
                      />
                    </div>
                    <div className="grid-cols-1-2">
                      <div className="form-group">
                        <label htmlFor={`school-${index}`} className="form-label">学校</label>
                        <input
                          type="text"
                          id={`school-${index}`}
                          name={`school-${index}`}
                          className="form-input"
                          value={education.school}
                          onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                          placeholder="毕业院校"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`major-${index}`} className="form-label">专业</label>
                        <input
                          type="text"
                          id={`major-${index}`}
                          name={`major-${index}`}
                          className="form-input"
                          value={education.major}
                          onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                          placeholder="所学专业"
                        />
                      </div>
                    </div>
                    <div className="grid-cols-1-2">
                      <div className="form-group">
                        <label htmlFor={`eduStartDate-${index}`} className="form-label">入学时间</label>
                        <input
                          type="date"
                          id={`eduStartDate-${index}`}
                          name={`eduStartDate-${index}`}
                          className="form-input"
                          value={education.startDate}
                          onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`eduEndDate-${index}`} className="form-label">毕业时间</label>
                        <input
                          type="date"
                          id={`eduEndDate-${index}`}
                          name={`eduEndDate-${index}`}
                          className="form-input"
                          value={education.endDate}
                          onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 工作经历部分 */}
              <div className="form-section">
                <div className="form-section-header">
                  <h3 className="form-section-title">工作经历</h3>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm" 
                    onClick={addWorkExperience}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加工作经历
                  </button>
                </div>
                
                {workExperiences.map((experience, index) => (
                  <div key={index} className="work-experience-item mb-4 p-3 border rounded">
                    <div className="work-experience-header flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium">工作经历 #{index + 1}</h4>
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
                    
                    <div className="form-group">
                      <label htmlFor={`company-${index}`} className="form-label">公司名称</label>
                      <input
                        type="text"
                        id={`company-${index}`}
                        name={`company-${index}`}
                        className="form-input"
                        value={experience.company}
                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                        placeholder="公司名称"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`position-${index}`} className="form-label">职位</label>
                      <input
                        type="text"
                        id={`position-${index}`}
                        name={`position-${index}`}
                        className="form-input"
                        value={experience.position}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                        placeholder="担任职位"
                      />
                    </div>
                    <div className="grid-cols-1-2">
                      <div className="form-group">
                        <label htmlFor={`workStartDate-${index}`} className="form-label">开始时间</label>
                        <input
                          type="date"
                          id={`workStartDate-${index}`}
                          name={`workStartDate-${index}`}
                          className="form-input"
                          value={experience.startDate}
                          onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`workEndDate-${index}`} className="form-label">结束时间</label>
                        <input
                          type="date"
                          id={`workEndDate-${index}`}
                          name={`workEndDate-${index}`}
                          className="form-input"
                          value={experience.endDate}
                          onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`responsibilities-${index}`} className="form-label">工作职责与成就</label>
                      <textarea
                        id={`responsibilities-${index}`}
                        name={`responsibilities-${index}`}
                        className="form-textarea enhanced-textarea"
                        rows={4}
                        value={experience.responsibilities}
                        onChange={(e) => handleWorkExperienceChange(index, 'responsibilities', e.target.value)}
                        placeholder="描述您的主要职责和取得的成就，例如：
• 负责项目X的前端开发，使用React和TypeScript
• 优化了页面加载速度，提升了30%的性能
• 带领3人小组完成了关键功能的开发"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 技能部分 */}
              <div className="form-section">
                <h3 className="form-section-title">技能</h3>
                <div className="form-group">
                  <label htmlFor="skills" className="form-label">专业技能</label>
                  <textarea
                    id="skills"
                    name="skills"
                    className="form-textarea enhanced-textarea"
                    rows={4}
                    placeholder="列出您的专业技能，例如：
• 前端开发：React, Vue, TypeScript, HTML5, CSS3
• 后端开发：Node.js, Express, MongoDB
• 工具：Git, Docker, Webpack
• 语言：JavaScript, Python, Java"
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

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => navigate('/resume-builder')}
              >
                取消
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditMode ? '更新简历' : '创建简历'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeFormPage;