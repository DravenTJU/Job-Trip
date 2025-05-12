import { JobStatus } from '@/types';

// 状态选项数组 - 用于下拉菜单
export const JOB_STATUS_OPTIONS = [
  { value: JobStatus.NEW, label: '新添加' },
  { value: JobStatus.NOT_INTERESTED, label: '不考虑' },
  { value: JobStatus.PENDING, label: '待申请' },
  { value: JobStatus.APPLIED, label: '已申请' },
  { value: JobStatus.INTERVIEWING, label: '面试中' },
  { value: JobStatus.OFFER, label: '已录用' },
  { value: JobStatus.REJECTED, label: '已拒绝' },
  { value: JobStatus.WITHDRAWN, label: '已撤回' },
  { value: JobStatus.CLOSED, label: '已关闭' }
];

/**
 * 获取状态标签
 * @param status 状态值
 * @returns 对应的显示标签
 */
export const getStatusLabel = (status: string): string => {
  const option = JOB_STATUS_OPTIONS.find(opt => opt.value === status);
  return option ? option.label : status;
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