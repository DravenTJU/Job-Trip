import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createJob, updateJob, fetchJob } from '@/redux/slices/jobsSlice';
import { Job, CreateJobData } from '@/types';
import { fetchCompanies } from '@/redux/slices/companiesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  const { companies, isLoading: isCompaniesLoading } = useSelector((state: RootState) => state.companies);
  
  // 表单状态
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    company: '',
    description: '',
    jobType: '',
    location: '',
    platform: '',
    source: '',
    sourceId: '',
    sourceUrl: '',
    requirements: [],
    status: 'new',
    salary: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // 加载数据
  useEffect(() => {
    dispatch(fetchCompanies({}));
    if (isEdit && id) {
      dispatch(fetchJob(id));
    }
  }, [dispatch, isEdit, id]);
  
  // 当编辑现有记录时，填充表单数据
  useEffect(() => {
    if (isEdit && job) {
      setFormData({
        title: job.title,
        company: typeof job.company === 'string' ? job.company : job.company._id,
        description: job.description || '',
        jobType: job.jobType || '',
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name!]: value,
    });
    
    // 清除相关错误
    if (formErrors[name!]) {
      setFormErrors({
        ...formErrors,
        [name!]: '',
      });
    }
  };
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 先进行表单验证
    if (!validateForm()) {
      return;
    }
    
    try {
      // 生成sourceId和sourceUrl
      const sourceId = formData.sourceId || generateSourceId();
      const sourceUrl = formData.sourceUrl || `https://jobtrip.example.com/jobs/${sourceId}`;
      
      // 准备提交数据
      const submitData: CreateJobData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        jobType: formData.jobType,
        location: formData.location,
        platform: formData.platform || 'manual',
        source: formData.source || 'manual',
        sourceId,
        sourceUrl,
        requirements: formData.requirements || [],
        status: formData.status || 'new',
        salary: formData.salary || undefined
      };

      if (isEdit) {
        const result = await dispatch(updateJob({ id, data: submitData })).unwrap();
        navigate(`/jobs/${result._id}`);
      } else {
        const result = await dispatch(createJob(submitData)).unwrap();
        navigate(`/jobs/${result._id}`);
      }
    } catch (error) {
      console.error('提交失败:', error);
      // 显示错误信息
      setFormErrors({
        ...formErrors,
        submit: error instanceof Error ? error.message : '提交失败，请重试'
      });
    }
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // 验证标题
    if (!formData.title.trim()) {
      errors.title = '请输入职位名称';
    }
    
    // 验证公司
    if (!formData.company) {
      errors.company = '请选择公司';
    }

    // 验证工作类型
    if (!formData.jobType) {
      errors.jobType = '请选择工作类型';
    }

    // 验证平台
    if (!formData.platform) {
      errors.platform = '请选择平台';
    }

    // 验证来源
    if (!formData.source) {
      errors.source = '请选择来源';
    }

    // 验证职位链接
    if (!formData.sourceUrl) {
      errors.sourceUrl = '请输入职位链接';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 工作类型选项
  const jobTypeOptions = [
    { value: 'full-time', label: '全职' },
    { value: 'part-time', label: '兼职' },
    { value: 'contract', label: '合同工' },
    { value: 'freelance', label: '自由职业' },
    { value: 'internship', label: '实习' }
  ];

  // 平台选项
  const platformOptions = [
    { value: 'manual', label: '手动添加' },
    { value: 'seek', label: 'Seek' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'indeed', label: 'Indeed' }
  ];

  // 状态选项
  const statusOptions = [
    { value: 'new', label: '新职位' },
    { value: 'active', label: '活跃' },
    { value: 'closed', label: '已关闭' },
    { value: 'draft', label: '草稿' }
  ];

  // 生成唯一的sourceId
  const generateSourceId = (): string => {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };
  
  // 判断是否正在加载
  const isLoading = isCompaniesLoading || (isEdit && isJobLoading);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      {/* 返回按钮 */}
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        返回
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? '编辑职位' : '添加新职位'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {isEdit ? '更新职位信息' : '添加一个新的职位到您的求职列表'}
      </Typography>
      
      {/* 错误提示 */}
      {jobError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {jobError}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* 显示提交错误 */}
          {formErrors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.submit}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {/* 职位名称 */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="职位名称"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            
            {/* 公司 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.company}>
                <InputLabel>公司</InputLabel>
                <Select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  label="公司"
                >
                  {companies.map(company => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.company && (
                  <FormHelperText>{formErrors.company}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* 工作类型 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>工作类型</InputLabel>
                <Select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  label="工作类型"
                >
                  {jobTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* 地点 */}
            <Grid item xs={12} md={6}>
              <TextField
                name="location"
                label="工作地点"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                placeholder="例如：北京"
              />
            </Grid>
            
            {/* 薪资 */}
            <Grid item xs={12} md={6}>
              <TextField
                name="salary"
                label="薪资范围"
                value={formData.salary}
                onChange={handleChange}
                fullWidth
                placeholder="例如：15k-20k"
              />
            </Grid>
            
            {/* 平台 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>平台</InputLabel>
                <Select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  label="平台"
                >
                  {platformOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* 来源 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>来源</InputLabel>
                <Select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  label="来源"
                >
                  <MenuItem value="manual">手动添加</MenuItem>
                  <MenuItem value="seek">Seek</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="indeed">Indeed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* 职位链接 */}
            <Grid item xs={12}>
              <TextField
                name="sourceUrl"
                label="职位链接"
                value={formData.sourceUrl}
                onChange={handleChange}
                fullWidth
                placeholder="例如：https://example.com/job/123"
              />
            </Grid>
            
            {/* 职位描述 */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="职位描述"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={6}
                placeholder="输入职位详细描述..."
              />
            </Grid>
            
            {/* 状态 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="状态"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              取消
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              {isEdit ? '更新职位' : '保存职位'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default JobFormPage; 