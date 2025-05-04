import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { createResume } from '@/redux/slices/resumesSlice';
import { CreateResumeData, ResumeType } from '@/types';
import AlertMessage from '@/components/common/AlertMessage';
import Loader from '@/components/common/Loader';
import { Wand2 } from 'lucide-react';
import './ResumeOptimizePreview.css';
import '@/pages/ResumeFormPage.css';

interface ResumeOptimizePreviewProps {
  originalResume: {
    name: string;
    content: string;
    targetPosition?: string;
  };
  optimizedContent: string;
  onClose: () => void;
}

interface OptimizationItem {
  title: string;
  description: string;
  type: 'improved' | 'added' | 'restructured';
}

/**
 * 简历AI优化预览组件
 * 用于显示AI优化后的简历内容，并提供保存为新简历的功能
 */
const ResumeOptimizePreview: React.FC<ResumeOptimizePreviewProps> = ({
  originalResume,
  optimizedContent,
  onClose
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);

  // 解析优化后的内容
  let parsedContent;
  try {
    // 尝试解析JSON格式内容
    parsedContent = JSON.parse(optimizedContent);
  } catch (e) {
    // 如果不是JSON格式，则使用原始内容
    parsedContent = optimizedContent;
  }
  
  // 解析原始简历内容
  let originalParsedContent;
  try {
    originalParsedContent = JSON.parse(originalResume.content);
  } catch (e) {
    originalParsedContent = originalResume.content;
  }
  
  // 分析AI优化项
  useEffect(() => {
    if (typeof parsedContent === 'object' && typeof originalParsedContent === 'object') {
      const items: OptimizationItem[] = [];
      
      // 检查个人信息优化
      if (parsedContent.personalInfo && originalParsedContent.personalInfo) {
        const fields = ['fullName', 'email', 'phone', 'location'];
        fields.forEach(field => {
          if (parsedContent.personalInfo[field] !== originalParsedContent.personalInfo[field]) {
            const fieldName = field === 'fullName' ? '姓名' : 
                            field === 'email' ? '邮箱' : 
                            field === 'phone' ? '电话' : '所在地';
            const originalValue = originalParsedContent.personalInfo[field] || '无';
            const newValue = parsedContent.personalInfo[field] || '无';
            
            items.push({
              title: '个人信息优化',
              description: `优化了${fieldName}的表述："${originalValue}" → "${newValue}"`,
              type: 'improved'
            });
          }
        });
      }
      
      // 检查教育背景优化
      if (parsedContent.educations && originalParsedContent.educations) {
        parsedContent.educations.forEach((edu: any, index: number) => {
          if (index < originalParsedContent.educations.length) {
            const originalEdu = originalParsedContent.educations[index];
            const fields = ['education', 'school', 'major'];
            fields.forEach(field => {
              if (edu[field] !== originalEdu[field]) {
                const fieldName = field === 'education' ? '学历' : 
                                field === 'school' ? '学校' : '专业';
                const originalValue = originalEdu[field] || '无';
                const newValue = edu[field] || '无';
                
                items.push({
                  title: '教育背景优化',
                  description: `优化了第${index + 1}条教育经历的${fieldName}："${originalValue}" → "${newValue}"`,
                  type: 'improved'
                });
              }
            });
          }
        });
        
        // 检查是否添加了新的教育经历
        if (parsedContent.educations.length > originalParsedContent.educations.length) {
          const newCount = parsedContent.educations.length - originalParsedContent.educations.length;
          const newEducations = parsedContent.educations.slice(originalParsedContent.educations.length);
          const newSchools = newEducations.map(edu => edu.school).join('、');
          
          items.push({
            title: '教育背景补充',
            description: `添加了${newCount}条缺失的教育经历信息${newSchools ? '：' + newSchools : ''}`,
            type: 'added'
          });
        }
      }
      
      // 检查工作经历优化
      if (parsedContent.workExperiences && originalParsedContent.workExperiences) {
        parsedContent.workExperiences.forEach((exp: any, index: number) => {
          if (index < originalParsedContent.workExperiences.length) {
            const originalExp = originalParsedContent.workExperiences[index];
            const fields = ['company', 'position', 'responsibilities'];
            fields.forEach(field => {
              if (exp[field] !== originalExp[field]) {
                const fieldName = field === 'company' ? '公司名称' : 
                                field === 'position' ? '职位名称' : '工作职责';
                
                // 对于工作职责，可能内容较长，只显示部分内容
                if (field === 'responsibilities') {
                  items.push({
                    title: '工作职责优化',
                    description: `优化了第${index + 1}条工作经历的${fieldName}，使其更加专业和有针对性`,
                    type: 'improved'
                  });
                } else {
                  const originalValue = originalExp[field] || '无';
                  const newValue = exp[field] || '无';
                  
                  items.push({
                    title: '工作经历优化',
                    description: `优化了第${index + 1}条工作经历的${fieldName}："${originalValue}" → "${newValue}"`,
                    type: 'improved'
                  });
                }
              }
            });
          }
        });
        
        // 检查是否添加了新的工作经历
        if (parsedContent.workExperiences.length > originalParsedContent.workExperiences.length) {
          const newCount = parsedContent.workExperiences.length - originalParsedContent.workExperiences.length;
          const newExperiences = parsedContent.workExperiences.slice(originalParsedContent.workExperiences.length);
          const newCompanies = newExperiences.map(exp => exp.company).join('、');
          
          items.push({
            title: '工作经历补充',
            description: `添加了${newCount}条缺失的工作经历信息${newCompanies ? '：' + newCompanies : ''}`,
            type: 'added'
          });
        }
      }
      
      // 检查技能优化
      if (parsedContent.skills !== originalParsedContent.skills) {
        // 对比技能描述的差异
        const originalSkills = originalParsedContent.skills || '';
        const newSkills = parsedContent.skills || '';
        
        // 如果技能描述较短，直接显示前后对比
        if (originalSkills.length < 50 && newSkills.length < 50) {
          items.push({
            title: '技能描述优化',
            description: `优化了技能描述："${originalSkills}" → "${newSkills}"`,
            type: 'improved'
          });
        } else {
          // 技能描述较长，只提示已优化
          items.push({
            title: '技能描述优化',
            description: '优化了技能描述，使其更加专业和有针对性，突出与目标职位相关的关键技能',
            type: 'improved'
          });
        }
      }
      
      // 如果没有检测到具体变化，添加一个通用优化项
      if (items.length === 0) {
        items.push({
          title: '整体简历优化',
          description: 'AI对简历进行了整体优化，提升了专业性和针对性，使简历更符合行业标准',
          type: 'restructured'
        });
      }
      
      setOptimizationItems(items);
    }
  }, [parsedContent, originalParsedContent]);

  // 保存为新简历
  const handleSaveAsNew = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // 准备新简历数据
      const newResumeData: CreateResumeData = {
        name: `${originalResume.name} - AI优化版`,
        content: typeof parsedContent === 'object' ? JSON.stringify(parsedContent) : optimizedContent,
        type: ResumeType.TAILORED,
        targetPosition: originalResume.targetPosition || '',
        tailored: true
      };
      
      // 创建新简历
      await dispatch(createResume(newResumeData)).unwrap();
      setSaveSuccess(true);
      
      // 保存成功后直接关闭预览页面
      onClose();
    } catch (error) {
      setError((error as Error).message || '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="resume-preview-overlay">
      <div className="resume-preview-container">
        <div className="resume-preview-header">
          <h2 className="title-md">AI优化简历预览</h2>
          <button 
            className="btn btn-outline btn-sm" 
            onClick={onClose}
            disabled={isSaving}
          >
            关闭
          </button>
        </div>
        
        <div className="resume-preview-content">
          <div className="card">
            <div className="card-body">
              {typeof parsedContent === 'object' ? (
                <div className="form-content">
                  {/* 个人信息部分 */}
                  <div className="form-section">
                    <h3 className="form-section-title">个人信息</h3>
                    <div className="form-group">
                      <label className="form-label">姓名</label>
                      <input
                        type="text"
                        className="form-input"
                        value={parsedContent.personalInfo?.fullName || ''}
                        readOnly
                      />
                    </div>
                    <div className="grid-cols-1-2">
                      <div className="form-group">
                        <label className="form-label">邮箱</label>
                        <input
                          type="email"
                          className="form-input"
                          value={parsedContent.personalInfo?.email || ''}
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">电话</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={parsedContent.personalInfo?.phone || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">所在地</label>
                      <input
                        type="text"
                        className="form-input"
                        value={parsedContent.personalInfo?.location || ''}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  {/* 教育背景部分 */}
                  {parsedContent.educations && parsedContent.educations.length > 0 && (
                    <div className="form-section">
                      <div className="form-section-header">
                        <h3 className="form-section-title">教育背景</h3>
                      </div>
                      
                      {parsedContent.educations.map((edu: any, index: number) => (
                        <div key={index} className="education-item mb-4 p-3 border rounded">
                          <div className="education-header flex justify-between items-center mb-2">
                            <h4 className="text-md font-medium">教育经历 #{index + 1}</h4>
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">学历</label>
                            <input
                              type="text"
                              className="form-input"
                              value={edu.education || ''}
                              readOnly
                            />
                          </div>
                          <div className="grid-cols-1-2">
                            <div className="form-group">
                              <label className="form-label">学校</label>
                              <input
                                type="text"
                                className="form-input"
                                value={edu.school || ''}
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">专业</label>
                              <input
                                type="text"
                                className="form-input"
                                value={edu.major || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="grid-cols-1-2">
                            <div className="form-group">
                              <label className="form-label">入学时间</label>
                              <input
                                type="text"
                                className="form-input"
                                value={edu.startDate || ''}
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">毕业时间</label>
                              <input
                                type="text"
                                className="form-input"
                                value={edu.endDate || ''}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 工作经历部分 */}
                  {parsedContent.workExperiences && parsedContent.workExperiences.length > 0 && (
                    <div className="form-section">
                      <div className="form-section-header">
                        <h3 className="form-section-title">工作经历</h3>
                      </div>
                      
                      {parsedContent.workExperiences.map((exp: any, index: number) => (
                        <div key={index} className="work-experience-item mb-4 p-3 border rounded">
                          <div className="work-experience-header flex justify-between items-center mb-2">
                            <h4 className="text-md font-medium">工作经历 #{index + 1}</h4>
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">公司名称</label>
                            <input
                              type="text"
                              className="form-input"
                              value={exp.company || ''}
                              readOnly
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">职位</label>
                            <input
                              type="text"
                              className="form-input"
                              value={exp.position || ''}
                              readOnly
                            />
                          </div>
                          <div className="grid-cols-1-2">
                            <div className="form-group">
                              <label className="form-label">开始时间</label>
                              <input
                                type="text"
                                className="form-input"
                                value={exp.startDate || ''}
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">结束时间</label>
                              <input
                                type="text"
                                className="form-input"
                                value={exp.endDate || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">工作职责与成就</label>
                            <textarea
                              className="form-textarea enhanced-textarea"
                              rows={4}
                              value={exp.responsibilities || ''}
                              readOnly
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 技能部分 */}
                  {parsedContent.skills && (
                    <div className="form-section">
                      <h3 className="form-section-title">技能</h3>
                      <div className="form-group">
                        <label className="form-label">专业技能</label>
                        <textarea
                          className="form-textarea enhanced-textarea"
                          rows={4}
                          value={parsedContent.skills || ''}
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-resume">
                  {/* 显示文本格式简历内容 */}
                  <pre>{optimizedContent}</pre>
                </div>
              )}
            </div>
          </div>
          
          {/* AI优化项列表 */}
          <div className="optimization-items-section">
            <div className="optimization-header">
              <Wand2 className="w-5 h-5 mr-2" />
              <h3 className="optimization-title">AI优化项</h3>
            </div>
            <div className="optimization-items-list">
              {optimizationItems.length > 0 ? (
                optimizationItems.map((item, index) => (
                  <div key={index} className={`optimization-item ${item.type}`}>
                    <div className="optimization-item-title">{item.title}</div>
                    <div className="optimization-item-description">{item.description}</div>
                  </div>
                ))
              ) : (
                <div className="no-optimization-items">正在分析AI优化项...</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="resume-preview-footer">
          {error && <AlertMessage type="error" message={error} />}
          {saveSuccess && <AlertMessage type="success" message="保存成功！正在返回简历列表..." />}
          
          <button 
            className="btn btn-primary" 
            onClick={handleSaveAsNew}
            disabled={isSaving || saveSuccess}
          >
            {isSaving ? <Loader size={20} message="" /> : '保存为新简历'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizePreview;