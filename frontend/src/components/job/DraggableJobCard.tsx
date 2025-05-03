import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { CalendarIcon, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Job, Interview } from '../../types/job';

type DraggableJobCardProps = Job & {
  interview?: Interview;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
};

const DraggableJobCard: React.FC<DraggableJobCardProps> = ({
  id,
  title,
  company,
  type,
  salary,
  interview,
  onEdit,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);

  const [{ isDragging }, drag] = useDrag<Job, void, { isDragging: boolean }>({
    type: 'job',
    item: { id, title, company, type, salary },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag as any}
      className={`bg-white rounded-lg p-4 cursor-move border border-gray-100 relative ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-900">{title}</h4>
            <div className="text-base text-gray-500">{company}</div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.({ id, title, company, type, salary });
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
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
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
            {type}
          </span>
          <span className="text-base text-gray-900">{salary}</span>
        </div>
      </div>
      {interview && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className={`text-base ${
              interview.status === 'confirmed' 
                ? 'text-green-600' 
                : 'text-yellow-600'
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
