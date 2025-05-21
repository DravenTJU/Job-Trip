import { JobType } from '@/types';

/**
 * 获取JobType在i18n中对应的翻译键
 * @param jobType JobType枚举值或字符串
 * @returns 对应的翻译键
 */
export const getJobTypeTranslationKey = (jobType: string | undefined): string => {
  if (!jobType) return '';
  
  // 根据JobType枚举的值返回对应的翻译键
  switch (jobType) {
    case JobType.FULL_TIME:
      return 'full_time';
    case JobType.PART_TIME:
      return 'part_time';
    case JobType.CONTRACT:
      return 'contract';
    case JobType.FREELANCE:
      return 'freelance';
    case JobType.INTERNSHIP:
      return 'internship';
    case JobType.N_A:
      return 'n_a';
    default:
      return jobType;
  }
};

/**
 * 获取JobType的图标
 * 可以在将来扩展此功能，为不同的JobType返回不同的图标
 */
// export const getJobTypeIcon = (jobType: string) => {
//   // 目前所有JobType使用相同的图标
//   return 'Briefcase';
// }; 