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
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchJob, deleteJob } from '@/redux/slices/jobsSlice';
import { createUserJob } from '@/redux/slices/userJobsSlice';
import { ApplicationStatus, JobStatus, JobSource } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SourceIcon from '@mui/icons-material/Source';
import UpdateIcon from '@mui/icons-material/Update';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

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
        return 'primary';
      case JobStatus.APPLIED:
        return 'info';
      case JobStatus.INTERVIEWING:
        return 'warning';
      case JobStatus.OFFER:
        return 'success';
      case JobStatus.REJECTED:
        return 'error';
      case JobStatus.WITHDRAWN:
        return 'default';
      case JobStatus.CLOSED:
        return 'default';
      default:
        return 'default';
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4" component="h1">
                {job.title}
              </Typography>
              <Chip
                label={job.status}
                color={getStatusColor(job.status)}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
            
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon sx={{ mr: 1, opacity: 0.7 }} />
              {getCompanyName()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={() => {
                window.location.href = 'http://localhost:3000/jobs/track';
              }}
            >
              跟踪
            </Button>
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
          <Grid item xs={12}>
            <Stack spacing={3}>
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
                        添加于 {formatDate(job.createdAt, true)}
                      </Typography>
                    </Box>
                  </Grid>

                  {job.updatedAt && job.updatedAt !== job.createdAt && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UpdateIcon sx={{ mr: 1, opacity: 0.7 }} />
                        <Typography variant="body1">
                          更新于 {formatDate(job.updatedAt, true)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
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

              {/* 职位要求 */}
              {job.requirements && job.requirements.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      职位要求
                    </Typography>
                    <List>
                      {job.requirements.map((requirement, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                          </ListItemIcon>
                          <ListItemText primary={requirement} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
              )}
              
              {/* 职位来源 */}
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>
                  职位来源
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SourceIcon sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body1">
                      来自 {getPlatformLabel(job.platform)}
                    </Typography>
                  </Box>
                  
                  {job.sourceUrl && (
                    <Link 
                      href={job.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={handleExternalLinkClick}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Typography variant="body1">
                        查看原始职位
                      </Typography>
                      <LaunchIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Link>
                  )}
                </Stack>
              </Box>
            </Stack>
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
    </Box>
  );
};

export default JobDetailPage; 