import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchJob } from '@/redux/slices/jobsSlice';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Grid,
  Link
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading, error } = useAppSelector(state => state.jobs);

  useEffect(() => {
    if (id) {
      dispatch(fetchJob(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleApply = () => {
    if (job) {
      navigate(`/application/new?jobId=${job._id}`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <Alert severity="warning">未找到职位信息</Alert>
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {typeof job.company === 'string' ? job.company : job.company.name}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApply}
                >
                  跟踪申请
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>职位描述</Typography>
              <Typography variant="body1" paragraph>
                {job.description || '暂无描述'}
              </Typography>

              <Typography variant="h6" gutterBottom>要求</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {job.requirements?.map((requirement, index) => (
                  <Typography component="li" key={index} paragraph>
                    {requirement}
                  </Typography>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>职位信息</Typography>
                <Stack spacing={2}>
                  {job.location && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        工作地点
                      </Typography>
                      <Typography>{job.location}</Typography>
                    </Box>
                  )}

                  {job.jobType && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        工作类型
                      </Typography>
                      <Typography>{job.jobType}</Typography>
                    </Box>
                  )}

                  {job.salary && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        薪资范围
                      </Typography>
                      <Typography>{job.salary}</Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      来源平台
                    </Typography>
                    <Typography>{job.platform}</Typography>
                  </Box>

                  {job.link && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        职位链接
                      </Typography>
                      <Link href={job.link} target="_blank" rel="noopener noreferrer">
                        查看原始职位
                      </Link>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default JobDetailPage; 