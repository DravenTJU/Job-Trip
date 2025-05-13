import React, { useState, useRef, Fragment, useCallback } from 'react';
import { PencilLine, Check, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Transition } from '@headlessui/react';
import { createPortal } from 'react-dom';
import { JOB_STATUS_OPTIONS, getStatusStyle, getStatusIcon, getStatusLabel } from '@/utils/jobStatusUtils';
import jobStatusService from '@/services/jobStatusService';

interface StatusBadgeProps {
  jobId: string;
  status: string;
  size?: 'sm' | 'md';
  className?: string;
  onStatusChange?: (jobId: string, newStatus: string) => void;
}

/**
 * 职位状态标签组件 - 支持快速更新状态
 * 使用本地状态管理UI，与Redux解耦
 */
const StatusBadgeComponent: React.FC<StatusBadgeProps> = ({ 
  jobId,
  status: initialStatus, 
  size = 'md',
  className = '',
  onStatusChange
}) => {
  // 本地状态
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  
  // 处理点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          badgeRef.current && 
          !badgeRef.current.contains(event.target as Node) && 
          portalRef.current && 
          !portalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // 当外部status属性变化时，同步到本地状态
  React.useEffect(() => {
    if (initialStatus !== currentStatus && !isUpdating) {
      setCurrentStatus(initialStatus);
    }
  }, [initialStatus, currentStatus, isUpdating]);
  
  // 获取图标组件
  const getIconComponent = useCallback((iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
  }, [size]);
  
  // 处理状态变更 - 完全独立的状态更新，脱离Redux
  const handleStatusChange = useCallback(async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    
    // 立即更新UI
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setIsOpen(false);
    
    // 后台进行API调用
    setIsUpdating(true);
    setError(null);
    
    try {
      // 直接调用API，绕过Redux
      await jobStatusService.updateJobStatus(jobId, newStatus);
      
      // 可选：通知父组件状态已更改（但不依赖这个来更新UI）
      if (onStatusChange) {
        onStatusChange(jobId, newStatus);
      }
    } catch (error) {
      // 请求失败，回滚UI状态
      setCurrentStatus(previousStatus);
      setError('状态更新失败，请重试');
      console.error('更新状态失败:', error);
      
      // 3秒后自动清除错误信息
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  }, [currentStatus, jobId, onStatusChange]);
  
  // 状态标签大小样式
  const sizeClasses = size === 'sm' 
    ? 'gap-1 px-2.5 py-1 text-xs' 
    : 'gap-1.5 px-3 py-1.5 text-sm';
  
  // 悬停和交互效果
  const hoverClasses = 'hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-700 cursor-pointer transition-all duration-200';
  
  // 动画效果
  const animationClasses = isHovered ? 'transform scale-105 shadow-md' : '';
  
  // 更新时的视觉反馈
  const updatingClasses = isUpdating ? 'opacity-70' : '';
  
  return (
    <div className="relative inline-block">
      {/* 错误提示 */}
      {error && (
        <div className="absolute -top-12 left-0 right-0 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs p-2 rounded-lg shadow-md flex items-center justify-between z-[10000]">
          <span className="flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
            {error}
          </span>
        </div>
      )}
      
      <div
        ref={badgeRef}
        className={`inline-flex items-center rounded-full font-medium ${getStatusStyle(currentStatus)} ${sizeClasses} ${hoverClasses} ${animationClasses} ${updatingClasses} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        title={isUpdating ? "正在更新状态..." : "点击更改状态"}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center justify-center rounded-full bg-white/20 mr-1.5">
          {getIconComponent(getStatusIcon(currentStatus))}
          {isUpdating && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-full h-full rounded-full border-2 border-white/40 border-t-transparent animate-spin"></span>
            </span>
          )}
        </span>
        <span>{getStatusLabel(currentStatus)}</span>
        {isHovered && !isUpdating && (
          <PencilLine className={size === 'sm' ? 'w-3 h-3 ml-1' : 'w-3.5 h-3.5 ml-1.5'} />
        )}
      </div>
      
      {isOpen && createPortal(
        <Transition
          show={true}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div 
            ref={el => portalRef.current = el}
            className="fixed z-[9999] py-2 mt-1 overflow-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[300px]"
            style={{
              width: badgeRef.current ? Math.max(badgeRef.current.offsetWidth, 180) + 'px' : '180px',
              top: (badgeRef.current?.getBoundingClientRect().bottom || 0) + 4 + 'px',
              left: badgeRef.current?.getBoundingClientRect().left + 'px'
            }}
          >
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              选择新状态
            </div>
            {JOB_STATUS_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 flex items-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer ${
                  currentStatus === option.value ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''
                }`}
                onClick={() => handleStatusChange(option.value)}
              >
                <span className={`inline-flex items-center rounded-full pl-1 pr-2 py-0.5 mr-2 ${getStatusStyle(option.value)}`}>
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 mr-1">
                    {getIconComponent(option.icon)}
                  </span>
                  <span className="text-xs">{option.label}</span>
                </span>
                {currentStatus === option.value && (
                  <Check className="w-4 h-4 ml-auto text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            ))}
          </div>
        </Transition>,
        document.body
      )}
    </div>
  );
};

// 使用React.memo减少不必要的重渲染
const StatusBadge = React.memo(StatusBadgeComponent, (prevProps, nextProps) => {
  // 仅当关键props变化时才重新渲染
  return prevProps.jobId === nextProps.jobId && 
         prevProps.status === nextProps.status && 
         prevProps.size === nextProps.size;
});

export default StatusBadge; 