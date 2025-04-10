import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Chip, 
  Button, 
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { Job } from '@/types';

interface JobListItemProps {
  job: Job;
}

/**
 * 职位列表项组件
 * 展示单个职位的基本信息并提供操作按钮
 */
const JobListItem: React.FC<JobListItemProps> = ({ job }) => {
  // 处理外部链接点击
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // 公司名称处理
  const companyName = typeof job.company === 'string' ? job.company : job.company.name;
  
  return (
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
              {companyName}
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
              to="/jobs/track"
              variant="contained" 
              size="small"
              color="primary"
            >
              跟踪申请
            </Button>
            
            {job.link && (
              <Tooltip title="打开职位链接">
                <IconButton 
                  component="a" 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleExternalLinkClick}
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
  );
};

export default JobListItem; 