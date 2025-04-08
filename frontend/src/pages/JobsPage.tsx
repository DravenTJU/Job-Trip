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
  SortAsc
} from 'lucide-react';

/**
 * 职位列表页面组件
 */
const JobsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { jobs, isLoading, error } = useSelector((state: RootState) => state.jobs);
  
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
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    <div className="container-lg">
      <div className="section">
        <h1 className="title-lg">职位列表</h1>
        <p className="text-description">
          查看和管理您的所有求职申请
        </p>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="section">
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索职位名称、公司或地点..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-input pl-10"
              />
            </div>
            <div>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="form-input"
              >
                <option value="-createdAt">最新添加</option>
                <option value="createdAt">最早添加</option>
                <option value="title">职位名称（A-Z）</option>
                <option value="-title">职位名称（Z-A）</option>
                <option value="company">公司名称（A-Z）</option>
                <option value="-company">公司名称（Z-A）</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {/* 职位列表 */}
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="loader"></div>
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="section">
          <div className="space-y-4">
            {jobs.map((job) => (
              <div 
                key={job._id}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="title-sm mb-1">
                        <a 
                          href={`/jobs/${job._id}`}
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {job.title}
                        </a>
                      </h3>
                      <p className="text-description">
                        {typeof job.company === 'string' ? job.company : job.company.name}
                        {job.location && <span> · {job.location}</span>}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.jobType && (
                          <span className="badge badge-primary">
                            {job.jobType}
                          </span>
                        )}
                        {job.salary && (
                          <span className="badge badge-success">
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="btn btn-outline btn-sm"
                      >
                        查看详情
                      </button>
                      <button 
                        onClick={() => {
                          window.location.href = 'http://localhost:3000/jobs/track';
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        跟踪申请
                      </button>
                      {job.sourceUrl && (
                        <a 
                          href={job.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4 mr-1.5" />
                          原始链接
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 分页控件 */}
          {jobs.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn btn-outline btn-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-gray-600 dark:text-gray-400">
                  第 {page} 页
                </span>
                <button 
                  onClick={() => setPage(page + 1)}
                  disabled={jobs.length < limit}
                  className="btn btn-outline btn-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="section">
          <div className="card p-6 text-center">
            <h3 className="title-sm mb-2">暂无职位数据</h3>
            <p className="text-description mb-4">
              您尚未添加任何职位申请。点击添加职位按钮开始追踪您的求职之旅。
            </p>
            <button 
              onClick={handleAddJob}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              添加职位
            </button>
          </div>
        </div>
      )}
      
      {/* 添加职位按钮 */}
      <div className="section">
        <button 
          onClick={handleAddJob}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          添加职位
        </button>
      </div>
    </div>
  );
};

export default JobsPage; 