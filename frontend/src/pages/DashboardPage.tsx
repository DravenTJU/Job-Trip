import React, { useState } from 'react';
import { DndProvider, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BriefcaseIcon, PlusCircle, Filter, Search, BellIcon, CalendarIcon, PieChartIcon, MoreHorizontal, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DroppableColumn from '@/components/job/DroppableColumn';

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
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-indigo-500 dark:border-indigo-400 w-[300px]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
              {item.type}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{item.salary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  salary: string;
  nextInterview?: string;
}

interface Interview {
  id: string;
  jobId: string;
  company: string;
  position: string;
  time: string;
  duration: string;
  round: string;
  status: 'confirmed' | 'pending';
}

interface EditModalProps {
  job: Job | null;
  onClose: () => void;
  onSave: (job: Job) => void;
}

const EditModal: React.FC<EditModalProps> = ({ job, onClose, onSave }) => {
  const [editedJob, setEditedJob] = useState(job || {
    id: '',
    title: '',
    company: '',
    type: '',
    salary: ''
  });

  // 添加薪资处理函数
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // 移除非数字字符
    value = value.replace(/[^0-9-]/g, '');
    
    // 如果输入不为空，添加"K/月"后缀
    if (value) {
      // 检查是否包含范围（使用-分隔）
      if (value.includes('-')) {
        const [min, max] = value.split('-');
        if (max) {
          value = `${min}-${max}K/月`;
        } else {
          value = `${min}-K/月`;
        }
      } else {
        value = `${value}K/月`;
      }
    }
    
    setEditedJob({ ...editedJob, salary: value });
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">编辑职位信息</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">职位名称</label>
            <input
              type="text"
              value={editedJob.title}
              onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司</label>
            <input
              type="text"
              value={editedJob.company}
              onChange={(e) => setEditedJob({ ...editedJob, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
            <input
              type="text"
              value={editedJob.type}
              onChange={(e) => setEditedJob({ ...editedJob, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">薪资</label>
            <input
              type="text"
              value={editedJob.salary}
              onChange={handleSalaryChange}
              placeholder="例如：15-20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={() => {
              onSave(editedJob);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 仪表盘页面组件
 */
const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  const [jobs, setJobs] = useState<{
    pending: Job[];
    applied: Job[];
    interviewing: Job[];
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
    const totalJobs = jobs.pending.length + jobs.applied.length + jobs.interviewing.length;
    if (totalJobs === 0) return '0%';
    
    const interviewingCount = jobs.interviewing.length;
    const rate = Math.round((interviewingCount / totalJobs) * 100);
    return `${rate}%`;
  };

  const handleDrop = (status: 'pending' | 'applied' | 'interviewing', item: Job) => {
    // 找到当前拖动的职位所在的状态
    let sourceStatus: 'pending' | 'applied' | 'interviewing' | undefined;
    for (const [key, jobList] of Object.entries(jobs)) {
      if (jobList.some(job => job.id === item.id)) {
        sourceStatus = key as 'pending' | 'applied' | 'interviewing';
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
      nextInterview: status === 'interviewing' ? '待安排面试时间' : undefined
    };

    // 更新状态
    const newJobs = {
      pending: [...jobs.pending],
      applied: [...jobs.applied],
      interviewing: [...jobs.interviewing]
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
    setEditingJob(job);
  };

  const handleDelete = (jobId: string) => {
    const newJobs = { ...jobs };
    for (const status of ['pending', 'applied', 'interviewing'] as const) {
      newJobs[status] = jobs[status].filter(job => job.id !== jobId);
    }
    setJobs(newJobs);
  };

  const handleSaveEdit = (editedJob: Job) => {
    const newJobs = { ...jobs };
    if (editedJob.id.startsWith('new_')) {
      // 如果是新增的职位，添加到待申请列表
      newJobs.pending = [...jobs.pending, { ...editedJob, id: `job_${Date.now()}` }];
    } else {
      // 如果是编辑现有职位
      for (const status of ['pending', 'applied', 'interviewing'] as const) {
        newJobs[status] = jobs[status].map(job => 
          job.id === editedJob.id ? editedJob : job
        );
      }
    }
    setJobs(newJobs);
    setEditingJob(null); // 关闭模态框
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
      <div className="container-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">职位追踪</h1>
          <p className="text-gray-600 dark:text-gray-300">
            跟踪每个职位的申请状态和进度
          </p>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
                <BriefcaseIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {jobs.pending.length + jobs.applied.length + jobs.interviewing.length}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">总申请数</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <PieChartIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {calculateInterviewRate()}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">面试转化率</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
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
        </div>
        
        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索职位..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setEditingJob({ id: `new_${Date.now()}`, title: '', company: '', type: '', salary: '' })}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <Plus className="mr-2 h-5 w-5" />
              添加职位
            </button>
          </div>
        </div>
        
        {/* 看板视图 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DroppableColumn
            title="待申请"
            count={filterJobs(jobs.pending).length}
            jobs={filterJobs(jobs.pending)}
            onDrop={(item) => handleDrop('pending', item)}
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
            onDrop={(item) => handleDrop('applied', item)}
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
            onDrop={(item) => handleDrop('interviewing', item)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            todos={todos}
            onAddTodo={addTodoForJob}
            onToggleTodo={toggleTodoStatus}
            onDeleteTodo={deleteTodo}
          />
        </div>
        
        {/* 近期面试提醒 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-medium text-gray-900 dark:text-white">近期面试安排</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-full">
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
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                        interview.status === 'confirmed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
            </div>
          </div>
        </div>

        {/* 待处理任务列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-medium text-gray-900 dark:text-white">待处理任务</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {todos.map(todo => {
                const job = [...jobs.pending, ...jobs.applied, ...jobs.interviewing]
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
                        <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {todo.task}
                        </p>
                        {job && (
                          <p className="text-xs text-gray-500">
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
                <p className="text-sm text-gray-500 text-center py-4">
                  暂无待处理任务
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {editingJob && (
        <EditModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveEdit}
        />
      )}
    </DndProvider>
  );
};

export default DashboardPage; 
