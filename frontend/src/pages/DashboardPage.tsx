import React, { useState } from 'react';
import { DndProvider, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BriefcaseIcon, Search, BellIcon, CalendarIcon, Plus, X, TrendingUpIcon, AwardIcon } from 'lucide-react';
import DroppableColumn, { Interview } from '@/components/dashboard/DroppableColumn';
import { useNavigate } from 'react-router-dom';

// 定义本地Job接口
interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  salary: string;
  nextInterview?: string;
  offerDate?: string; // 新增录用日期字段
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  
  const [jobs, setJobs] = useState<{
    pending: Job[];
    applied: Job[];
    interviewing: Job[];
    hired: Job[]; // 新增已录用状态
  }>({
    pending: [
      {
        id: '1',
        title: '高级前端工程师',
        company: '腾讯',
        type: '远程',
        salary: '¥30-45K/月',
      },
      {
        id: '2',
        title: '全栈开发工程师',
        company: '阿里巴巴',
        type: '混合办公',
        salary: '¥25-40K/月',
      },
      {
        id: '3',
        title: '产品经理',
        company: '字节跳动',
        type: '全职',
        salary: '¥35-50K/月',
      }
    ],
    applied: [],
    interviewing: [],
    hired: [] // 初始化为空数组
  });

  // 添加待处理任务状态
  const [todos, setTodos] = useState<Array<{id: string; jobId: string; task: string; completed: boolean}>>([]);

  // 添加任务处理函数
  const addTodoForJob = (jobId: string, task: string) => {
    setTodos(prev => [...prev, {
      id: `todo_${Date.now()}`,
      jobId,
      task,
      completed: false
    }]);
  };

  const toggleTodoStatus = (todoId: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (todoId: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  // 计算面试转化率
  const calculateInterviewRate = () => {
    const totalJobs = jobs.pending.length + jobs.applied.length + jobs.interviewing.length + jobs.hired.length;
    if (totalJobs === 0) return '0%';
    
    const interviewingCount = jobs.interviewing.length + jobs.hired.length;
    const rate = Math.round((interviewingCount / totalJobs) * 100);
    return `${rate}%`;
  };

  // 计算录用率
  const calculateHireRate = () => {
    const totalJobs = jobs.pending.length + jobs.applied.length + jobs.interviewing.length + jobs.hired.length;
    if (totalJobs === 0) return '0%';
    
    const hiredCount = jobs.hired.length;
    const rate = Math.round((hiredCount / totalJobs) * 100);
    return `${rate}%`;
  };

  const handleDrop = (status: 'pending' | 'applied' | 'interviewing' | 'hired', item: Job) => {
    // 找到当前拖动的职位所在的状态
    let sourceStatus: 'pending' | 'applied' | 'interviewing' | 'hired' | undefined;
    for (const [key, jobList] of Object.entries(jobs)) {
      if (jobList.some(job => job.id === item.id)) {
        sourceStatus = key as 'pending' | 'applied' | 'interviewing' | 'hired';
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
      nextInterview: status === 'interviewing' ? '待安排面试时间' : undefined,
      // 如果状态变为hired，添加当前日期作为录用日期
      offerDate: status === 'hired' ? new Date().toISOString().split('T')[0] : item.offerDate
    };

    // 更新状态
    const newJobs = {
      pending: [...jobs.pending],
      applied: [...jobs.applied],
      interviewing: [...jobs.interviewing],
      hired: [...jobs.hired]
    };

    // 从源状态中移除职位
    newJobs[sourceStatus] = newJobs[sourceStatus].filter(job => job.id !== item.id);

    // 添加到目标状态
    newJobs[status] = [...newJobs[status], jobToMove];

    // 处理面试相关的逻辑
    if (status === 'interviewing') {
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
    } else if (sourceStatus === 'interviewing') {
      // 如果从面试中状态移出，标记面试记录为待确认而不是删除
      setInterviews(prev => prev.map(interview => 
        interview.jobId === item.id
          ? { ...interview, status: 'pending' }
          : interview
      ));
    }

    // 更新状态
    setJobs(newJobs);

    // 打印调试信息
    console.log('Moving job:', {
      jobId: item.id,
      from: sourceStatus,
      to: status,
      newJobs
    });
  };

  // 添加处理状态切换的函数
  const toggleInterviewStatus = (interviewId: string) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === interviewId
        ? { ...interview, status: interview.status === 'confirmed' ? 'pending' : 'confirmed' }
        : interview
    ));
  };

  const handleEdit = (job: Job) => {
    navigate(`/jobs/edit/${job.id}`);
  };

  const handleAddJob = () => {
    navigate('/jobs/new');
  };

  const handleDelete = (jobId: string) => {
    const newJobs = { ...jobs };
    for (const status of ['pending', 'applied', 'interviewing', 'hired'] as const) {
      newJobs[status] = jobs[status].filter(job => job.id !== jobId);
    }
    setJobs(newJobs);
  };

  // 添加搜索过滤函数
  const filterJobs = (jobList: Job[]) => {
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

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className="container-lg px-4">
        <div className="section space-y-6 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">职位追踪</h1>
          <p className="text-gray-500 dark:text-gray-400">
            跟踪每个职位的申请状态和进度
          </p>
        </div>
        
        {/* 统计卡片 - 修改为5个卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-4">
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-xl">
                <BriefcaseIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {jobs.pending.length + jobs.applied.length + jobs.interviewing.length + jobs.hired.length}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">总申请数</p>
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
                  {jobs.interviewing.length}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">本周面试</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">待处理任务</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">面试转化率</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">录用率</p>
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
              placeholder="搜索职位..."
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
              手动添加职位
            </button>
          </div>
        </div>
        
        {/* 看板视图 - 修改为4栏布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DroppableColumn
            title="待申请"
            count={filterJobs(jobs.pending).length}
            jobs={filterJobs(jobs.pending)}
            onDrop={(item) => handleDrop('pending', item as Job)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            todos={todos}
            onAddTodo={addTodoForJob}
            onToggleTodo={toggleTodoStatus}
            onDeleteTodo={deleteTodo}
          />
          <DroppableColumn
            title="已申请"
            count={filterJobs(jobs.applied).length}
            jobs={filterJobs(jobs.applied)}
            onDrop={(item) => handleDrop('applied', item as Job)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            todos={todos}
            onAddTodo={addTodoForJob}
            onToggleTodo={toggleTodoStatus}
            onDeleteTodo={deleteTodo}
          />
          <DroppableColumn
            title="面试中"
            count={filterJobs(jobs.interviewing).length}
            jobs={filterJobs(jobs.interviewing)}
            onDrop={(item) => handleDrop('interviewing', item as Job)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            todos={todos}
            onAddTodo={addTodoForJob}
            onToggleTodo={toggleTodoStatus}
            onDeleteTodo={deleteTodo}
          />
          <DroppableColumn
            title="已录用"
            count={filterJobs(jobs.hired).length}
            jobs={filterJobs(jobs.hired)}
            onDrop={(item) => handleDrop('hired', item as Job)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            todos={todos}
            onAddTodo={addTodoForJob}
            onToggleTodo={toggleTodoStatus}
            onDeleteTodo={deleteTodo}
          />
        </div>
        
        {/* 近期面试提醒 */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 mb-8">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">近期面试安排</h2>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">{interview.duration}</p>
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
                      {interview.status === 'confirmed' ? '已确认' : '待确认'}
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
                  暂无面试安排
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 待处理任务列表 */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 mb-8">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">待处理任务</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {todos.map(todo => {
                const job = [...jobs.pending, ...jobs.applied, ...jobs.interviewing, ...jobs.hired]
                  .find(j => j.id === todo.jobId);
                
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
                  暂无待处理任务
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
