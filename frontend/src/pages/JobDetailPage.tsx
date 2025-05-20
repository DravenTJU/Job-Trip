import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchJob, deleteJob, setJobStatus } from '@/redux/slices/jobsSlice';
import { JobSource } from '@/types';
import { 
  ChevronLeft, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Link, 
  Clock, 
  Edit3, 
  Trash2, 
  ExternalLink
} from 'lucide-react';
import CustomConfirmDialog from '@/components/common/CustomConfirmDialog';
import StatusBadge from '@/components/common/StatusBadge';
import { useTranslation } from 'react-i18next';
import { getJobTypeTranslationKey } from '@/utils/jobTypeUtils';
import { formatDate } from '@/utils/dateUtils';

/**
 * 职位详情页面组件
 */
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation('jobs');
  const { job, isLoading, error } = useSelector((state: RootState) => state.jobs);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 加载职位数据
  useEffect(() => {
    if (id) {
      dispatch(fetchJob(id));
    }
  }, [dispatch, id]);
  
  // 处理返回
  const handleBack = () => {
    navigate('/jobs');
  };
  
  // 处理编辑
  const handleEdit = () => {
    navigate(`/jobs/edit/${id}`);
  };
  
  // 打开删除对话框
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  // 关闭删除对话框
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // 确认删除
  const confirmDelete = async () => {
    if (id) {
      const resultAction = await dispatch(deleteJob(id));
      if (deleteJob.fulfilled.match(resultAction)) {
        navigate('/jobs');
      }
    }
    setDeleteDialogOpen(false);
  };
  
  // 获取公司名称
  const getCompanyName = () => {
    if (!job) return '';
    return typeof job.company === 'string' ? job.company : job.company.name;
  };
  
  // 处理外部链接点击
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // 获取平台显示名称
  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case JobSource.LINKEDIN:
        return 'LinkedIn';
      case JobSource.SEEK:
        return 'Seek';
      case JobSource.INDEED:
        return 'Indeed';
      case JobSource.OTHER:
        return t('other', '其他');
      default:
        return platform;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="loader"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="alert alert-info">
        {t('job_not_found', '未找到职位信息')}
      </div>
    );
  }
  
  return (
    <div className="container-lg">
      {/* 返回按钮 */}
      <button 
        onClick={handleBack}
        className="btn btn-outline mb-6 gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('back_to_job_list', '返回职位列表')}
      </button>
      
      {/* 职位详情卡片 */}
      <div className="welcome-banner bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6 mb-6 relative">
        <div className="welcome-banner-decoration">
          <div className="absolute top-5 left-10 w-6 h-6 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-green-300 rounded"></div>
          <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-red-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-blue-300 transform rotate-45"></div>
          <div className="absolute top-1/3 left-1/2 w-7 h-7 bg-purple-300 rounded-lg"></div>
        </div>
        
        <div className="relative">
          {/* 职位标题和状态 */}
          <div className="flex items-center gap-3 mb-4">
            <h1 className="title-lg">{job.title}</h1>
            <StatusBadge 
              jobId={job._id} 
              status={job.status} 
              onStatusChange={(updatedJobId, newStatus) => {
                dispatch(setJobStatus({ jobId: updatedJobId, newStatus }));
                console.log(t('status_updated_log', 'Redux store 状态已通过 setJobStatus 更新:'), updatedJobId, newStatus);
              }}
            />
          </div>
          
          {/* 公司名称 */}
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="text-xl font-medium">{getCompanyName()}</span>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigate('/dashboard');
              }}
              className="btn btn-primary gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {t('track', '跟踪')}
            </button>
            <button
              onClick={handleEdit}
              className="btn btn-secondary gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {t('edit', '编辑')}
            </button>
            <button
              onClick={openDeleteDialog}
              className="btn btn-danger gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('delete', '删除')}
            </button>
          </div>
        </div>
      </div>
      
      {/* 职位详细信息 */}
      <div className="section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="card p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
            <h2 className="title-md">{t('basic_info', '基本信息')}</h2>
            <div className="space-y-4">
              {job.location && (
                <div className="data-item">
                  <div className="data-item-icon">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">{t('work_location', '工作地点')}</div>
                    <div className="data-item-value">{job.location}</div>
                  </div>
                </div>
              )}
              
              {job.salary && (
                <div className="data-item">
                  <div className="data-item-icon">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">{t('salary_range', '薪资范围')}</div>
                    <div className="data-item-value">{job.salary}</div>
                  </div>
                </div>
              )}
              
              {job.jobType && (
                <div className="data-item">
                  <div className="data-item-icon">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">{t('job_type', '工作类型')}</div>
                    <div className="data-item-value">{t(`jobs:${getJobTypeTranslationKey(job.jobType)}`, { defaultValue: job.jobType })}</div>
                  </div>
                </div>
              )}
              
              <div className="data-item">
                <div className="data-item-icon">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="data-item-content">
                  <div className="data-item-label">{t('add_time', '添加时间')}</div>
                  <div className="data-item-value">
                    {formatDate(job.createdAt, t, i18n.language)}
                    <span className="text-gray-400 text-sm ml-2">
                      ({formatDate(job.createdAt, t, i18n.language, true)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 来源信息 */}
          <div className="card p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
            <h2 className="title-md">{t('source_info', '来源信息')}</h2>
            <div className="space-y-4">
              <div className="data-item">
                <div className="data-item-icon">
                  <Link className="w-5 h-5 text-gray-400" />
                </div>
                <div className="data-item-content">
                  <div className="data-item-label">{t('job_source', '职位来源')}</div>
                  <div className="data-item-value">{getPlatformLabel(job.platform)}</div>
                </div>
              </div>
              
              {job.sourceUrl && (
                <div className="data-item">
                  <div className="data-item-icon">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">{t('original_link', '原始链接')}</div>
                    <div className="data-item-value">
                      <a 
                        href={job.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={handleExternalLinkClick}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {t('view_original_job_info', '查看原始职位信息')}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="data-item">
                <div className="data-item-icon">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="data-item-content">
                  <div className="data-item-label">{t('last_update', '最后更新')}</div>
                  <div className="data-item-value">
                    {formatDate(job.updatedAt, t, i18n.language)}
                    <span className="text-gray-400 text-sm ml-2">
                      ({formatDate(job.updatedAt, t, i18n.language, true)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 职位描述 */}
      {job.description && (
        <div className="section">
          <div className="card p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
            <h2 className="title-md">{t('job_description', '职位描述')}</h2>
            <div className="prose prose-indigo max-w-none">
              {job.description}
            </div>
          </div>
        </div>
      )}
      
      {/* 删除确认对话框 */}
      <CustomConfirmDialog
        open={deleteDialogOpen}
        title={t('confirm_delete', '确认删除')}
        message={t('confirm_delete_job', '您确定要删除此职位 "{{title}}" 吗？此操作无法撤销。', { title: job?.title || '' })}
        confirmText={t('delete', '删除')}
        cancelText={t('cancel', '取消')}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
};

export default JobDetailPage; 