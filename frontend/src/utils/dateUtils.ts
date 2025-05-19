/**
 * 日期处理工具函数
 */

/**
 * 将日期值格式化为HTML日期输入控件(input type="date")所需的YYYY-MM-DD格式
 * @param dateValue 日期值，可以是Date对象、ISO日期字符串或null/undefined
 * @returns 格式化后的日期字符串(YYYY-MM-DD)，如果输入为空则返回空字符串
 */
export const formatDateForInput = (dateValue: string | Date | undefined | null): string => {
  if (!dateValue) return '';
  
  try {
    // 处理ISO日期字符串 (例如: 2015-09-01T00:00:00.000+00:00)
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD部分
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '';
  }
};

/**
 * 检查两个日期值是否在同一天
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 如果两个日期在同一天则返回true，否则返回false
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * 格式化日期为本地化显示格式
 * @param dateValue 日期值
 * @param locale 区域设置，默认为zh-CN
 * @returns 格式化后的日期字符串
 */
export const formatDateLocalized = (
  dateValue: string | Date | undefined | null,
  locale: string = 'zh-CN'
): string => {
  if (!dateValue) return '';
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('日期本地化格式化错误:', error);
    return '';
  }
}; 