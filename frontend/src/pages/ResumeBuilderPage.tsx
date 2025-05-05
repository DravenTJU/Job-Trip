import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, Copy, Edit, Trash, Plus, FileText, ExternalLink, Wand2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchResumes, deleteResume, duplicateResume } from '@/redux/slices/resumesSlice';
import { Resume, ResumeType } from '@/types';
import AlertMessage from '@/components/common/AlertMessage';
import Loader from '@/components/common/Loader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ResumeOptimizePreview from '@/components/resume/ResumeOptimizePreview';
import resumeOptimizeService from '@/services/resumeOptimizeService';

/**
 * 简历生成器页面组件
 * 用于创建和管理求职简历
 */
const ResumeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resumes, isLoading, error } = useAppSelector((state) => state.resumes);
  
  const [activeAccordion, setActiveAccordion] = useState<string | null>('基础简历');
  const [expandedResume, setExpandedResume] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  
  // AI优化相关状态
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);
  const [showOptimizePreview, setShowOptimizePreview] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState<string>('');
  const [resumeToOptimize, setResumeToOptimize] = useState<Resume | null>(null);

  // 加载简历列表
  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  // 切换手风琴状态
  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // 切换简历展开状态
  const toggleResumeExpand = (id: string) => {
    setExpandedResume(expandedResume === id ? null : id);
  };

  // 处理删除简历
  const handleDeleteResume = (id: string) => {
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  };

  // 确认删除简历
  const confirmDeleteResume = async () => {
    if (resumeToDelete) {
      await dispatch(deleteResume(resumeToDelete));
      setShowDeleteConfirm(false);
      setResumeToDelete(null);
    }
  };

  // 处理复制简历
  const handleDuplicateResume = async (id: string) => {
    await dispatch(duplicateResume(id));
  };

  // 处理编辑简历
  const handleEditResume = (id: string) => {
    navigate(`/resume-form/${id}`);
  };

  // 处理创建新简历 - 默认创建基础简历
  const handleCreateResume = () => {
    navigate(`/resume-form/new`);
  };
  
  // 处理创建定制简历
  const handleCreateTailoredResume = () => {
    navigate(`/resume-form/new?type=${ResumeType.TAILORED}`);
  };
  
  // 处理下载简历
  const handleDownloadResume = async (resumeId: string) => {
    try {
      // 获取认证令牌
      const token = localStorage.getItem('token');
      
      // 发送带有认证信息的请求
      const response = await fetch(
        `/api/v1/resumes/${resumeId}/download`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('下载简历失败');
      }
      
      // 将响应转换为blob
      const blob = await response.blob();
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // 从Content-Disposition获取文件名，如果没有则使用默认名称
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'resume.docx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1].replace(/"/g, ''));
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('下载简历时出错:', error);
      // 可以在这里添加错误提示
    }
  };
  
  // 处理AI优化简历
  const handleOptimizeResume = async (resume: Resume) => {
    try {
      console.log('开始优化简历:', resume._id);
      setIsOptimizing(true);
      setOptimizationError(null);
      setResumeToOptimize(resume);
      
      // 验证简历内容是否有效
      if (!resume.content) {
        throw new Error('简历内容为空，无法进行优化');
      }
      
      console.log('调用AI服务优化简历...');
      // 调用AI服务优化简历
      const optimized = await resumeOptimizeService.optimizeResume(resume.content);
      console.log('AI优化完成，准备显示预览');
      
      setOptimizedContent(optimized);
      setShowOptimizePreview(true);
    } catch (error) {
      console.error('简历优化失败:', error);
      // 提供更具体的错误信息
      const errorMessage = error instanceof Error 
        ? error.message 
        : '简历优化失败，请稍后重试';
      setOptimizationError(errorMessage);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // 关闭优化预览
  const handleCloseOptimizePreview = () => {
    setShowOptimizePreview(false);
    setOptimizedContent('');
    setResumeToOptimize(null);
  };

  return (
    <div className="container-lg">
      <div className="section">
        <h1 className="title-lg">简历生成器</h1>
        {/* <p className="text-description">
          使用JobTrip的智能简历生成器创建专业、吸引人的简历，针对特定职位进行自动优化
        </p> */}
      </div>

      {error && <AlertMessage type="error" message={error} />}
      {isLoading && <Loader />}
      
      {/* AI优化错误提示 */}
      {optimizationError && (
        <AlertMessage type="error" message={optimizationError} />
      )}
      
      {/* AI优化预览 */}
      {showOptimizePreview && resumeToOptimize && (
        <ResumeOptimizePreview
          originalResume={{
            name: resumeToOptimize.name,
            content: resumeToOptimize.content,
            targetPosition: resumeToOptimize.targetPosition
          }}
          optimizedContent={optimizedContent}
          onClose={handleCloseOptimizePreview}
        />
      )}

      {/* 简历分类部分 */}
      <div className="section">
        <div className="grid-cols-1-1">
          {/* 基础简历部分 */}
          <div className="card">
            <div 
              className="card-header cursor-pointer"
              onClick={() => toggleAccordion('基础简历')}
            >
              <div>
                <h2 className="title-sm">基础简历</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">创建一份多功能简历作为基础模板</p>
              </div>
              <div>
                {activeAccordion === '基础简历' ? (
                  <ChevronUp className="accordion-icon" />
                ) : (
                  <ChevronDown className="accordion-icon" />
                )}
              </div>
            </div>
            
            {activeAccordion === '基础简历' && (
              <div className="card-body">
                <div className="space-y-4">
                  {resumes.filter(resume => resume.type === ResumeType.BASE).map(resume => (
                    <div 
                      key={resume._id}
                      className="resume-card"
                    >
                      <div 
                        className="resume-card-header"
                        onClick={() => toggleResumeExpand(resume._id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={resume.thumbnail} 
                            alt={resume.name}
                            className="resume-thumbnail"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{resume.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              目标职位: {resume.targetPosition || '未指定'} • 更新于 {new Date(resume.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          {expandedResume === resume._id ? (
                            <ChevronUp className="accordion-icon" />
                          ) : (
                            <ChevronDown className="accordion-icon" />
                          )}
                        </div>
                      </div>
                      
                      {expandedResume === resume._id && (
                        <div className="card-footer">
                          <div className="flex flex-wrap gap-2">
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => handleEditResume(resume._id)}
                            >
                              <Edit className="w-4 h-4 mr-1.5" />
                              编辑
                            </button>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                handleDownloadResume(resume._id);
                              }}
                            >
                              <Download className="w-4 h-4 mr-1.5" />
                              下载
                            </button>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                handleDuplicateResume(resume._id);
                              }}
                            >
                              <Copy className="w-4 h-4 mr-1.5" />
                              复制
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteResume(resume._id)}
                            >
                              <Trash className="w-4 h-4 mr-1.5" />
                              删除
                            </button>
                            {/* 
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                handleOptimizeResume(resume);
                              }}
                              disabled={isOptimizing}
                            >
                              <Wand2 className="w-4 h-4 mr-1.5" />
                              {isOptimizing && resumeToOptimize?._id === resume._id ? '优化中...' : 'AI优化'}
                            </button>
                            */}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    className="resume-add-button"
                    onClick={handleCreateResume}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    创建新的简历
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* 定制简历部分 */}
          {/* <div className="card">
            <div 
              className="card-header cursor-pointer"
              onClick={() => toggleAccordion('定制简历')}
            >
              <div>
                <h2 className="title-sm">定制简历</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">优化的简历版本</p>
              </div>
              <div>
                {activeAccordion === '定制简历' ? (
                  <ChevronUp className="accordion-icon" />
                ) : (
                  <ChevronDown className="accordion-icon" />
                )}
              </div>
            </div>
            
            {activeAccordion === '定制简历' && (
              <div className="card-body">
                <div className="space-y-4">
                  {resumes.filter(resume => resume.type === ResumeType.TAILORED).map(resume => (
                    <div 
                      key={resume._id}
                      className="resume-card"
                    >
                      <div 
                        className="resume-card-header"
                        onClick={() => toggleResumeExpand(resume._id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={resume.thumbnail} 
                            alt={resume.name}
                            className="resume-thumbnail"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{resume.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              目标: {resume.targetJob || '未指定'} • 更新于 {new Date(resume.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          {expandedResume === resume._id ? (
                            <ChevronUp className="accordion-icon" />
                          ) : (
                            <ChevronDown className="accordion-icon" />
                          )}
                        </div>
                      </div>
                      
                      {expandedResume === resume._id && (
                        <div className="card-footer">
                          <div className="flex flex-wrap gap-2">
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                handleEditResume(resume._id);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1.5" />
                              编辑
                            </button>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                handleDownloadResume(resume._id);
                              }}
                            >
                              <Download className="w-4 h-4 mr-1.5" />
                              下载
                            </button>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                            >
                              <FileText className="w-4 h-4 mr-1.5" />
                              预览
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                handleDeleteResume(resume._id);
                              }}
                            >
                              <Trash className="w-4 h-4 mr-1.5" />
                              删除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    className="resume-add-button"
                    onClick={handleCreateResume}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    创建新的简历
                  </button>
                </div>
              </div>
            )}
          </div>  */}
        </div>
      </div>
      
      {/* 简历建议部分已移除 */}

      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="删除简历"
        message="您确定要删除这份简历吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={confirmDeleteResume}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default ResumeBuilderPage;