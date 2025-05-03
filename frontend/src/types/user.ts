// 教育经历
export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
}

// 工作经历
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
}

// 技能
export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years: number;
}

// 用户档案
export interface UserProfile {
  id: string;
  userId: string;
  introduction: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  skills: Skill[];
  resumeTemplate: string;
  createdAt: string;
  updatedAt: string;
} 