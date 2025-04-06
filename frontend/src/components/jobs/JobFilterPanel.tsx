import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Button, 
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

interface JobFilterPanelProps {
  onFilter: (filters: JobFilters) => void;
}

export interface JobFilters {
  jobType?: string;
  location?: string;
  salary?: string;
  datePosted?: string;
}

/**
 * 职位过滤面板组件
 * 提供高级筛选功能
 */
const JobFilterPanel: React.FC<JobFilterPanelProps> = ({ onFilter }) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({});
  const [activeFilters, setActiveFilters] = useState<JobFilters>({});

  // 处理输入变更
  const handleFilterChange = (field: keyof JobFilters) => (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  // 应用筛选
  const applyFilters = () => {
    setActiveFilters(filters);
    onFilter(filters);
    setExpanded(false);
  };

  // 重置筛选
  const resetFilters = () => {
    const emptyFilters = {} as JobFilters;
    setFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  // 移除单个筛选
  const removeFilter = (field: keyof JobFilters) => () => {
    const newFilters = { ...activeFilters };
    delete newFilters[field];
    setFilters(newFilters);
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  // 获取激活的筛选器标签
  const getActiveFilterChips = () => {
    const chips = [];
    
    if (activeFilters.jobType) {
      chips.push(
        <Chip 
          key="jobType" 
          label={`工作类型: ${activeFilters.jobType}`} 
          onDelete={removeFilter('jobType')}
          size="small"
        />
      );
    }
    
    if (activeFilters.location) {
      chips.push(
        <Chip 
          key="location" 
          label={`地点: ${activeFilters.location}`} 
          onDelete={removeFilter('location')}
          size="small"
        />
      );
    }
    
    if (activeFilters.salary) {
      chips.push(
        <Chip 
          key="salary" 
          label={`薪资: ${activeFilters.salary}`} 
          onDelete={removeFilter('salary')}
          size="small"
        />
      );
    }
    
    if (activeFilters.datePosted) {
      chips.push(
        <Chip 
          key="datePosted" 
          label={`发布时间: ${activeFilters.datePosted}`} 
          onDelete={removeFilter('datePosted')}
          size="small"
        />
      );
    }
    
    return chips;
  };

  return (
    <Paper sx={{ mb: 3 }}>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">高级筛选</Typography>
            
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              {getActiveFilterChips()}
            </Box>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>工作类型</InputLabel>
                <Select
                  value={filters.jobType || ''}
                  onChange={handleFilterChange('jobType') as any}
                  label="工作类型"
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="全职">全职</MenuItem>
                  <MenuItem value="兼职">兼职</MenuItem>
                  <MenuItem value="实习">实习</MenuItem>
                  <MenuItem value="合同">合同</MenuItem>
                  <MenuItem value="自由职业">自由职业</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="地点"
                variant="outlined"
                size="small"
                value={filters.location || ''}
                onChange={handleFilterChange('location')}
                placeholder="例如：北京"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>薪资范围</InputLabel>
                <Select
                  value={filters.salary || ''}
                  onChange={handleFilterChange('salary') as any}
                  label="薪资范围"
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="低于10k NZD">低于10k NZD</MenuItem>
                  <MenuItem value="10k-20k NZD">10k-20k NZD</MenuItem>
                  <MenuItem value="20k-30k NZD">20k-30k NZD</MenuItem>
                  <MenuItem value="30k以上 NZD">30k以上 NZD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>发布时间</InputLabel>
                <Select
                  value={filters.datePosted || ''}
                  onChange={handleFilterChange('datePosted') as any}
                  label="发布时间"
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="今天">今天</MenuItem>
                  <MenuItem value="过去3天">过去3天</MenuItem>
                  <MenuItem value="过去一周">过去一周</MenuItem>
                  <MenuItem value="过去一个月">过去一个月</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={resetFilters}
              startIcon={<CloseIcon />}
            >
              重置
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={applyFilters}
            >
              应用筛选
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default JobFilterPanel; 