import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchJobs } from '@/redux/slices/jobsSlice';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  SortDesc,
  SortAsc,
  X,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { JobSource, JobType } from '@/types';
import { getStatusStyle, JOB_STATUS_OPTIONS } from '@/utils/jobStatusUtils';

/**
 * 职位列表页面组件
 */
const JobsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { jobs, isLoading, error, pagination } = useSelector((state: RootState) => state.jobs);
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('-createdAt'); // 默认按创建时间降序
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // 筛选条件
  const [filters, setFilters] = useState({
    status: '',
    jobType: '',
    platform: '',
    location: '',
    dateRange: ''
  });
  
  // 时间范围选项
  const dateRanges = [
    { label: '所有时间', value: '' },
    { label: '今天', value: 'today' },
    { label: '最近3天', value: '3days' },
    { label: '最近一周', value: '1week' },
    { label: '最近一月', value: '1month' },
    { label: '最近三月', value: '3months' }
  ];
  
  // 工作类型选项
  const jobTypes = [
    { label: '所有类型', value: '' },
    { label: '全职', value: JobType.FULL_TIME },
    { label: '兼职', value: JobType.PART_TIME },
    { label: '实习', value: JobType.INTERNSHIP },
    { label: '合同工', value: JobType.CONTRACT },
    { label: '自由职业', value: JobType.FREELANCE }
  ];
  
  // 平台来源选项
  const platforms = [
    { label: '所有来源', value: '' },
    { label: 'LinkedIn', value: JobSource.LINKEDIN },
    { label: 'Seek', value: JobSource.SEEK },
    { label: 'Indeed', value: JobSource.INDEED },
    { label: '其他', value: JobSource.OTHER }
  ];
  
  // 状态选项
  const statusOptions = [
    { label: '所有状态', value: '' },
    ...JOB_STATUS_OPTIONS
  ];
  
  // 加载职位列表数据
  const loadJobs = async () => {
    try {
      // 构建查询参数
      const queryParams = {
        page,
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(sortOption && { sort: sortOption }),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };
      
      console.log('Fetching jobs with params:', queryParams);
      
      // 获取职位列表
      const result = await dispatch(fetchJobs(queryParams));
      
      // 处理响应
      if (fetchJobs.fulfilled.match(result)) {
        // 如果当前页没有数据，且不是第一页，回到第一页
        if (result.payload.data.length === 0 && page > 1) {
          setPage(1);
          return;
        }
      }
    } catch (error) {
      console.error('加载数据时出错:', error);
    }
  };
  
  // 初始加载和依赖更新时重新加载
  useEffect(() => {
    loadJobs();
  }, [page, limit, searchTerm, sortOption, filters]);
  
  useEffect(() => {
    setSortOption('-createdAt'); // 每次进入页面都重置为最新添加
  }, []);
  
  // 处理搜索变更
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // 重置页码
  };
  
  // 处理排序变更
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setPage(1); // 重置页码
  };
  
  // 处理筛选变更
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(1); // 重置页码
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setFilters({
      status: '',
      jobType: '',
      platform: '',
      location: '',
      dateRange: ''
    });
    setPage(1);
  };
  
  // 处理页码变更
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // 添加新职位
  const handleAddJob = () => {
    navigate('/jobs/new');
  };
  
  return (
    <div className="container-lg">
      <div className="section space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">职位列表</h1>
            <p className="text-gray-500 dark:text-gray-400">
              查看和管理您的所有职位信息
            </p>
          </div>
          <button 
            onClick={handleAddJob}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4" />
            手动添加职位
          </button>
        </div>
      
      {/* 搜索和筛选 */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
          <div className="p-6 space-y-6">
            {/* 搜索栏 */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
              placeholder="搜索职位名称、公司或地点..."
              value={searchTerm}
              onChange={handleSearchChange}
                  className="w-full h-11 pl-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
              </div>
              <div className="flex gap-3">
                <select
              value={sortOption}
              onChange={handleSortChange}
                  className="h-11 min-w-[160px] bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                >
                  <option value="-createdAt">最新添加</option>
                  <option value="createdAt">最早添加</option>
                  <option value="title">职位名称（A-Z）</option>
                  <option value="-title">职位名称（Z-A）</option>
                  <option value="company">公司名称（A-Z）</option>
                  <option value="-company">公司名称（Z-A）</option>
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-11 px-5 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 ${
                    showFilters 
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25' 
                      : 'bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  筛选
                </button>
              </div>
            </div>
            
            {/* 筛选面板 */}
            {showFilters && (
              <div className="pt-6 border-t border-gray-900/5 dark:border-gray-100/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <h3 className="text-base font-medium">筛选条件</h3>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    重置
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 状态筛选 */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-gray-100/5"></div>
                      状态
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full h-11 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 工作类型筛选 */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      工作类型
                    </label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => handleFilterChange('jobType', e.target.value)}
                      className="w-full h-11 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                      {jobTypes.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 平台来源筛选 */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      平台来源
                    </label>
                    <select
                      value={filters.platform}
                      onChange={(e) => handleFilterChange('platform', e.target.value)}
                      className="w-full h-11 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                      {platforms.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 添加时间筛选 */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      添加时间
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full h-11 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                      {dateRanges.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 地点筛选 */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      工作地点
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="输入城市名称"
                      className="w-full h-11 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      
      {/* 错误提示 */}
      {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          {error}
          </div>
      )}
      
      {/* 职位列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">加载失败，请重试</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无职位数据</p>
        </div>
      ) : (
        <div className="space-y-4">
            {jobs.map((job) => (
            <div 
              key={job._id}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      <a 
                        href={`/jobs/${job._id}`}
                        className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {job.title}
                      </a>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                            {typeof job.company === 'string' ? job.company : job.company.name}
                      {job.location && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                        </>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                            {job.jobType && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Briefcase className="w-3 h-3" />
                          {job.jobType}
                        </span>
                            )}
                            {job.salary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                          <DollarSign className="w-3 h-3" />
                          {job.salary}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge ${getStatusStyle(job.status)}`}>
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            查看详情
                  </button>
                    <button 
                      onClick={() => {
                        window.location.href = 'http://localhost:3000/dashboard';
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
                    >
                      跟踪申请
                    </button>
                    {job.sourceUrl && (
                      <a 
                        href={job.sourceUrl}
                                target="_blank" 
                                rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        原始链接
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* 分页控件 */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-4">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span>第 {page} 页</span>
              <span className="mx-2">·</span>
              <span>每页 {limit} 条</span>
              {pagination && (
                <>
                  <span className="mx-2">·</span>
                  <span>共 {pagination.total} 条</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${page === 1 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <ChevronLeft className="w-5 h-5" />
                上一页
              </button>
              {pagination && (
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${pageNum === page
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={pagination ? page >= pagination.pages : jobs.length < limit}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${pagination && page >= pagination.pages
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                下一页
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default JobsPage; 