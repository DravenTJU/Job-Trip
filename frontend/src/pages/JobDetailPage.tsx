import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchJob, deleteJob } from '@/redux/slices/jobsSlice';
import { createUserJob } from '@/redux/slices/userJobsSlice';
import { ApplicationStatus } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * 职位详情页面组件
 */
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { job, isLoading, error } = useSelector((state: RootState) => state.jobs);
  
  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // 跟踪申请对话框状态
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  // 选择的申请状态
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(ApplicationStatus.WISHLIST);
  
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
    navigate(`/jobs/${id}/edit`);
  };
  
  // 处理删除
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const confirmDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteJob(id)).unwrap();
        navigate('/jobs');
      } catch (error) {
        console.error('删除职位失败:', error);
      }
    }
    closeDeleteDialog();
  };
  
  // 处理跟踪申请
  const openTrackDialog = () => {
    setTrackDialogOpen(true);
  };
  
  const closeTrackDialog = () => {
    setTrackDialogOpen(false);
  };
  
  const handleStatusChange = (status: ApplicationStatus) => {
    setSelectedStatus(status);
  };
  
  // 确认跟踪申请
  const confirmTrack = async () => {
    if (id) {
      try {
        await dispatch(createUserJob({
          job: id,
          status: selectedStatus,
          appliedDate: selectedStatus === ApplicationStatus.APPLIED ? new Date().toISOString() : undefined
        })).unwrap();
        closeTrackDialog();
      } catch (error) {
        console.error('创建申请记录失败:', error);
      }
    }
  };
  
  // 处理外部链接点击
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (job?.sourceUrl) {
      window.open(job.sourceUrl, '_blank');
    }
  };
  
  // 获取公司名称
  const getCompanyName = () => {
    if (!job) return '';
    return typeof job.company === 'string' ? job.company : job.company.name;
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  if (!job) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        未找到职位信息
      </Alert>
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
        返回职位列表
      </Button>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* 职位标题和操作按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {job.title}
            </Typography>
            
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon sx={{ mr: 1, opacity: 0.7 }} />
              {getCompanyName()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              编辑
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={openDeleteDialog}
            >
              删除
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* 职位信息 */}
        <Grid container spacing={3}>
          {/* 左侧详情 */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {/* 基本信息 */}
              <Box>
                <Grid container spacing={2}>
                  {job.location && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, opacity: 0.7 }} />
                        <Typography variant="body1">{job.location}</Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {job.jobType && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 1, opacity: 0.7 }} />
                        <Typography variant="body1">{job.jobType}</Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {job.salary && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon sx={{ mr: 1, opacity: 0.7 }} />
                        <Typography variant="body1">{job.salary}</Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon sx={{ mr: 1, opacity: 0.7 }} />
                      <Typography variant="body1">
                        添加于 {formatDate(job.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider />
              
              {/* 职位描述 */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  职位描述
                </Typography>
                {job.description ? (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {job.description}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    暂无职位描述
                  </Typography>
                )}
              </Box>
              
              {/* 外部链接 */}
              {job.link && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      职位链接
                    </Typography>
                    <Link 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={handleExternalLinkClick}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Typography variant="body1">
                        在官方网站查看
                      </Typography>
                      <LaunchIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Link>
                  </Box>
                </>
              )}
            </Stack>
          </Grid>
          
          {/* 右侧操作区 */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                跟踪您的申请
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                添加此职位到您的申请跟踪表，记录申请进度和重要日期。
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={openTrackDialog}
                sx={{ mb: 1 }}
              >
                跟踪此职位申请
              </Button>
              
              <Button
                component={RouterLink}
                to={`/application/new?jobId=${job._id}`}
                variant="outlined"
                fullWidth
              >
                高级设置
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>
          确认删除
        </DialogTitle>
        <DialogContent>
          <Typography>您确定要删除此职位 "{job.title}" 吗？此操作无法撤销。</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>取消</Button>
          <Button onClick={confirmDelete} color="error">删除</Button>
        </DialogActions>
      </Dialog>
      
      {/* 跟踪申请对话框 */}
      <Dialog open={trackDialogOpen} onClose={closeTrackDialog}>
        <DialogTitle>
          跟踪申请状态
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            选择此职位的当前申请状态：
          </Typography>
          <Grid container spacing={1}>
            {Object.values(ApplicationStatus).map((status) => (
              <Grid item xs={6} key={status}>
                <Button
                  variant={selectedStatus === status ? "contained" : "outlined"}
                  onClick={() => handleStatusChange(status)}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', mb: 1 }}
                >
                  {status}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTrackDialog}>取消</Button>
          <Button onClick={confirmTrack} color="primary" variant="contained">
            添加到跟踪列表
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDetailPage; 