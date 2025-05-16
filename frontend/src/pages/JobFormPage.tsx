import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createJob, updateJob, fetchJob } from '@/redux/slices/jobsSlice';
import { Job, CreateJobData, JobStatus, JobType, JobSource } from '@/types';
import { JOB_STATUS_OPTIONS, getStatusIcon } from '@/utils/jobStatusUtils';
import StatusSelect from '@/components/common/StatusSelect';
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
import { useTranslation } from 'react-i18next';
import GenericListbox, { SelectOption } from '@/components/common/GenericListbox';

/**
 * 职位表单页面
 * 用于创建或编辑职位
 */
const JobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation('jobs');
  
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
    console.log(t('input_change_log', '输入框 {{name}} 变化，值为: {{value}}', { name, value }));
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
  
  // 工作类型选项
  const jobTypeOptions: SelectOption[] = [
    { id: JobType.FULL_TIME, label: t('full_time', '全职') },
    { id: JobType.PART_TIME, label: t('part_time', '兼职') },
    { id: JobType.CONTRACT, label: t('contract', '合同工') },
    { id: JobType.FREELANCE, label: t('freelance', '自由职业') },
    { id: JobType.INTERNSHIP, label: t('internship', '实习') }
  ];

  // 平台选项
  const platformOptions: SelectOption[] = [
    { id: JobSource.SEEK, label: 'Seek' },
    { id: JobSource.LINKEDIN, label: 'LinkedIn' },
    { id: JobSource.INDEED, label: 'Indeed' },
    { id: JobSource.OTHER, label: t('other', '其他') }
  ];
  
  // 处理JobType选择变化
  const handleJobTypeChange = (option: SelectOption | null) => {
    if (option) {
      setFormData(prev => ({
        ...prev,
        jobType: option.id as JobType
      }));
      if (formErrors.jobType) {
        setFormErrors(prev => ({
          ...prev,
          jobType: '',
        }));
      }
    }
  };
  
  // 处理Platform选择变化
  const handlePlatformChange = (option: SelectOption | null) => {
    if (option) {
      setFormData(prev => ({
        ...prev,
        platform: option.id as JobSource
      }));
      if (formErrors.platform) {
        setFormErrors(prev => ({
          ...prev,
          platform: '',
        }));
      }
    }
  };
  
  // 查找当前选中的工作类型选项
  const selectedJobType = jobTypeOptions.find(option => option.id === formData.jobType) || null;
  
  // 查找当前选中的平台选项
  const selectedPlatform = platformOptions.find(option => option.id === formData.platform) || null;
  
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
    console.log(t('form_submit_log', '表单提交事件触发'));
    e.preventDefault();
    
    if (!validateForm()) {
      console.log(t('form_validation_failed', '表单校验未通过'));
      setSnackbar({
        open: true,
        message: t('check_form_errors', '请检查表单错误并重试'),
        severity: 'error'
      });
      return;
    }
    console.log(t('form_validation_passed', '表单校验通过，开始提交'));
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        sourceId: formData.sourceId || generateSourceId()
      };
      console.log(t('submit_data_log', '提交数据:'), submitData);
      
      if (isEdit && id) {
        await dispatch(updateJob({ id, data: submitData })).unwrap();
        setSnackbar({
          open: true,
          message: t('job_update_success', '职位更新成功'),
          severity: 'success'
        });
      } else {
        await dispatch(createJob(submitData)).unwrap();
        console.log(t('submit_success', '提交成功'));
        setSnackbar({
          open: true,
          message: t('job_create_success', '职位创建成功'),
          severity: 'success'
        });
      }
      
      // 延迟导航以显示成功消息
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    } catch (error) {
      console.log(t('submit_failed', '提交失败:'), error);
      setSnackbar({
        open: true,
        message: t('save_failed', '保存失败，请重试'),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    console.log(t('start_form_validation', '开始表单校验'));
    const errors: Record<string, string> = {};
    
    // 验证标题
    if (!formData.title.trim()) {
      errors.title = t('enter_job_title', '请输入职位名称');
    }
    
    // 验证公司
    if (!formData.company.trim()) {
      errors.company = t('enter_company_name', '请输入公司名称');
    }

    // 验证工作地点
    if (!formData.location.trim()) {
      errors.location = t('enter_work_location', '请输入工作地点');
    }

    // 验证工作类型
    if (!formData.jobType) {
      errors.jobType = t('select_job_type', '请选择工作类型');
    } else if (!Object.values(JobType).includes(formData.jobType as JobType)) {
      errors.jobType = t('invalid_job_type', '无效的工作类型');
    }

    // 验证平台
    if (!formData.platform) {
      errors.platform = t('select_platform', '请选择平台');
    } else if (!platformOptions.some(option => option.id === formData.platform)) {
      errors.platform = t('invalid_platform', '无效的平台');
    }

    // 验证来源
    if (!formData.source) {
      formData.source = formData.platform;
    }

    // 验证职位链接
    if (formData.platform !== 'manual') {
      if (!formData.sourceUrl) {
        errors.sourceUrl = t('enter_job_link', '请输入职位链接');
      } else if (!formData.sourceUrl.startsWith('http://') && !formData.sourceUrl.startsWith('https://')) {
        errors.sourceUrl = t('enter_valid_job_link', '请输入有效的职位链接');
      }
    }

    // 如果是手动添加，生成sourceId
    if (!formData.sourceId) {
      formData.sourceId = generateSourceId();
    }
    
    setFormErrors(errors);
    console.log(t('form_validation_errors', '表单校验错误详情:'), errors);
    return Object.keys(errors).length === 0;
  };
  
  // 状态选项
  const statusOptions = JOB_STATUS_OPTIONS;

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
                {isEdit ? t('edit_job', '编辑职位') : t('add_job', '添加职位')}
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
                {t('basic_info', '基本信息')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('job_title', '职位名称')}
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
                    {t('company_name', '公司名称')}
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
                    {t('work_location', '工作地点')}
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
                    {t('job_status', '职位状态')}
                  </label>
                  <StatusSelect
                    name="status"
                    value={formData.status}
                    onChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        status: value
                      }));
                      if (formErrors.status) {
                        setFormErrors(prev => ({
                          ...prev,
                          status: '',
                        }));
                      }
                    }}
                    error={formErrors.status}
                  />
                </div>
                <div>
                  <GenericListbox
                    options={jobTypeOptions}
                    value={selectedJobType}
                    onChange={handleJobTypeChange}
                    label={t('job_type', '职位类型')}
                    placeholder={t('select_job_type_placeholder', '请选择职位类型')}
                    name="jobType"
                    error={formErrors.jobType}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-900/5 dark:border-gray-100/5" />

            {/* 职位来源 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('job_source', '职位来源')}
                </h2>
                <button
                  type="button"
                  className="p-1 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  title={t('source_help_tooltip', '选择职位的来源平台，如果是手动添加则无需填写职位链接')}
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <GenericListbox
                    options={platformOptions}
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                    label={t('source_platform', '来源平台')}
                    name="platform"
                    error={formErrors.platform}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('job_link', '职位链接')}
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
                {t('job_description', '职位描述')}
              </h2>
              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder={t('job_description_placeholder', '请输入职位描述、要求等信息...')}
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
                {isSubmitting ? t('saving', '保存中...') : t('save', '保存')}
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