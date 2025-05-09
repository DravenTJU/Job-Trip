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
    <div className="container-lg px-4">
      <div className="section space-y-6 mb-8">
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

      {/* 简历列表部分 */}
      <div className="section space-y-6">
        <div className="space-y-4"> 
          {/* 直接遍历所有简历 */}
          {resumes.map(resume => (
            <div 
              key={resume._id}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div 
                className="p-4 bg-gray-50/30 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer"
                onClick={() => toggleResumeExpand(resume._id)}
              >
                <div className="flex items-center">
                  {/* 使用默认图标或根据类型显示不同图标 */}
                  {/* {resume.thumbnail ? (
                    <img 
                      src={resume.thumbnail} 
                      alt={resume.name}
                      className="w-10 h-14 object-cover rounded mr-3"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center mr-3">
                      <FileText className="w-6 h-6 text-gray-400 dark:text-gray-300" />
                    </div>
                  )} */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{resume.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {/* 显示简历类型 */} 
                      {/* <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium mr-2 ${
                        resume.type === ResumeType.TAILORED 
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {resume.type === ResumeType.TAILORED ? '定制' : '基础'}
                      </span> */}
                      创建于{new Date(resume.createdAt).toLocaleDateString()} • 更新于 {new Date(resume.updatedAt).toLocaleDateString()} • 目标职位: {resume.targetPosition || '未指定'}
                    </p>
                  </div>
                </div>
                <div>
                  {expandedResume === resume._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedResume === resume._id && (
                <div className="p-4 bg-white/50 dark:bg-gray-800/50"> 
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => handleEditResume(resume._id)}
                    >
                      <Edit className="w-4 h-4" />
                      编辑
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDownloadResume(resume._id);
                      }}
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDuplicateResume(resume._id);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      复制
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50/50 dark:bg-red-900/50 backdrop-blur-lg ring-2 ring-red-900/5 dark:ring-red-100/5 hover:bg-red-100/50 dark:hover:bg-red-800/50 transition-colors text-red-600 dark:text-red-400"
                      onClick={() => handleDeleteResume(resume._id)}
                    >
                      <Trash className="w-4 h-4" />
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* 创建新简历按钮 */} 
          <button 
            className="w-full py-5 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl ring-2 ring-indigo-500/20 dark:ring-indigo-400/20 border-dashed border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors text-indigo-600 dark:text-indigo-400"
            onClick={handleCreateResume}
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-lg font-medium">创建新的简历</span>
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