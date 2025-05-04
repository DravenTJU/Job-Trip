import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchJob, deleteJob } from '@/redux/slices/jobsSlice';
import { ApplicationStatus, JobStatus, JobSource } from '@/types';
import { 
  ArrowLeft, 
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

/**
 * 职位详情页面组件
 */
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
    navigate(-1);
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
  
  // 格式化日期
  const formatDate = (dateString: string, useRelative = false) => {
    const date = new Date(dateString);
    if (useRelative) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '昨天';
      if (diffDays < 7) return `${diffDays}天前`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
      return `${Math.floor(diffDays / 365)}年前`;
    }
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case JobStatus.NEW:
        return 'badge-primary';
      case JobStatus.APPLIED:
        return 'badge-info';
      case JobStatus.INTERVIEWING:
        return 'badge-warning';
      case JobStatus.OFFER:
        return 'badge-success';
      case JobStatus.REJECTED:
        return 'badge-error';
      case JobStatus.WITHDRAWN:
        return 'badge-default';
      case JobStatus.CLOSED:
        return 'badge-default';
      default:
        return 'badge-default';
    }
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
        return '其他';
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
        未找到职位信息
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
        <ArrowLeft className="w-4 h-4" />
        返回职位列表
      </button>
      
      {/* 职位详情卡片 */}
      <div className="welcome-banner bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
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
            <span className={`badge ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
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
                window.location.href = 'http://localhost:3000/dashboard';
              }}
              className="btn btn-primary gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              跟踪
            </button>
            <button
              onClick={handleEdit}
              className="btn btn-secondary gap-2"
            >
              <Edit3 className="w-4 h-4" />
              编辑
            </button>
            <button
              onClick={openDeleteDialog}
              className="btn btn-danger gap-2"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      </div>
      
      {/* 职位详细信息 */}
      <div className="section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="card p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
            <h2 className="title-md">基本信息</h2>
            <div className="space-y-4">
              {job.location && (
                <div className="data-item">
                  <div className="data-item-icon">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">工作地点</div>
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
                    <div className="data-item-label">薪资范围</div>
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
                    <div className="data-item-label">工作类型</div>
                    <div className="data-item-value">{job.jobType}</div>
                  </div>
                </div>
              )}
              
              <div className="data-item">
                <div className="data-item-icon">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="data-item-content">
                  <div className="data-item-label">发布时间</div>
                  <div className="data-item-value">
                    {formatDate(job.createdAt)}
                    <span className="text-gray-400 text-sm ml-2">
                      ({formatDate(job.createdAt, true)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 来源信息 */}
          <div className="card p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
            <h2 className="title-md">来源信息</h2>
            <div className="space-y-4">
              <div className="data-item">
                <div className="data-item-icon">
                  <Link className="w-5 h-5 text-gray-400" />
                </div>
                <div className="data-item-content">
                  <div className="data-item-label">职位来源</div>
                  <div className="data-item-value">{getPlatformLabel(job.platform)}</div>
                </div>
              </div>
              
              {job.sourceUrl && (
                <div className="data-item">
                  <div className="data-item-icon">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">原始链接</div>
                    <div className="data-item-value">
                      <a 
                        href={job.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={handleExternalLinkClick}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        查看原始职位
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
                  <div className="data-item-label">最后更新</div>
                  <div className="data-item-value">
                    {formatDate(job.updatedAt)}
                    <span className="text-gray-400 text-sm ml-2">
                      ({formatDate(job.updatedAt, true)})
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
            <h2 className="title-md">职位描述</h2>
            <div className="prose prose-indigo max-w-none">
              {job.description}
            </div>
          </div>
        </div>
      )}
      
      {/* 删除确认对话框 */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
            <h3 className="text-xl font-semibold mb-4">确认删除</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              您确定要删除此职位 "{job.title}" 吗？此操作无法撤销。
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={closeDeleteDialog}
                className="btn btn-outline"
              >
                取消
              </button>
              <button 
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage; 