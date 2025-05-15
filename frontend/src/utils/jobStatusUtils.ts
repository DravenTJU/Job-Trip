import { JobStatus } from '@/types';
import i18next from 'i18next';

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
            return 'badge-purple';
      case JobStatus.PENDING:
        return 'badge-pending';
      case JobStatus.APPLIED:
        return 'badge-info';
      case JobStatus.INTERVIEWING:
        return 'badge-warning';
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
    case JobStatus.NOT_INTERESTED:
      return '#a855f7'; // purple-500
    default:
      return '#6b7280'; // gray-500
  }
}; 