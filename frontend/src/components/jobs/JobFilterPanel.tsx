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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import GenericListbox, { SelectOption } from '@/components/common/GenericListbox';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({});
  const [activeFilters, setActiveFilters] = useState<JobFilters>({});

  // 定义选项列表
  const jobTypeOptions: SelectOption[] = [
    { id: '', label: '全部' },
    { id: '全职', label: '全职' },
    { id: '兼职', label: '兼职' },
    { id: '实习', label: '实习' },
    { id: '合同', label: '合同' },
    { id: '自由职业', label: '自由职业' }
  ];

  const salaryOptions: SelectOption[] = [
    { id: '', label: '全部' },
    { id: '低于10k NZD', label: '低于10k NZD' },
    { id: '10k-20k NZD', label: '10k-20k NZD' },
    { id: '20k-30k NZD', label: '20k-30k NZD' },
    { id: '30k以上 NZD', label: '30k以上 NZD' }
  ];

  const datePostedOptions: SelectOption[] = [
    { id: '', label: '全部' },
    { id: '今天', label: '今天' },
    { id: '过去3天', label: '过去3天' },
    { id: '过去一周', label: '过去一周' },
    { id: '过去一个月', label: '过去一个月' }
  ];

  // 处理输入变更
  const handleFilterChange = (field: keyof JobFilters) => (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  // 处理选择变更
  const handleSelectChange = (field: keyof JobFilters) => (option: SelectOption | null) => {
    setFilters({ ...filters, [field]: option ? option.id.toString() : '' });
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

  // 获取当前选项
  const getSelectedOption = (options: SelectOption[], field: keyof JobFilters) => {
    return options.find(option => option.id.toString() === filters[field]) || options[0];
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
          label={`添加时间: ${activeFilters.datePosted}`} 
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
              <FormControl fullWidth size="small">
                <InputLabel id="job-type-label" shrink={false} sx={{ opacity: 0 }}>工作类型</InputLabel>
                <GenericListbox
                  options={jobTypeOptions}
                  value={getSelectedOption(jobTypeOptions, 'jobType')}
                  onChange={handleSelectChange('jobType')}
                  label="工作类型"
                  name="jobType"
                  ariaLabel="工作类型选择"
                  className="!mt-0"
                  buttonClassName="!rounded-md !bg-white dark:!bg-gray-900"
                />
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
              <FormControl fullWidth size="small">
                <InputLabel id="salary-label" shrink={false} sx={{ opacity: 0 }}>薪资范围</InputLabel>
                <GenericListbox
                  options={salaryOptions}
                  value={getSelectedOption(salaryOptions, 'salary')}
                  onChange={handleSelectChange('salary')}
                  label="薪资范围"
                  name="salary"
                  ariaLabel="薪资范围选择"
                  className="!mt-0"
                  buttonClassName="!rounded-md !bg-white dark:!bg-gray-900"
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="date-posted-label" shrink={false} sx={{ opacity: 0 }}>添加时间</InputLabel>
                <GenericListbox
                  options={datePostedOptions}
                  value={getSelectedOption(datePostedOptions, 'datePosted')}
                  onChange={handleSelectChange('datePosted')}
                  label="添加时间"
                  name="datePosted"
                  ariaLabel="添加时间选择"
                  className="!mt-0"
                  buttonClassName="!rounded-md !bg-white dark:!bg-gray-900"
                />
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