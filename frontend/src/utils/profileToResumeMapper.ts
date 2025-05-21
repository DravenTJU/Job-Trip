import { UserProfile } from '@/types/profile';
import { formatDateForInput } from '@/utils/dateUtils';
import i18next from 'i18next';

/**
 * 将用户档案数据映射到简历表单数据
 * @param profile 用户档案
 * @returns 简历表单所需的映射数据
 */
export const mapProfileToResume = (profile: UserProfile) => {
  // 个人信息映射
  const personalInfo = {
    fullName: profile.firstName && profile.lastName 
      ? `${profile.firstName} ${profile.lastName}` 
      : profile.firstName || profile.lastName || '',
    email: profile.contactInfo?.email || '',
    phone: profile.contactInfo?.phone || '',
    location: profile.contactInfo?.address || ''
  };

  // 教育背景映射
  const educations = profile.educations?.map(edu => ({
    education: edu.degree || '',
    school: edu.institution || '',
    major: edu.field || '',
    startDate: formatDateForInput(edu.startDate),
    endDate: formatDateForInput(edu.endDate)
  })) || [];

  // 如果没有教育经历，添加一个空记录
  if (educations.length === 0) {
    educations.push({
      education: '',
      school: '',
      major: '',
      startDate: '',
      endDate: ''
    });
  }

  // 工作经历映射
  const workExperiences = profile.workExperiences?.map(work => ({
    company: work.company || '',
    position: work.position || '',
    startDate: formatDateForInput(work.startDate),
    endDate: work.current ? '' : formatDateForInput(work.endDate),
    responsibilities: work.description || (work.achievements ? work.achievements.join('\n') : '')
  })) || [];

  // 如果没有工作经历，添加一个空记录
  if (workExperiences.length === 0) {
    workExperiences.push({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: ''
    });
  }

  // 技能映射
  const skillsText = profile.skills?.map(skill => {
    const levelText = {
      'beginner': i18next.t('profile:skill_level_beginner', '入门'),
      'intermediate': i18next.t('profile:skill_level_intermediate', '中级'),
      'advanced': i18next.t('profile:skill_level_advanced', '高级'),
      'expert': i18next.t('profile:skill_level_expert', '专家')
    }[skill.level] || '';
    
    return `• ${skill.name}${levelText ? ` (${levelText})` : ''}`;
  }).join('\n') || '';

  return {
    personalInfo,
    educations,
    workExperiences,
    skillsText
  };
}; 