// 基础类型定义
export interface BasicInfo {
  firstName: string;
  lastName: string;
  headline: string;
  biography: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    address: string;
    socialMedia: {
      linkedin: string;
      github: string;
      twitter: string;
      other: Array<{ name: string; url: string }>;
    };
  };
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string | Date;
  endDate: string | Date | null;
  description: string;
  location: string;
}

export interface WorkExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: string | Date;
  endDate: string | Date | null;
  current: boolean;
  description: string;
  location: string;
  achievements: string[];
}

export interface Skill {
  _id?: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  category: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string | Date;
  expirationDate: string | Date | null;
  credentialId: string;
  credentialUrl: string;
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date | null;
  url: string;
  technologies: string[];
}

export interface Language {
  _id?: string;
  language: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

export interface VolunteerExperience {
  _id?: string;
  organization: string;
  role: string;
  startDate: string | Date;
  endDate: string | Date | null;
  description: string;
}

export interface HonorAward {
  _id?: string;
  title: string;
  issuer: string;
  date: string | Date;
  description: string;
}

export interface Recommendation {
  _id?: string;
  recommenderName: string;
  recommenderTitle: string;
  relationship: string;
  content: string;
  date: string | Date;
}

// 完整的用户档案类型
export interface UserProfile {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;
  biography: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    address: string;
    socialMedia: {
      linkedin: string;
      github: string;
      twitter: string;
      other: Array<{ name: string; url: string }>;
    };
  };
  educations: Education[];
  workExperiences: WorkExperience[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  volunteerExperiences: VolunteerExperience[];
  honorsAwards: HonorAward[];
  recommendations: Recommendation[];
  profileCompleteness: number;
  lastUpdated: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// 部分类型用于状态管理
export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  profileNotFound: boolean;
  activeSection: string;
  editMode: boolean;
  currentEditItem: any | null;
} 