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
    dispatch(fetchResumes({}));
  }, [dispatch]);

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
      // 假设 optimizeResume 需要 resumeId 和 targetPosition
      // (如果需要的参数不同，需要调整)
      const optimized = await resumeOptimizeService.optimizeResume(resume._id, resume.targetPosition || '', resume.content); 
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">简历生成器</h1>
        <p className="text-gray-500 dark:text-gray-400">
          根据您的个人档案生成简历
        </p>
      </div>

      {/* 传入 open prop 并根据 error 状态控制 */}
      {error && 
        <AlertMessage 
          open={!!error} 
          severity="error" 
          message={error} 
          onClose={() => { /* 处理关闭逻辑, 例如 dispatch(clearError()) */ }} 
        />
      }
      {isLoading && <Loader />}
      
      {/* AI优化错误提示 - 传入 open prop 并根据 optimizationError 状态控制 */}
      {optimizationError && (
        <AlertMessage 
          open={!!optimizationError} 
          severity="error" 
          message={optimizationError} 
          onClose={() => setOptimizationError(null)} 
        /> 
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

      {/* 简历列表部分 - 不再分类 */}
      <div className="section">
        <div className="space-y-4"> 
          {/* 直接遍历所有简历 */}
          {resumes.map(resume => (
            <div 
              key={resume._id}
              className="resume-card" // 保留单个简历卡片样式
            >
              <div 
                className="resume-card-header" // 保留卡片头部样式
                onClick={() => toggleResumeExpand(resume._id)}
              >
                <div className="flex items-center">
                  {/* 使用默认图标或根据类型显示不同图标 */}
                  {resume.thumbnail ? (
                    <img 
                      src={resume.thumbnail} 
                      alt={resume.name}
                      className="resume-thumbnail"
                    />
                  ) : (
                    <FileText className="resume-thumbnail-placeholder" /> // 使用 FileText 作为默认图标
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{resume.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {/* 显示简历类型 */} 
                      <span className={`resume-type-badge ${resume.type === ResumeType.TAILORED ? 'badge-tailored' : 'badge-base'}`}>
                        {resume.type === ResumeType.TAILORED ? '定制' : '基础'}
                      </span>
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
                        e.stopPropagation(); 
                        handleDownloadResume(resume._id);
                      }}
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      下载
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); 
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
                    {/* AI 优化按钮保持不变 */}
                    {/* 
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); 
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
          
          {/* 创建新简历按钮 */} 
          <button 
            className="resume-add-button" 
            onClick={handleCreateResume} // 默认创建基础简历，或提供选项
          >
            <Plus className="w-5 h-5 mr-2" />
            创建新的简历
          </button>
        </div>
      </div>
      
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