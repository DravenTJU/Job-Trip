import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { createResume } from '@/redux/slices/resumesSlice';
import { CreateResumeData, ResumeType } from '@/types';
import Loader from '@/components/common/Loader';
import { Wand2, X } from 'lucide-react';

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
          const newSchools = newEducations.map((edu: any) => edu.school).join('、');
          
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
          const newCompanies = newExperiences.map((exp: any) => exp.company).join('、');
          
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

  // 处理保存为新简历
  const handleSaveAsNew = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const newResumeData: CreateResumeData = {
        name: `${originalResume.name} - AI优化版`,
        content: optimizedContent,
        type: ResumeType.BASE,
        targetPosition: originalResume.targetPosition || '',
        targetJob: '',
        tailored: false
      };
      
      await dispatch(createResume(newResumeData));
      setSaveSuccess(true);
      
      // 保存成功后3秒关闭预览
      setTimeout(() => {
        onClose();
        navigate('/resume-builder');
      }, 3000);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-[1000]">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl w-[95%] max-w-5xl max-h-[92vh] flex flex-col shadow-xl ring-2 ring-gray-900/5 dark:ring-gray-100/5">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Wand2 className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            AI优化预览
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-5 overflow-y-auto max-h-[70vh] flex flex-col gap-5">
          {/* 优化项列表部分 */}
          <div className="bg-gray-50/70 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400">优化项</h3>
            </div>
            
            {optimizationItems.length > 0 ? (
              <div className="space-y-3">
                {optimizationItems.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border-l-4 bg-white dark:bg-gray-800 shadow-sm ${
                      item.type === 'improved' 
                        ? 'border-indigo-500 dark:border-indigo-400' 
                        : item.type === 'added'
                          ? 'border-green-500 dark:border-green-400'
                          : 'border-amber-500 dark:border-amber-400'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 italic py-3">
                正在分析优化内容...
              </p>
            )}
          </div>
          
          {/* 简历内容预览部分 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* 简历预览内容 */}
            {typeof parsedContent === 'object' ? (
              <div className="p-5">
                {/* 个人信息部分 */}
                {parsedContent.personalInfo && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">个人信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label>
                        <input
                          type="text"
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                          value={parsedContent.personalInfo.fullName || ''}
                          readOnly
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
                        <input
                          type="email"
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                          value={parsedContent.personalInfo.email || ''}
                          readOnly
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">电话</label>
                        <input
                          type="tel"
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                          value={parsedContent.personalInfo.phone || ''}
                          readOnly
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所在地</label>
                        <input
                          type="text"
                          className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                          value={parsedContent.personalInfo.location || ''}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 教育背景部分 */}
                {parsedContent.educations && parsedContent.educations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">教育背景</h3>
                    <div className="space-y-4">
                      {parsedContent.educations.map((edu: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">学历</label>
                              <input
                                type="text"
                                className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                                value={edu.education || ''}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">学校</label>
                              <input
                                type="text"
                                className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                                value={edu.school || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">专业</label>
                            <input
                              type="text"
                              className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                              value={edu.major || ''}
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">开始时间</label>
                              <input
                                type="text"
                                className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                                value={edu.startDate || ''}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">结束时间</label>
                              <input
                                type="text"
                                className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                                value={edu.endDate || ''}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 工作经历部分 */}
                {parsedContent.workExperiences && parsedContent.workExperiences.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">工作经历</h3>
                    <div className="space-y-4">
                      {parsedContent.workExperiences.map((exp: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl">
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">公司名称</label>
                            <input
                              type="text"
                              className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                              value={exp.company || ''}
                              readOnly
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">职位</label>
                            <input
                              type="text"
                              className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                              value={exp.position || ''}
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">开始时间</label>
                              <input
                                type="text"
                                className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                                value={exp.startDate || ''}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">结束时间</label>
                              <input
                                type="text"
                                className="w-full h-11 px-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 text-gray-900 dark:text-gray-100"
                                value={exp.endDate || ''}
                                readOnly
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">工作职责</label>
                            <textarea
                              className="w-full min-h-[120px] px-3 py-2 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 resize-none text-gray-900 dark:text-gray-100"
                              rows={4}
                              value={exp.responsibilities || ''}
                              readOnly
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 技能部分 */}
                {parsedContent.skills && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">技能</h3>
                    <div>
                      <textarea
                        className="w-full min-h-[120px] px-3 py-2 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 resize-none text-gray-900 dark:text-gray-100"
                        rows={5}
                        value={parsedContent.skills || ''}
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {parsedContent}
                </pre>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          {/* 错误提示 */}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* 成功提示 */}
          {saveSuccess && (
            <div className="text-green-600 dark:text-green-400 text-sm">
              保存成功！正在返回简历列表...
            </div>
          )}
          
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={onClose}
            >
              取消
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              onClick={handleSaveAsNew}
              disabled={isSaving}
            >
              {isSaving ? <Loader size={20} message="" /> : '保存为新简历'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizePreview;