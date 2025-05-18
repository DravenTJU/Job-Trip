import React from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import { CalendarIcon } from 'lucide-react';
import { Interview } from './DroppableColumn';

// 拖拽层样式
const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

// 获取拖拽项目的样式
function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

// 卡片预览组件
interface JobPreviewProps {
  title: string;
  company: string;
  type?: string;
  salary?: string;
  interview?: Interview;
}

const JobPreview: React.FC<JobPreviewProps> = ({ title, company, type, salary, interview }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-md ring-1 ring-gray-900/10 dark:ring-gray-100/10 p-4 w-72">
      <div className="flex flex-col gap-2">
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h4>
          <div className="text-base text-gray-500 dark:text-gray-400">{company}</div>
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

// 主要拖拽层组件
const JobDragLayer = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  // 仅在拖拽职位卡片时显示
  if (!isDragging || itemType !== 'job') {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <JobPreview 
          title={item.title}
          company={item.company}
          type={item.type}
          salary={item.salary}
          interview={item.interview}
        />
      </div>
    </div>
  );
};

export default JobDragLayer; 