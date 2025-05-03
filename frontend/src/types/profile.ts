export interface IEducation {
  _id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent: boolean;
}

export interface IWorkExperience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent: boolean;
}

export interface ISkill {
  _id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years: number;
}

export interface IProfile {
  _id: string;
  userId: string;
  introduction: string;
  educations: IEducation[];
  workExperiences: IWorkExperience[];
  skills: ISkill[];
  resumeTemplate: string;
  createdAt: string;
  updatedAt: string;
} 