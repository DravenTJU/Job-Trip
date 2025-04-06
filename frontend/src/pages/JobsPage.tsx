import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Pagination,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LaunchIcon from '@mui/icons-material/Launch';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { RootState } from '@/redux/store';
import { fetchJobs } from '@/redux/slices/jobsSlice';
import NoDataPlaceholder from '@/components/common/NoDataPlaceholder';

/**
 * 职位列表页面组件
 */
const JobsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { jobs = [], pagination, isLoading, error } = useAppSelector((state: RootState) => state.jobs);
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('-createdAt'); // 默认按创建时间降序
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // 加载职位列表数据
  const loadJobs = async () => {
    try {
      const params = {
        page,
        limit,
        search: searchTerm,
        sort: sortOption
      };
      console.log('开始加载职位列表数据...');
      console.log('请求参数:', params);
      
      // 获取职位列表
      const result = await dispatch(fetchJobs(params));
      if (fetchJobs.fulfilled.match(result)) {
        console.log('职位列表加载成功:', result.payload);
        if (result.payload.data.length === 0) {
          console.log('职位列表为空，尝试不带参数重新获取...');
          // 尝试不带任何参数重新获取
          const retryResult = await dispatch(fetchJobs({ page: 1, limit: 10 }));
          console.log('重试结果:', retryResult);
        }
      } else {
        console.error('职位列表加载失败:', result.error);
      }
    } catch (error) {
      console.error('加载数据时出错:', error);
    }
  };
  
  // 初始加载
  useEffect(() => {
    loadJobs();
  }, [dispatch, page, limit, searchTerm, sortOption]);
  
  // 处理搜索变更
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // 重置页码
  };
  
  // 处理排序变更
  const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(e.target.value);
    setPage(1); // 重置页码
  };
  
  // 处理页码变更
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // 添加新职位
  const handleAddJob = () => {
    navigate('/jobs/new');
  };
  
  return (
    <Box>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            职位列表
          </Typography>
          <Typography variant="body1" color="text.secondary">
            查看和管理您的所有求职申请
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddJob}
            sx={{ mr: 1 }}
          >
            添加职位
          </Button>
        </Grid>
      </Grid>
      
      {/* 搜索和筛选 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="搜索职位名称、公司或地点..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="排序方式"
              value={sortOption}
              onChange={handleSortChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="-createdAt">最新添加</MenuItem>
              <MenuItem value="createdAt">最早添加</MenuItem>
              <MenuItem value="title">职位名称（A-Z）</MenuItem>
              <MenuItem value="-title">职位名称（Z-A）</MenuItem>
              <MenuItem value="company">公司名称（A-Z）</MenuItem>
              <MenuItem value="-company">公司名称（Z-A）</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* 职位列表 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : jobs && jobs.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {jobs.map((job) => (
              <Grid item xs={12} key={job._id}>
                <Box sx={{ mb: 2 }}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      transition: 'transform 0.2s, box-shadow 0.2s', 
                      '&:hover': { 
                        transform: 'translateY(-2px)', 
                        boxShadow: 3 
                      }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      {/* 职位基本信息 */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ mb: { xs: 1, md: 0 } }}>
                          <Typography 
                            variant="h6" 
                            component={RouterLink} 
                            to={`/jobs/${job._id}`}
                            sx={{ 
                              fontWeight: 'bold',
                              textDecoration: 'none',
                              color: 'primary.main',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {job.title}
                          </Typography>
                          
                          <Typography variant="body1" sx={{ my: 0.5 }}>
                            {typeof job.company === 'string' ? job.company : job.company.name}
                            {job.location && <span> · {job.location}</span>}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {job.jobType && (
                              <Chip 
                                label={job.jobType} 
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                            {job.salary && (
                              <Chip 
                                label={job.salary}
                                size="small" 
                                variant="outlined" 
                                color="secondary"
                              />
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      
                      {/* 操作按钮 */}
                      <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                          <Button 
                            component={RouterLink} 
                            to={`/jobs/${job._id}`}
                            variant="outlined" 
                            size="small"
                          >
                            查看详情
                          </Button>
                          
                          <Button 
                            component={RouterLink} 
                            to={`/application/new?jobId=${job._id}`}
                            variant="contained" 
                            size="small"
                            color="primary"
                          >
                            跟踪申请
                          </Button>
                          
                          {job.sourceUrl && (
                            <Tooltip title="打开职位链接">
                              <IconButton 
                                component="a" 
                                href={job.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                size="small"
                                color="primary"
                              >
                                <LaunchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          {/* 分页控件 */}
          {pagination && pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <NoDataPlaceholder 
            title="暂无职位数据"
            message="您尚未添加任何职位申请。点击添加职位按钮开始追踪您的求职之旅。"
            actionText="添加职位"
            onAction={handleAddJob}
          />
        </Paper>
      )}
    </Box>
  );
};

export default JobsPage; 