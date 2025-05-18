import api from './api';
import { UserProfile, Education, WorkExperience, Skill, Certification, Project, Language, VolunteerExperience, HonorAward, Recommendation } from '../types/profile';

const API_PATH = 'user-profiles';

// 获取当前用户的档案
const getUserProfile = async (): Promise<UserProfile> => {
  return api.get<UserProfile>(`${API_PATH}/me`);
};

// 创建用户档案
const createUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  return api.post<UserProfile>(`${API_PATH}/me`, profileData);
};

// 更新当前用户的档案
const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  return api.put<UserProfile>(`${API_PATH}/me`, profileData);
};

// 删除当前用户的档案
const deleteUserProfile = async (): Promise<any> => {
  return api.delete(`${API_PATH}/me`);
};

// 教育经历相关API
const addEducation = async (education: Education): Promise<Education> => {
  return api.post<Education>(`${API_PATH}/me/educations`, education);
};

const updateEducation = async (educationId: string, education: Education): Promise<Education> => {
  return api.put<Education>(`${API_PATH}/me/educations/${educationId}`, education);
};

const deleteEducation = async (educationId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/educations/${educationId}`);
};

// 工作经历相关API
const addWorkExperience = async (workExperience: WorkExperience): Promise<WorkExperience> => {
  return api.post<WorkExperience>(`${API_PATH}/me/work-experiences`, workExperience);
};

const updateWorkExperience = async (workExperienceId: string, workExperience: WorkExperience): Promise<WorkExperience> => {
  return api.put<WorkExperience>(`${API_PATH}/me/work-experiences/${workExperienceId}`, workExperience);
};

const deleteWorkExperience = async (workExperienceId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/work-experiences/${workExperienceId}`);
};

// 技能相关API
const addSkill = async (skill: Skill): Promise<Skill> => {
  return api.post<Skill>(`${API_PATH}/me/skills`, skill);
};

const updateSkill = async (skillId: string, skill: Skill): Promise<Skill> => {
  return api.put<Skill>(`${API_PATH}/me/skills/${skillId}`, skill);
};

const deleteSkill = async (skillId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/skills/${skillId}`);
};

// 证书相关API
const addCertification = async (certification: Certification): Promise<Certification> => {
  return api.post<Certification>(`${API_PATH}/me/certifications`, certification);
};

const updateCertification = async (certificationId: string, certification: Certification): Promise<Certification> => {
  return api.put<Certification>(`${API_PATH}/me/certifications/${certificationId}`, certification);
};

const deleteCertification = async (certificationId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/certifications/${certificationId}`);
};

// 项目经历相关API
const addProject = async (project: Project): Promise<Project> => {
  return api.post<Project>(`${API_PATH}/me/projects`, project);
};

const updateProject = async (projectId: string, project: Project): Promise<Project> => {
  return api.put<Project>(`${API_PATH}/me/projects/${projectId}`, project);
};

const deleteProject = async (projectId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/projects/${projectId}`);
};

// 语言能力相关API
const addLanguage = async (language: Language): Promise<Language> => {
  return api.post<Language>(`${API_PATH}/me/languages`, language);
};

const updateLanguage = async (languageId: string, language: Language): Promise<Language> => {
  return api.put<Language>(`${API_PATH}/me/languages/${languageId}`, language);
};

const deleteLanguage = async (languageId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/languages/${languageId}`);
};

// 志愿者经历相关API
const addVolunteerExperience = async (experience: VolunteerExperience): Promise<VolunteerExperience> => {
  return api.post<VolunteerExperience>(`${API_PATH}/me/volunteer-experiences`, experience);
};

const updateVolunteerExperience = async (experienceId: string, experience: VolunteerExperience): Promise<VolunteerExperience> => {
  return api.put<VolunteerExperience>(`${API_PATH}/me/volunteer-experiences/${experienceId}`, experience);
};

const deleteVolunteerExperience = async (experienceId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/volunteer-experiences/${experienceId}`);
};

// 荣誉奖项相关API
const addHonorAward = async (award: HonorAward): Promise<HonorAward> => {
  return api.post<HonorAward>(`${API_PATH}/me/honors-awards`, award);
};

const updateHonorAward = async (awardId: string, award: HonorAward): Promise<HonorAward> => {
  return api.put<HonorAward>(`${API_PATH}/me/honors-awards/${awardId}`, award);
};

const deleteHonorAward = async (awardId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/honors-awards/${awardId}`);
};

// 推荐信相关API
const addRecommendation = async (recommendation: Recommendation): Promise<Recommendation> => {
  return api.post<Recommendation>(`${API_PATH}/me/recommendations`, recommendation);
};

const updateRecommendation = async (recommendationId: string, recommendation: Recommendation): Promise<Recommendation> => {
  return api.put<Recommendation>(`${API_PATH}/me/recommendations/${recommendationId}`, recommendation);
};

const deleteRecommendation = async (recommendationId: string): Promise<any> => {
  return api.delete(`${API_PATH}/me/recommendations/${recommendationId}`);
};

// 计算用户档案完整度
const calculateProfileCompleteness = (profile: UserProfile): number => {
  if (!profile) return 0;

  const sections = [
    !!profile.headline || !!profile.biography, // 基本信息
    !!profile.contactInfo?.email || !!profile.contactInfo?.phone, // 联系方式
    profile.educations?.length > 0, // 教育经历
    profile.workExperiences?.length > 0, // 工作经历
    profile.skills?.length > 0, // 技能
    profile.certifications?.length > 0, // 证书
    profile.projects?.length > 0, // 项目经历
    profile.languages?.length > 0, // 语言能力
  ];

  const completedSections = sections.filter(Boolean).length;
  const totalSections = sections.length;
  
  // 确保最终值不超过100
  const calculatedValue = Math.round((completedSections / totalSections) * 100);
  return Math.min(calculatedValue, 100);
};

export default {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSkill,
  updateSkill,
  deleteSkill,
  addCertification,
  updateCertification,
  deleteCertification,
  addProject,
  updateProject,
  deleteProject,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addVolunteerExperience,
  updateVolunteerExperience,
  deleteVolunteerExperience,
  addHonorAward,
  updateHonorAward,
  deleteHonorAward,
  addRecommendation,
  updateRecommendation,
  deleteRecommendation,
  calculateProfileCompleteness
}; 