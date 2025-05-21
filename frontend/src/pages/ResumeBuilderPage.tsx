import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, Copy, Edit, Trash, Plus, FileText, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchResumes, deleteResume, duplicateResume } from '@/redux/slices/resumesSlice';
import { Resume } from '@/types';
import Toast from '@/components/common/Toast';
import Loader from '@/components/common/Loader';
import CustomConfirmDialog from '@/components/common/CustomConfirmDialog';
import ResumeOptimizePreview from '@/components/resume/ResumeOptimizePreview';
import resumeExportService from '@/services/resumeExportService';
import { useTranslation } from 'react-i18next';

/**
 * 简历生成器页面组件
 * 用于创建和管理求职简历
 */
const ResumeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('resume');
  const { resumes, isLoading, error } = useAppSelector((state) => state.resumes);
  
  const [expandedResume, setExpandedResume] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  
  // 预览相关状态
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);
  const [previewResumeName, setPreviewResumeName] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // AI优化相关状态
  // const [isOptimizing, setIsOptimizing] = useState(false);
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
  
  // 处理预览简历
  const handlePreviewResume = async (resume: Resume) => {
    try {
      setIsLoadingPreview(true);
      setPreviewError(null);
      setPreviewResumeId(resume._id);
      setPreviewResumeName(resume.name);
      
      // 直接使用API服务获取HTML内容
      const response = await fetch(`/api/v1/resumes/${resume._id}/preview`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      setPreviewHtml(html);
    } catch (error) {
      console.error('获取预览失败:', error);
      setPreviewError(error instanceof Error ? error.message : '获取预览失败');
    } finally {
      setIsLoadingPreview(false);
    }
  };
  
  // 处理下载PDF
  const handleDownloadPDF = async (resumeId: string) => {
    try {
      await resumeExportService.downloadResumePDF(resumeId);
    } catch (error) {
      console.error('下载PDF失败:', error);
      // 这里可以添加错误提示
    }
  };

  // 处理创建新简历 - 默认创建基础简历
  const handleCreateResume = () => {
    navigate(`/resume-form/new`);
  };
  
  // 关闭预览
  const closePreview = () => {
    setPreviewHtml(null);
    setPreviewError(null);
    setPreviewResumeId(null);
  };
  
  // 关闭优化预览
  const handleCloseOptimizePreview = () => {
    setShowOptimizePreview(false);
    setOptimizedContent('');
    setResumeToOptimize(null);
  };
  
  // 渲染预览模态框
  const renderPreviewModal = () => {
    if (!previewHtml || !previewResumeId) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-11/12 h-5/6 max-w-5xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('resume_preview', '简历预览')} - {previewResumeName}
            </h3>
            <button 
              onClick={closePreview}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow overflow-auto bg-white p-4 rounded border border-gray-300">
            <iframe
              srcDoc={previewHtml}
              title="简历预览"
              className="w-full h-full"
              sandbox="allow-same-origin"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={closePreview}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              {t('close', '关闭')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-lg">
      <div className="section">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('resume_builder', '简历生成器')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('resume_builder_description', '根据您的个人档案生成简历')}
        </p>
      </div>

      {/* 使用Toast组件显示错误信息 */}
      {error && 
        <Toast 
          type="error" 
          message={error} 
          onClose={() => { /* 处理关闭逻辑, 例如 dispatch(clearError()) */ }} 
        />
      }
      {isLoading && <Loader />}
      
      {/* 预览错误提示 */}
      {previewError && (
        <Toast 
          type="error" 
          message={previewError} 
          onClose={() => setPreviewError(null)} 
        /> 
      )}
      
      {/* AI优化错误提示 - 使用Toast组件 */}
      {optimizationError && (
        <Toast 
          type="error" 
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
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{resume.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('created_at', '创建于')}{new Date(resume.createdAt).toLocaleDateString()} • {t('updated_at', '更新于')} {new Date(resume.updatedAt).toLocaleDateString()} • {t('target_position', '目标职位')}: {resume.targetPosition || t('not_specified', '未指定')}
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
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50/50 dark:bg-blue-900/50 backdrop-blur-lg ring-2 ring-blue-900/5 dark:ring-blue-100/5 hover:bg-blue-100/50 dark:hover:bg-blue-800/50 transition-colors text-blue-600 dark:text-blue-400"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handlePreviewResume(resume);
                      }}
                      disabled={isLoadingPreview && previewResumeId === resume._id}
                    >
                      {isLoadingPreview && previewResumeId === resume._id ? (
                        <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      {isLoadingPreview && previewResumeId === resume._id ? 
                        t('loading', '加载中...') : 
                        t('preview', '预览')}
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-50/50 dark:bg-green-900/50 backdrop-blur-lg ring-2 ring-green-900/5 dark:ring-green-100/5 hover:bg-green-100/50 dark:hover:bg-green-800/50 transition-colors text-green-600 dark:text-green-400"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDownloadPDF(resume._id);
                      }}
                    >
                      <Download className="w-4 h-4" />
                      {t('download_pdf', 'PDF')}
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => handleEditResume(resume._id)}
                    >
                      <Edit className="w-4 h-4" />
                      {t('edit', '编辑')}
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDuplicateResume(resume._id);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      {t('copy', '复制')}
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50/50 dark:bg-red-900/50 backdrop-blur-lg ring-2 ring-red-900/5 dark:ring-red-100/5 hover:bg-red-100/50 dark:hover:bg-red-800/50 transition-colors text-red-600 dark:text-red-400"
                      onClick={() => handleDeleteResume(resume._id)}
                    >
                      <Trash className="w-4 h-4" />
                      {t('delete', '删除')}
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
            <span className="text-lg font-medium">{t('create_new_resume', '创建新的简历')}</span>
          </button>
        </div>
      </div>
      
      {/* 删除确认对话框 */}
      <CustomConfirmDialog
        open={showDeleteConfirm}
        title={t('delete_resume', '删除简历')}
        message={t('delete_resume_confirm', '您确定要删除这份简历吗？此操作无法撤销。')}
        confirmText={t('delete', '删除')}
        cancelText={t('cancel', '取消')}
        onConfirm={confirmDeleteResume}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      
      {/* 预览模态框 */}
      {renderPreviewModal()}
    </div>
  );
};

export default ResumeBuilderPage;