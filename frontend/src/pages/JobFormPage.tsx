import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createJob, updateJob, fetchJob } from '@/redux/slices/jobsSlice';
import { Job, CreateJobData, JobStatus, JobType, JobSource } from '@/types';
import { JOB_STATUS_OPTIONS, getStatusIcon } from '@/utils/jobStatusUtils';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  SortDesc,
  SortAsc,
  X,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowLeft,
  Save,
  Trash,
  HelpCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

/**
 * 职位表单页面
 * 用于创建或编辑职位
 */
const JobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Redux状态
  const { job, isLoading: isJobLoading, error: jobError } = useSelector((state: RootState) => state.jobs);
  
  // 表单状态
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    company: '',
    description: '',
    jobType: JobType.FULL_TIME,
    location: '',
    platform: JobSource.SEEK,
    source: '',
    sourceId: '',
    sourceUrl: '',
    requirements: [],
    status: JobStatus.PENDING,
    salary: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // 加载数据
  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchJob(id));
    }
  }, [dispatch, isEdit, id]);
  
  // 当编辑现有记录时，填充表单数据
  useEffect(() => {
    if (isEdit && job) {
      setFormData({
        title: job.title,
        company: typeof job.company === 'string' ? job.company : job.company.name,
        description: job.description || '',
        jobType: job.jobType || JobType.FULL_TIME,
        location: job.location || '',
        platform: job.platform,
        source: job.source,
        sourceId: job.sourceId,
        sourceUrl: job.sourceUrl,
        requirements: job.requirements,
        status: job.status,
        salary: job.salary || ''
      });
    }
  }, [isEdit, job]);
  
  // 处理表单字段变更
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`输入框 ${name} 变化，值为: ${value}`);
    setFormData(prev => ({
      ...prev,
      [name!]: value,
    }));
    
    // 清除相关错误
    if (formErrors[name!]) {
      setFormErrors(prev => ({
        ...prev,
        [name!]: '',
      }));
    }
  };
  
  // 处理 select 组件变更
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name!]: value,
    }));
    if (formErrors[name!]) {
      setFormErrors(prev => ({
        ...prev,
        [name!]: '',
      }));
    }
  };
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('表单提交事件触发');
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('表单校验未通过');
      setSnackbar({
        open: true,
        message: '请检查表单错误并重试',
        severity: 'error'
      });
      return;
    }
    console.log('表单校验通过，开始提交');
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        sourceId: formData.sourceId || generateSourceId()
      };
      console.log('提交数据:', submitData);
      
      if (isEdit && id) {
        await dispatch(updateJob({ id, data: submitData })).unwrap();
        setSnackbar({
          open: true,
          message: '职位更新成功',
          severity: 'success'
        });
      } else {
        await dispatch(createJob(submitData)).unwrap();
        console.log('提交成功');
        setSnackbar({
          open: true,
          message: '职位创建成功',
          severity: 'success'
        });
      }
      
      // 延迟导航以显示成功消息
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    } catch (error) {
      console.log('提交失败:', error);
      setSnackbar({
        open: true,
        message: '保存失败，请重试',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    console.log('开始表单校验');
    const errors: Record<string, string> = {};
    
    // 验证标题
    if (!formData.title.trim()) {
      errors.title = '请输入职位名称';
    }
    
    // 验证公司
    if (!formData.company.trim()) {
      errors.company = '请输入公司名称';
    }

    // 验证工作地点
    if (!formData.location.trim()) {
      errors.location = '请输入工作地点';
    }

    // 验证工作类型
    if (!formData.jobType) {
      errors.jobType = '请选择工作类型';
    } else if (!Object.values(JobType).includes(formData.jobType as JobType)) {
      errors.jobType = '无效的工作类型';
    }

    // 验证平台
    if (!formData.platform) {
      errors.platform = '请选择平台';
    } else if (!platformOptions.some(option => option.value === formData.platform)) {
      errors.platform = '无效的平台';
    }

    // 验证来源
    if (!formData.source) {
      formData.source = formData.platform;
    }

    // 验证职位链接
    if (formData.platform !== 'manual') {
      if (!formData.sourceUrl) {
        errors.sourceUrl = '请输入职位链接';
      } else if (!formData.sourceUrl.startsWith('http://') && !formData.sourceUrl.startsWith('https://')) {
        errors.sourceUrl = '请输入有效的职位链接';
      }
    }

    // 如果是手动添加，生成sourceId
    if (!formData.sourceId) {
      formData.sourceId = generateSourceId();
    }
    
    setFormErrors(errors);
    console.log('表单校验错误详情:', errors);
    return Object.keys(errors).length === 0;
  };
  
  // 状态选项
  const statusOptions = JOB_STATUS_OPTIONS;

  // 工作类型选项
  const jobTypeOptions = [
    { value: JobType.FULL_TIME, label: '全职' },
    { value: JobType.PART_TIME, label: '兼职' },
    { value: JobType.CONTRACT, label: '合同工' },
    { value: JobType.FREELANCE, label: '自由职业' },
    { value: JobType.INTERNSHIP, label: '实习' }
  ];

  // 平台选项
  const platformOptions = [
    { value: JobSource.SEEK, label: 'Seek' },
    { value: JobSource.LINKEDIN, label: 'LinkedIn' },
    { value: JobSource.INDEED, label: 'Indeed' },
    { value: JobSource.OTHER, label: '其他' }
  ];

  // 生成唯一的sourceId
  const generateSourceId = (): string => {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 处理Snackbar关闭
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  if (isJobLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container-lg">
      <div className="section space-y-6">
        {/* 页面标题和操作按钮 */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {isEdit ? '编辑职位' : '添加职位'}
              </h1>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {jobError && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 p-4 rounded-xl">
            {jobError}
          </div>
        )}

        {/* 表单 */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息 */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                基本信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    职位名称
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                      formErrors.title 
                        ? 'ring-red-500 focus:ring-red-500' 
                        : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
                    } transition-shadow`}
                    required
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    公司名称
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                      formErrors.company 
                        ? 'ring-red-500 focus:ring-red-500' 
                        : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
                    } transition-shadow`}
                    required
                  />
                  {formErrors.company && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    工作地点
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                      formErrors.location 
                        ? 'ring-red-500 focus:ring-red-500' 
                        : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
                    } transition-shadow`}
                    required
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    职位状态
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleSelectChange}
                    className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                      formErrors.status 
                        ? 'ring-red-500 focus:ring-red-500' 
                        : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
                    } transition-shadow`}
                  >
                    {JOB_STATUS_OPTIONS.map(option => {
                      const IconComponent = (LucideIcons as any)[option.icon] || LucideIcons.HelpCircle;
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                  {formErrors.status && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.status}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    职位类型
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleSelectChange}
                    className={`w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                      formErrors.jobType 
                        ? 'ring-red-500 focus:ring-red-500' 
                        : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
                    } transition-shadow`}
                  >
                    <option value="">请选择职位类型</option>
                    {jobTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.jobType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.jobType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-900/5 dark:border-gray-100/5" />

            {/* 职位来源 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  职位来源
                </h2>
                <button
                  type="button"
                  className="p-1 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  title="选择职位的来源平台，如果是手动添加则无需填写职位链接"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    来源平台
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleSelectChange}
                    className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                      formErrors.platform 
                        ? 'ring-red-500 focus:ring-red-500' 
                        : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
                    } transition-shadow"
                  >
                    {platformOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    职位链接
                  </label>
                  <input
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>

            {/* 职位描述 */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                职位描述
              </h2>
              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="请输入职位描述、要求等信息..."
                />
              </div>
            </div>

            {/* 保存按钮放在表单底部 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 提示消息 */}
      {snackbar.open && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white ${
          snackbar.severity === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default JobFormPage; 