import React, { useState, useEffect } from 'react';
import { DndProvider, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BriefcaseIcon, Search, BellIcon, CalendarIcon, Plus, X, TrendingUpIcon, AwardIcon } from 'lucide-react';
import DroppableColumn, { Interview } from '@/components/dashboard/DroppableColumn';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUserJobs, updateUserJob, fetchStatusStats } from '@/redux/slices/userJobsSlice';
import { JobStatus, UserJob } from '@/types';

// 接口以适配DroppableColumn和DraggableJobCard组件
interface DashboardJob {
  id: string;
  title: string;
  company: string;
  type: string;
  salary: string;
  nextInterview?: string;
  offerDate?: string;
  originalData: UserJob; // 存储原始数据，用于更新
}

// 类型安全的状态映射
type JobStateMap = {
  [key in JobStatus]: DashboardJob[];
};

// 自定义拖拽层组件
const CustomDragLayer: React.FC = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: currentOffset.x,
          top: currentOffset.y,
          transform: 'rotate(-2deg)',
          opacity: 0.8
        }}
        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-4 w-[300px]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {item.type}
            </span>
            <span className="text-gray-700 dark:text-gray-300">{item.salary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 仪表盘页面组件
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation(['dashboard', 'common']) as { t: (key: string, defaultValue?: string) => string };
  const [searchQuery, setSearchQuery] = useState('');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  
  // Redux状态
  const { userJobs, isLoading, error, stats } = useSelector((state: RootState) => state.userJobs);
  
  // 本地状态用于分类的职位列表
  const [jobs, setJobs] = useState<JobStateMap>({
    [JobStatus.NEW]: [],
    [JobStatus.NOT_INTERESTED]: [],
    [JobStatus.PENDING]: [],
    [JobStatus.APPLIED]: [],
    [JobStatus.INTERVIEWING]: [],
    [JobStatus.OFFER]: [],
    [JobStatus.REJECTED]: [],
    [JobStatus.WITHDRAWN]: [],
    [JobStatus.CLOSED]: []
  });

  // 添加待处理任务状态
  const [todos, setTodos] = useState<Array<{id: string; jobId: string; task: string; completed: boolean}>>([]);

  // 加载用户职位数据
  useEffect(() => {
    dispatch(fetchUserJobs({}));
    dispatch(fetchStatusStats());
  }, [dispatch]);

  // 将API数据转换为本地格式
  useEffect(() => {
    if (userJobs.length > 0) {
      const newJobs: JobStateMap = {
        [JobStatus.NEW]: [],
        [JobStatus.NOT_INTERESTED]: [],
        [JobStatus.PENDING]: [],
        [JobStatus.APPLIED]: [],
        [JobStatus.INTERVIEWING]: [],
        [JobStatus.OFFER]: [],
        [JobStatus.REJECTED]: [],
        [JobStatus.WITHDRAWN]: [],
        [JobStatus.CLOSED]: []
      };
      
      // 处理面试列表
      const newInterviews: Interview[] = [];
      
      // 处理任务列表
      const newTodos: Array<{id: string; jobId: string; task: string; completed: boolean}> = [];
      
      userJobs.forEach(userJob => {
        // 确保job存在
        if (!userJob.jobId) {
          console.log(`缺少job数据, userJobId: ${userJob._id}`);
          return;
        }
        
        const job = userJob.jobId;
        
        // 根据职位状态分类
        const dashboardJob: DashboardJob = {
          id: userJob._id,
          title: job.title,
          company: typeof job.company === 'string' ? job.company : job.company.name,
          type: job.jobType || '',
          salary: job.salary || '',
          originalData: userJob
        };
        
        // 根据状态分配到相应的列表
        if (userJob.status in newJobs) {
          newJobs[userJob.status].push(dashboardJob);
        } else {
          // 默认放入待申请列表
          console.log('职位状态未匹配，放入待申请列表', userJob.status);
          newJobs[JobStatus.NEW].push(dashboardJob);
        }
        
        // 如果状态是面试中，且有面试日期，添加到面试列表
        if (userJob.status === JobStatus.INTERVIEWING && userJob.interviewDates && userJob.interviewDates.length > 0) {
          userJob.interviewDates.forEach((date, index) => {
            newInterviews.push({
              id: `${userJob._id}_${index}`,
              jobId: userJob._id,
              company: dashboardJob.company,
              position: job.title,
              time: new Date(date).toLocaleString(),
              duration: '待安排',
              round: `第${index + 1}轮面试`,
              status: 'confirmed'
            });
          });
        }
        
        // 处理任务列表
        if (userJob.nextSteps && userJob.nextSteps.length > 0) {
          userJob.nextSteps.forEach((task, index) => {
            newTodos.push({
              id: `${userJob._id}_task_${index}`,
              jobId: userJob._id,
              task,
              completed: false // 在后端存储中，只保存未完成的任务
            });
          });
        }
      });
      
      setJobs(newJobs);
      setInterviews(newInterviews);
      setTodos(newTodos);
    }
  }, [userJobs]);

  // 添加任务处理函数
  const addTodoForJob = async (jobId: string, task: string) => {
    // 找到对应的职位
    const jobsArray = Object.values(jobs).flat();
    const job = jobsArray.find(j => j.id === jobId);
    
    if (!job) return;
    
    const newTodo = {
      id: `todo_${Date.now()}`,
      jobId,
      task,
      completed: false
    };
    
    // 添加到本地状态
    setTodos(prev => [...prev, newTodo]);
    
    try {
      // 获取当前任务列表
      const currentTasks = job.originalData.nextSteps || [];
      // 添加新任务
      const updatedTasks = [...currentTasks, task];
      
      // 更新到后端
      await dispatch(updateUserJob({
        id: jobId,
        data: { nextSteps: updatedTasks }
      }));
    } catch (error) {
      console.error('添加任务失败:', error);
      // 如果后端失败，从本地状态中移除
      setTodos(prev => prev.filter(todo => todo.id !== newTodo.id));
    }
  };

  const toggleTodoStatus = async (todoId: string) => {
    // 获取要切换状态的任务
    const todoToToggle = todos.find(todo => todo.id === todoId);
    if (!todoToToggle) return;
    
    // 找到对应的职位
    const jobsArray = Object.values(jobs).flat();
    const job = jobsArray.find(j => j.id === todoToToggle.jobId);
    if (!job) return;

    // 乐观更新本地状态
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
    
    // 由于nextSteps字段只存储任务文本而不存储完成状态，
    // 这里我们可以选择将已完成的任务从nextSteps中移除
    if (!todoToToggle.completed) {
      try {
        // 获取当前任务列表
        const currentTasks = job.originalData.nextSteps || [];
        // 从列表中删除该任务
        const updatedTasks = currentTasks.filter(task => task !== todoToToggle.task);
        
        // 更新到后端
        await dispatch(updateUserJob({
          id: todoToToggle.jobId,
          data: { nextSteps: updatedTasks }
        }));
      } catch (error) {
        console.error('更新任务状态失败:', error);
        // 如果失败，回滚本地状态
        setTodos(prev => prev.map(todo => 
          todo.id === todoId ? { ...todo, completed: todoToToggle.completed } : todo
        ));
      }
    }
  };

  const deleteTodo = async (todoId: string) => {
    // 获取要删除的任务
    const todoToDelete = todos.find(todo => todo.id === todoId);
    if (!todoToDelete) return;
    
    // 找到对应的职位
    const jobsArray = Object.values(jobs).flat();
    const job = jobsArray.find(j => j.id === todoToDelete.jobId);
    if (!job) return;
    
    // 乐观更新本地状态
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
    
    try {
      // 获取当前任务列表
      const currentTasks = job.originalData.nextSteps || [];
      // 从列表中删除该任务
      const updatedTasks = currentTasks.filter(task => task !== todoToDelete.task);
      
      // 更新到后端
      await dispatch(updateUserJob({
        id: todoToDelete.jobId,
        data: { nextSteps: updatedTasks }
      }));
    } catch (error) {
      console.error('删除任务失败:', error);
      // 如果失败，回滚本地状态
      setTodos(prev => [...prev, todoToDelete]);
    }
  };

  // 总申请数
  const totalApplications = [JobStatus.PENDING, JobStatus.APPLIED, JobStatus.INTERVIEWING, JobStatus.OFFER].reduce((sum, status) => sum + jobs[status].length, 0);

  // 计算面试转化率
  const calculateInterviewRate = () => {
    if (totalApplications === 0) return '0%';
    
    const interviewingCount = jobs[JobStatus.INTERVIEWING].length + jobs[JobStatus.OFFER].length;
    const rate = Math.round((interviewingCount / totalApplications) * 100);
    return `${rate}%`;
  };

  // 计算录用率
  const calculateHireRate = () => {
    if (totalApplications === 0) return '0%';
    
    const hiredCount = jobs[JobStatus.OFFER].length;
    const rate = Math.round((hiredCount / totalApplications) * 100);
    return `${rate}%`;
  };

  // 处理拖拽（更新职位状态）
  const handleDrop = async (status: JobStatus, item: DashboardJob) => {
    // 找到当前拖动的职位所在的状态
    let sourceStatus: JobStatus | undefined;
    for (const [key, jobList] of Object.entries(jobs)) {
      if (jobList.some(job => job.id === item.id)) {
        sourceStatus = key as JobStatus;
        break;
      }
    }

    // 如果没找到源状态或者是拖到相同的状态，不做任何改变
    if (!sourceStatus || sourceStatus === status) {
      return;
    }

    // 创建要移动的职位的副本
    const jobToMove = {
      ...item,
      // 更新额外信息
      nextInterview: status === JobStatus.INTERVIEWING ? '待安排面试时间' : undefined,
      offerDate: status === JobStatus.OFFER ? new Date().toISOString().split('T')[0] : item.offerDate
    };

    // 乐观更新本地状态
    const newJobs = {
      ...jobs,
      [sourceStatus]: jobs[sourceStatus].filter(job => job.id !== item.id),
      [status]: [...jobs[status], jobToMove]
    };
    setJobs(newJobs);

    // 调用API更新职位状态
    try {
      await dispatch(updateUserJob({
        id: item.id,
        data: { status }
      }));
      
      // 处理面试相关的逻辑
      if (status === JobStatus.INTERVIEWING) {
        // 检查是否已经存在这个职位的面试记录
        const existingInterviewIndex = interviews.findIndex(interview => interview.jobId === item.id);
        
        if (existingInterviewIndex === -1) {
          // 如果不存在面试记录，创建新的
          const newInterview: Interview = {
            id: Date.now().toString(),
            jobId: item.id,
            company: item.company,
            position: item.title,
            time: '待安排',
            duration: '待安排',
            round: '初始面试',
            status: 'confirmed'
          };
          setInterviews(prev => [...prev, newInterview]);
        } else {
          // 如果存在面试记录，重新启用它
          setInterviews(prev => prev.map((interview, index) => 
            index === existingInterviewIndex
              ? { ...interview, status: 'confirmed' }
              : interview
          ));
        }
      } else if (sourceStatus === JobStatus.INTERVIEWING) {
        // 如果从面试中状态移出，标记面试记录为待确认而不是删除
        setInterviews(prev => prev.map(interview => 
          interview.jobId === item.id
            ? { ...interview, status: 'pending' }
            : interview
        ));
      }
    } catch (error) {
      console.error('更新职位状态失败:', error);
      // 恢复原状态
      setJobs(jobs);
    }
  };

  // 添加处理状态切换的函数
  const toggleInterviewStatus = (interviewId: string) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === interviewId
        ? { ...interview, status: interview.status === 'confirmed' ? 'pending' : 'confirmed' }
        : interview
    ));
  };

  const handleEdit = (job: DashboardJob) => {
    navigate(`/jobs/${job.originalData.jobId._id}`);
  };

  const handleAddJob = () => {
    navigate('/jobs/new');
  };

  const handleDelete = async (jobId: string) => {
    // 实际应用中可能需要调用API删除职位
    // 目前仅做本地状态更新示例
    const newJobs = { ...jobs };
    for (const status of Object.values(JobStatus)) {
      newJobs[status] = jobs[status].filter(job => job.id !== jobId);
    }
    setJobs(newJobs);
  };

  // 添加搜索过滤函数
  const filterJobs = (jobList: DashboardJob[]) => {
    if (!searchQuery.trim()) return jobList;
    
    const query = searchQuery.toLowerCase();
    return jobList.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.type.toLowerCase().includes(query) ||
      job.salary.toLowerCase().includes(query)
    );
  };

  // 添加删除面试的处理函数
  const handleDeleteInterview = (interviewId: string) => {
    setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
  };

  // 添加面试日期并保存到后端
  const handleAddInterviewDate = async (jobId: string, date: string) => {
    // 找到对应的职位
    const jobsArray = Object.values(jobs).flat();
    const job = jobsArray.find(j => j.id === jobId);
    
    if (!job) return;
    
    try {
      // 获取当前面试日期
      const currentDates = job.originalData.interviewDates || [];
      // 添加新日期
      const updatedDates = [...currentDates, date];
      
      // 更新到后端
      await dispatch(updateUserJob({
        id: jobId,
        data: { 
          interviewDates: updatedDates,
          // 如果不是面试状态，更新为面试状态
          status: JobStatus.INTERVIEWING 
        }
      }));
      
      // 添加到本地面试列表
      const newInterview: Interview = {
        id: `${jobId}_${updatedDates.length - 1}`,
        jobId,
        company: job.company,
        position: job.title,
        time: new Date(date).toLocaleString(),
        duration: '待安排',
        round: `第${updatedDates.length}轮面试`,
        status: 'confirmed'
      };
      
      setInterviews(prev => [...prev, newInterview]);
      
      // 如果作业不在面试中状态，将其移动到面试中列表
      if (job.originalData.status !== JobStatus.INTERVIEWING) {
        handleDrop(JobStatus.INTERVIEWING, job);
      }
    } catch (error) {
      console.error('添加面试日期失败:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className="container-lg">
        <div className="section">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('dashboard:job_tracking', '职位追踪')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('dashboard:job_tracking_description', '跟踪每个职位的申请状态和进度')}
          </p>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400 mb-6">
            {error}
          </div>
        )}
        
        {/* 统计卡片 - 5个卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-4">
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-xl">
                <BriefcaseIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {totalApplications}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard:total_applications', '总申请数')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl">
                <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {jobs[JobStatus.INTERVIEWING].length}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard:interviews_count', '进行中的面试')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-4">
            <div className="flex items-center">
              <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-xl">
                <BellIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {todos.filter(todo => !todo.completed).length}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard:pending_tasks', '待处理任务')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-4">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-xl">
                <TrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {calculateInterviewRate()}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard:interview_conversion_rate', '面试转化率')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-4">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-xl">
                <AwardIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {calculateHireRate()}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard:hire_rate', '录用率')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full h-11 pl-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder={t('dashboard:search_jobs', '搜索职位...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleAddJob}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
            >
              <Plus className="h-5 w-5" />
              {t('dashboard:add_job_manually', '手动添加职位')}
            </button>
          </div>
        </div>
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {/* 看板视图 - 4栏布局 */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DroppableColumn
              title={t('dashboard:to_apply', '待申请')}
              count={filterJobs(jobs[JobStatus.PENDING]).length}
              jobs={filterJobs(jobs[JobStatus.PENDING])}
              onDrop={(item) => handleDrop(JobStatus.PENDING, item as DashboardJob)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              todos={todos}
              onAddTodo={addTodoForJob}
              onToggleTodo={toggleTodoStatus}
              onDeleteTodo={deleteTodo}
            />
            <DroppableColumn
              title={t('dashboard:applied', '已申请')}
              count={filterJobs(jobs[JobStatus.APPLIED]).length}
              jobs={filterJobs(jobs[JobStatus.APPLIED])}
              onDrop={(item) => handleDrop(JobStatus.APPLIED, item as DashboardJob)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              todos={todos}
              onAddTodo={addTodoForJob}
              onToggleTodo={toggleTodoStatus}
              onDeleteTodo={deleteTodo}
            />
            <DroppableColumn
              title={t('dashboard:interviewing', '面试中')}
              count={filterJobs(jobs[JobStatus.INTERVIEWING]).length}
              jobs={filterJobs(jobs[JobStatus.INTERVIEWING])}
              onDrop={(item) => handleDrop(JobStatus.INTERVIEWING, item as DashboardJob)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              todos={todos}
              onAddTodo={addTodoForJob}
              onToggleTodo={toggleTodoStatus}
              onDeleteTodo={deleteTodo}
            />
            <DroppableColumn
              title={t('dashboard:hired', '已录用')}
              count={filterJobs(jobs[JobStatus.OFFER]).length}
              jobs={filterJobs(jobs[JobStatus.OFFER])}
              onDrop={(item) => handleDrop(JobStatus.OFFER, item as DashboardJob)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              todos={todos}
              onAddTodo={addTodoForJob}
              onToggleTodo={toggleTodoStatus}
              onDeleteTodo={deleteTodo}
            />
          </div>
        )}
        
        {/* 近期面试提醒 */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 mb-8">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('dashboard:recent_interviews', '近期面试安排')}</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-2.5 rounded-full">
                      <CalendarIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {interview.company} - {interview.position}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{interview.time}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{interview.round}</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <button
                      onClick={() => toggleInterviewStatus(interview.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                        interview.status === 'confirmed'
                          ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {interview.status === 'confirmed' ? t('dashboard:confirmed', '已确认') : t('dashboard:to_be_confirmed', '待确认')}
                    </button>
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {interviews.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t('dashboard:no_interviews', '暂无面试安排')}
                </p>
              )}
              
              {/* 添加面试按钮 */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => {
                    // 打开一个模态框或者跳转到添加面试的页面
                    const jobId = jobs[JobStatus.INTERVIEWING][0]?.id;
                    if (jobId) {
                      // 简单演示：添加当前日期作为面试日期
                      handleAddInterviewDate(jobId, new Date().toISOString());
                    }
                  }}
                  disabled={jobs[JobStatus.INTERVIEWING].length === 0}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    jobs[JobStatus.INTERVIEWING].length > 0
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/50'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  {t('dashboard:add_interview', '添加面试')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 待处理任务列表 */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 mb-8">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('dashboard:pending_tasks', '待处理任务')}</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {todos.map(todo => {
                const jobsArray = Object.values(jobs).flat();
                const job = jobsArray.find(j => j.id === todo.jobId);
                
                return (
                  <div key={todo.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoStatus(todo.id)}
                        className="rounded border-gray-300"
                      />
                      <div>
                        <p className={`text-sm ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                          {todo.task}
                        </p>
                        {job && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {job.company} - {job.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              {todos.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t('dashboard:no_pending_tasks', '暂无待处理任务')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default DashboardPage; 
