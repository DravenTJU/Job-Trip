import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { CalendarIcon, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Interview } from './DroppableColumn';

// 使用泛型，使组件能够接受不同的Job类型
type DraggableJobCardProps<T extends { id: string; title: string; company: string; type?: string; salary?: string }> = T & {
  interview?: Interview;
  onEdit?: (job: T) => void;
  onDelete?: (jobId: string) => void;
};

const DraggableJobCard = <T extends { id: string; title: string; company: string; type?: string; salary?: string }>(props: DraggableJobCardProps<T>) => {
  const { id, title, company, type, salary, interview, onEdit, onDelete } = props;
  const [showActions, setShowActions] = useState(false);

  const [{ isDragging }, drag] = useDrag<T, void, { isDragging: boolean }>({
    type: 'job',
    item: { ...props } as any,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag as any}
      className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200 p-4 cursor-move relative ${
        isDragging 
          ? 'opacity-40 shadow-none transform rotate-2 ring-indigo-500 dark:ring-indigo-400 scale-95' 
          : 'opacity-100'
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h4>
            <div className="text-base text-gray-500 dark:text-gray-400">{company}</div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-1 w-36 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-100/5 py-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(props);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  编辑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(id);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {type && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {type}
            </span>
          )}
          {salary && (
            <span className="text-base text-gray-700 dark:text-gray-300">{salary}</span>
          )}
        </div>
      </div>
      {interview && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className={`text-base ${
              interview.status === 'confirmed' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {interview.round} - {interview.time}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableJobCard; 
