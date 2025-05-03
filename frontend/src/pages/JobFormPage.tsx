import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchJob, createJob, updateJob } from '@/redux/slices/jobsSlice';
import { fetchCompanies } from '@/redux/slices/companiesSlice';
import { CreateJobData } from '@/types';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Autocomplete
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

/**
 * 职位表单页面
 * 用于创建或编辑职位
 */
const JobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading: jobLoading, error: jobError } = useAppSelector(state => state.jobs);
  const { companies, loading: companiesLoading } = useAppSelector(state => state.companies);

  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    company: '',
    description: '',
    jobType: '',
    location: '',
    salary: '',
    link: '',
    platform: '',
    source: '',
    sourceId: '',
    sourceUrl: '',
    requirements: [],
    status: '活跃'
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateJobData, string>>>({});

  useEffect(() => {
    dispatch(fetchCompanies());
    if (id) {
      dispatch(fetchJob(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (job && id) {
      setFormData({
        title: job.title,
        company: typeof job.company === 'string' ? job.company : job.company._id,
        description: job.description || '',
        jobType: job.jobType || '',
        location: job.location || '',
        salary: job.salary || '',
        link: job.link || '',
        platform: job.platform,
        source: job.source,
        sourceId: job.sourceId,
        sourceUrl: job.sourceUrl,
        requirements: job.requirements,
        status: job.status
      });
    }
  }, [job, id]);

  const validateForm = () => {
    const errors: Partial<Record<keyof CreateJobData, string>> = {};
    if (!formData.title) {
      errors.title = '请输入职位名称';
    }
    if (!formData.company) {
      errors.company = '请选择公司';
    }
    if (!formData.platform) {
      errors.platform = '请输入来源平台';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== '')
      };

      if (id) {
        await dispatch(updateJob({ id, jobData: submitData })).unwrap();
      } else {
        await dispatch(createJob(submitData)).unwrap();
      }
      navigate('/jobs');
    } catch (error) {
      console.error('保存职位失败:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof CreateJobData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCompanyChange = (_: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      company: value?._id || ''
    }));
    if (formErrors.company) {
      setFormErrors(prev => ({
        ...prev,
        company: ''
      }));
    }
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const requirements = e.target.value.split('\n');
    setFormData(prev => ({
      ...prev,
      requirements
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (jobLoading || companiesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (jobError) {
    return (
      <Container>
        <Alert severity="error">{jobError}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          返回
        </Button>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {id ? '编辑职位' : '添加职位'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="职位名称"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={companies || []}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                  value={companies?.find(c => c._id === formData.company) || null}
                  onChange={handleCompanyChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="公司"
                      error={!!formErrors.company}
                      helperText={formErrors.company}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="工作地点"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="工作类型"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  select
                >
                  <MenuItem value="全职">全职</MenuItem>
                  <MenuItem value="兼职">兼职</MenuItem>
                  <MenuItem value="实习">实习</MenuItem>
                  <MenuItem value="自由职业">自由职业</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="薪资范围"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="职位链接"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="来源平台"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  error={!!formErrors.platform}
                  helperText={formErrors.platform}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="状态"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  select
                >
                  <MenuItem value="活跃">活跃</MenuItem>
                  <MenuItem value="已关闭">已关闭</MenuItem>
                  <MenuItem value="已过期">已过期</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="职位描述"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="职位要求（每行一条）"
                  name="requirements"
                  value={formData.requirements.join('\n')}
                  onChange={handleRequirementsChange}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    保存
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default JobFormPage; 