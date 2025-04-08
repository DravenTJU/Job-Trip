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
  SelectChangeEvent,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  useTheme
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createJob, updateJob, fetchJob } from '@/redux/slices/jobsSlice';
import { Job, CreateJobData, JobStatus, JobType, JobSource } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * 职位表单页面
 * 用于创建或编辑职位
 */
const JobFormPage: React.FC = () => {
  const theme = useTheme();
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
    jobType: '',
    location: '',
    platform: 'manual',
    source: '',
    sourceId: '',
    sourceUrl: '',
    requirements: [],
    status: 'new',
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
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: '请检查表单错误并重试',
        severity: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        sourceId: formData.sourceId || generateSourceId()
      };
      
      if (isEdit && id) {
        await dispatch(updateJob({ id, data: submitData })).unwrap();
        setSnackbar({
          open: true,
          message: '职位更新成功',
          severity: 'success'
        });
      } else {
        await dispatch(createJob(submitData)).unwrap();
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
    return Object.keys(errors).length === 0;
  };
  
  // 状态选项
  const statusOptions = [
    { value: JobStatus.NEW, label: '新职位' },
    { value: JobStatus.APPLIED, label: '已申请' },
    { value: JobStatus.INTERVIEWING, label: '面试中' },
    { value: JobStatus.OFFER, label: '已录用' },
    { value: JobStatus.REJECTED, label: '已拒绝' },
    { value: JobStatus.WITHDRAWN, label: '已撤回' },
    { value: JobStatus.CLOSED, label: '已关闭' }
  ];

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
  
  // 更新表单控件的样式
  const formControlStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgb(249, 250, 251)', // gray-50
      borderRadius: '0.75rem',
      '&:hover fieldset': {
        borderColor: 'rgb(37, 99, 235)', // blue-600
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgb(37, 99, 235)', // blue-600
        borderWidth: '1px'
      },
      '& fieldset': {
        borderColor: 'rgb(229, 231, 235)', // gray-200
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'rgb(37, 99, 235)' // blue-600
    }
  };
  
  if (isJobLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      {/* 页面标题和操作按钮 */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: 'rgb(249, 250, 251)', // gray-50
          boxShadow: 'none',
          borderRadius: '0.5rem',
          border: '1px solid rgb(229, 231, 235)' // gray-200
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton 
              onClick={handleBack} 
              size="small"
              sx={{ 
                color: 'rgb(75, 85, 99)', // gray-600
                '&:hover': {
                  color: 'rgb(37, 99, 235)', // blue-600
                  backgroundColor: 'rgba(37, 99, 235, 0.04)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h5"
              sx={{ 
                color: 'rgb(17, 24, 39)', // gray-900
                fontWeight: 600,
                fontSize: '1.5rem'
              }}
            >
              {isEdit ? '编辑职位' : '添加职位'}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              backgroundColor: 'rgb(37, 99, 235)', // blue-600
              '&:hover': {
                backgroundColor: 'rgb(29, 78, 216)' // blue-700
              },
              '&:disabled': {
                backgroundColor: 'rgb(229, 231, 235)', // gray-200
                color: 'rgb(107, 114, 128)' // gray-500
              },
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              borderRadius: '0.375rem'
            }}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </Stack>
      </Paper>

      {/* 错误提示 */}
      {jobError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgb(254, 242, 242)', // red-50
            color: 'rgb(153, 27, 27)', // red-800
            '& .MuiAlert-icon': {
              color: 'rgb(153, 27, 27)' // red-800
            },
            borderRadius: '0.375rem'
          }}
        >
          {jobError}
        </Alert>
      )}

      {/* 表单 */}
      <Paper 
        sx={{ 
          p: 3,
          backgroundColor: 'rgb(249, 250, 251)', // gray-50
          boxShadow: 'none',
          borderRadius: '0.5rem',
          border: '1px solid rgb(229, 231, 235)' // gray-200
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 基本信息 */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: 'rgb(17, 24, 39)', // gray-900
                  fontWeight: 600,
                  fontSize: '1.25rem'
                }}
              >
                基本信息
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="职位名称"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                    required
                    sx={formControlStyle}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="公司名称"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    error={!!formErrors.company}
                    helperText={formErrors.company}
                    required
                    sx={formControlStyle}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={!!formErrors.jobType} 
                    required
                    sx={formControlStyle}
                  >
                    <InputLabel>工作类型</InputLabel>
                    <Select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      label="工作类型"
                    >
                      {jobTypeOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.jobType && (
                      <FormHelperText>{formErrors.jobType}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="工作地点"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    sx={formControlStyle}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="薪资范围"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="例如：15k-20k"
                    sx={formControlStyle}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={!!formErrors.status}
                    sx={formControlStyle}
                  >
                    <InputLabel>状态</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="状态"
                    >
                      {statusOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ 
                my: 2,
                borderColor: 'rgb(229, 231, 235)' // gray-200
              }} />
            </Grid>

            {/* 职位来源 */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: 'rgb(17, 24, 39)', // gray-900
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                职位来源
                <Tooltip title="选择职位的来源平台，如果是手动添加则无需填写职位链接">
                  <IconButton 
                    size="small" 
                    sx={{ 
                      ml: 1,
                      color: 'rgb(75, 85, 99)', // gray-600
                      '&:hover': {
                        color: 'rgb(37, 99, 235)', // blue-600
                        backgroundColor: 'rgba(37, 99, 235, 0.04)'
                      }
                    }}
                  >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={!!formErrors.platform} 
                    required
                    sx={formControlStyle}
                  >
                    <InputLabel>平台</InputLabel>
                    <Select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      label="平台"
                    >
                      {platformOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.platform && (
                      <FormHelperText>{formErrors.platform}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="职位链接"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    error={!!formErrors.sourceUrl}
                    helperText={formErrors.sourceUrl}
                    required
                    sx={formControlStyle}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ 
                my: 2,
                borderColor: 'rgb(229, 231, 235)' // gray-200
              }} />
            </Grid>

            {/* 职位描述 */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: 'rgb(17, 24, 39)', // gray-900
                  fontWeight: 600,
                  fontSize: '1.25rem'
                }}
              >
                职位描述
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="职位描述"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="请输入职位描述、要求等信息..."
                sx={formControlStyle}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'success' ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)', // green-600 : red-600
            borderRadius: '0.375rem'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobFormPage; 