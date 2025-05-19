/**
 * 日期处理工具函数
 */

import { TFunction } from 'i18next';

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

/**
 * 格式化日期，支持相对时间或绝对时间
 * @param dateString 日期字符串
 * @param t i18n翻译函数
 * @param language 当前语言
 * @param useRelative 是否使用相对时间表示（如"3天前"）
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  dateString: string, 
  t: TFunction, 
  language: string,
  useRelative = false
): string => {
  const date = new Date(dateString);
  
  if (useRelative) {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('today', '今天');
    if (diffDays === 1) return t('yesterday', '昨天');
    if (diffDays < 7) return t('days_ago', '{{count}}天前', { count: diffDays });
    if (diffDays < 30) return t('weeks_ago', '{{count}}周前', { count: Math.floor(diffDays / 7) });
    if (diffDays < 365) return t('months_ago', '{{count}}个月前', { count: Math.floor(diffDays / 30) });
    return t('years_ago', '{{count}}年前', { count: Math.floor(diffDays / 365) });
  }
  
  return date.toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 格式化日期为简短格式（如：2023年6月1日）
 * @param dateString 日期字符串
 * @param language 当前语言
 * @returns 格式化后的日期字符串
 */
export const formatShortDate = (
  dateString: string,
  language: string
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}; 