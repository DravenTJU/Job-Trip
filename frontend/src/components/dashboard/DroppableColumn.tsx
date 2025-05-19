import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
// 定义本地的Interview接口，而不是从types/job导入
import DraggableJobCard from './DraggableJobCard';
import { Plus, X } from 'lucide-react';

// 定义Interview接口
export interface Interview {
  id: string;
  jobId: string;
  company: string;
  position: string;
  time: string;
  duration: string;
  round: string;
  status: 'confirmed' | 'pending';
}

// 使用泛型定义组件，以便接受DashboardPage中的Job类型
interface DroppableColumnProps<T extends { id: string; title: string; company: string; type?: string; }> {
  title: React.ReactNode;
  count: number;
  jobs: T[];
  interviews?: Interview[];
  onDrop: (item: T) => void;
  onEdit?: (job: T) => void;
  onDelete?: (jobId: string) => void;
  todos?: Array<{id: string; jobId: string; task: string; completed: boolean}>;
  onAddTodo?: (jobId: string, task: string) => void;
  onToggleTodo?: (todoId: string) => void;
  onDeleteTodo?: (todoId: string) => void;
}

export const DroppableColumn = <T extends { id: string; title: string; company: string; type?: string; }>({
  title,
  count,
  jobs,
  interviews = [],
  onDrop,
  onEdit,
  onDelete,
  todos = [],
  onAddTodo,
  onToggleTodo,
  onDeleteTodo
}: DroppableColumnProps<T>) => {
  console.log(`[DroppableColumn "${title}"] Render. Jobs count: ${jobs.length}. Job IDs: ${jobs.map(j => j.id).join(', ')}`);
  const [{ isOver }, drop] = useDrop<T, void, { isOver: boolean }>({
    accept: 'job',
    drop: (item) => {
      console.log('Dropping job:', item);
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  // 添加新任务的状态
  const [newTaskJobId, setNewTaskJobId] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

  // 处理添加新任务
  const handleAddTask = (jobId: string) => {
    if (newTaskText.trim() && onAddTodo) {
      onAddTodo(jobId, newTaskText.trim());
      setNewTaskText('');
      setNewTaskJobId(null);
    }
  };

  return (
    <div
      ref={drop as any}
      className={`flex flex-col gap-4 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ${
        isOver 
          ? 'ring-indigo-500 dark:ring-indigo-400 border-2 border-indigo-500 dark:border-indigo-400 shadow-lg transform scale-[1.02] transition-all duration-200' 
          : 'ring-gray-900/5 dark:ring-gray-100/5 border-2 border-transparent transition-all duration-200'
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-medium ${isOver ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {title}
        </h3>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
          isOver 
            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {jobs.map((job) => {
          const interview = interviews?.find((i) => i.jobId === job.id);
          const jobTodos = todos.filter(todo => todo.jobId === job.id);
          
          return (
            <div key={job.id} className="space-y-2">
              <DraggableJobCard
                {...job as any}
                interview={interview}
                onEdit={onEdit}
                onDelete={onDelete}
              />
              
              {/* 任务列表 */}
              {jobTodos.length > 0 && (
                <div className="ml-4 space-y-1">
                  {jobTodos.map(todo => (
                    <div key={todo.id} className="flex items-center text-sm group">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggleTodo?.(todo.id)}
                        className="mr-2 rounded border-gray-300"
                      />
                      <span className={todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                        {todo.task}
                      </span>
                      <button
                        onClick={() => onDeleteTodo?.(todo.id)}
                        className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 添加任务输入框 */}
              {newTaskJobId === job.id ? (
                <div className="ml-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="输入任务内容..."
                    className="flex-1 text-sm h-9 px-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(job.id)}
                  />
                  <button
                    onClick={() => handleAddTask(job.id)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm"
                  >
                    添加
                  </button>
                  <button
                    onClick={() => {
                      setNewTaskJobId(null);
                      setNewTaskText('');
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setNewTaskJobId(job.id)}
                  className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  添加任务
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DroppableColumn; 