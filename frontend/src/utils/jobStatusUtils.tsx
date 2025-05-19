import { JobStatus } from '@/types';
import i18next from 'i18next';
import React from 'react';
import * as LucideIcons from 'lucide-react';

// 状态选项数组 - 用于下拉菜单
export const JOB_STATUS_OPTIONS = [
  { value: JobStatus.NEW, label: 'status.new', icon: 'PlusCircle' },
  { value: JobStatus.NOT_INTERESTED, label: 'status.not_interested', icon: 'ThumbsDown' },
  { value: JobStatus.PENDING, label: 'status.pending', icon: 'Clock' },
  { value: JobStatus.APPLIED, label: 'status.applied', icon: 'Send' },
  { value: JobStatus.INTERVIEWING, label: 'status.interviewing', icon: 'Users' },
  { value: JobStatus.OFFER, label: 'status.offer', icon: 'Award' },
  { value: JobStatus.REJECTED, label: 'status.rejected', icon: 'XCircle' },
  { value: JobStatus.WITHDRAWN, label: 'status.withdrawn', icon: 'Undo' },
  { value: JobStatus.CLOSED, label: 'status.closed', icon: 'Archive' }
];

/**
 * 获取状态标签
 * @param status 状态值
 * @returns 对应的显示标签
 */
export const getStatusLabel = (status: string): string => {
  const option = JOB_STATUS_OPTIONS.find(opt => opt.value === status);
  if (!option) return status;
  
  // 使用翻译
  return i18next.t(`jobs:${option.label}`, option.label);
};

/**
 * 获取状态对应的图标名称
 * @param status 状态值
 * @returns 对应的Lucide图标名称
 */
export const getStatusIcon = (status: string): string => {
  const option = JOB_STATUS_OPTIONS.find(opt => opt.value === status);
  return option?.icon || 'HelpCircle';
};

/**
 * 获取状态样式
 * @param status 状态值
 * @returns 对应的CSS类名
 */
export const getStatusStyle = (status: string): string => {
  // 返回badge类名，用于JobDetailPage等
  switch (status) {
      case JobStatus.NEW:
        return 'badge-primary';
      case JobStatus.NOT_INTERESTED:
        return 'badge-default';
      case JobStatus.PENDING:
        return 'badge-pending';
      case JobStatus.APPLIED:
        return 'badge-info';
      case JobStatus.INTERVIEWING:
        return 'badge-purple';
      case JobStatus.OFFER:
        return 'badge-success';
      case JobStatus.REJECTED:
        return 'badge-error';
      case JobStatus.WITHDRAWN:
        return 'badge-default';
      case JobStatus.CLOSED:
        return 'badge-default';
      default:
        return 'badge-default';
  }
};

/**
 * 获取状态颜色值 - 用于图表等场景
 * @param status 状态值
 * @returns 对应的颜色十六进制值
 */
export const getStatusColorValue = (status: string): string => {
  switch (status) {
    case JobStatus.NEW:
      return '#3b82f6'; // blue-500
    case JobStatus.NOT_INTERESTED:
      return '#6b7280'; // gray-500
    case JobStatus.PENDING:
      return '#f97316'; // orange-500
    case JobStatus.APPLIED:
      return '#6366f1'; // indigo-500
    case JobStatus.INTERVIEWING:
      return '#eab308'; // yellow-500
    case JobStatus.OFFER:
      return '#22c55e'; // green-500
    case JobStatus.REJECTED:
      return '#ef4444'; // red-500
    case JobStatus.WITHDRAWN:
      return '#6b7280'; // gray-500
    case JobStatus.CLOSED:
      return '#6b7280'; // gray-500
    default:
      return '#6b7280'; // gray-500
  }
};

/**
 * 获取状态图标组件
 * @param iconName Lucide图标名称
 * @param size 图标大小类名（可选）
 * @returns 对应的React图标组件
 */
export const getStatusIconComponent = (iconName: string, size: string = "w-4 h-4"): React.ReactNode => {
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
  return <Icon className={size} />;
};

/**
 * 渲染状态图标容器
 * @param iconName 图标名称
 * @param size 图标尺寸类名
 * @returns 带样式的图标容器
 */
export const renderStatusIconContainer = (
  iconName: string, 
  size: string = "w-4 h-4"
): React.ReactNode => {
  return (
    <span className="flex items-center justify-center rounded-full bg-white/20 mr-1.5">
      {getStatusIconComponent(iconName, size)}
    </span>
  );
};

/**
 * 渲染完整的状态徽章
 * @param status 状态值
 * @param options 配置选项
 * @returns 状态徽章JSX元素
 */
export const renderStatusBadge = (
  status: string, 
  options: {
    size?: 'sm' | 'md',
    className?: string,
    showLabel?: boolean,
    iconOnly?: boolean
  } = {}
): React.ReactNode => {
  const { 
    size = 'md', 
    className = '', 
    showLabel = true,
    iconOnly = false
  } = options;
  
  // 获取样式和图标
  const badgeStyle = getStatusStyle(status);
  const iconName = getStatusIcon(status);
  
  // 根据尺寸设置padding和字体大小
  const sizeClasses = size === 'sm' 
    ? 'pl-1 pr-2 py-0.5 text-xs' 
    : 'pl-1 pr-3 py-1 text-sm';
  
  // 根据iconOnly设置宽度和对齐方式
  const layoutClasses = iconOnly 
    ? 'justify-center' 
    : '';
  
  return (
    <span className={`inline-flex items-center rounded-full ${badgeStyle} ${sizeClasses} ${layoutClasses} ${className}`}>
      <span className={`flex items-center justify-center ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} rounded-full bg-white/20 ${showLabel ? 'mr-1.5' : ''}`}>
        {getStatusIconComponent(iconName, size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')}
      </span>
      {showLabel && <span className="truncate font-medium">{getStatusLabel(status)}</span>}
    </span>
  );
};

/**
 * 状态徽章组件 - 可直接作为React组件使用
 */
interface StatusBadgeComponentProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
  showLabel?: boolean;
  iconOnly?: boolean;
}

export const StatusBadgeComponent: React.FC<StatusBadgeComponentProps> = ({
  status,
  size = 'md',
  className = '',
  showLabel = true,
  iconOnly = false
}) => {
  return renderStatusBadge(status, { size, className, showLabel, iconOnly });
}; 