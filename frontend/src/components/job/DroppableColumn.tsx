import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Job, Interview } from '../../types/job';
import DraggableJobCard from './DraggableJobCard';
import { Plus, X } from 'lucide-react';

interface DroppableColumnProps {
  title: string;
  count: number;
  jobs: Job[];
  interviews?: Interview[];
  onDrop: (item: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  todos?: Array<{id: string; jobId: string; task: string; completed: boolean}>;
  onAddTodo?: (jobId: string, task: string) => void;
  onToggleTodo?: (todoId: string) => void;
  onDeleteTodo?: (todoId: string) => void;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({
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
}) => {
  const [{ isOver }, drop] = useDrop<Job, void, { isOver: boolean }>({
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
      className={`flex flex-col gap-4 p-4 rounded-lg bg-gray-50 min-h-[200px] ${
        isOver ? 'border-2 border-blue-500' : 'border-2 border-transparent'
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {jobs.map((job) => {
          const interview = interviews?.find((i) => i.jobId === job.id);
          const jobTodos = todos.filter(todo => todo.jobId === job.id);
          
          return (
            <div key={job.id} className="space-y-2">
              <DraggableJobCard
                {...job}
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
                      <span className={todo.completed ? 'line-through text-gray-400' : ''}>
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
                    className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(job.id)}
                  />
                  <button
                    onClick={() => handleAddTask(job.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
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
                  className="ml-4 text-gray-500 hover:text-gray-700 text-sm flex items-center"
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