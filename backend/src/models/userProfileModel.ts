import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

// 用户档案接口
export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  firstName?: string;
  lastName?: string;
  headline?: string;
  biography?: string;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    socialMedia?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      other?: Array<{ name: string; url: string }>;
    };
  };
  educations?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    location?: string;
  }>;
  workExperiences?: Array<{
    company?: string;
    position?: string;
    startDate?: Date;
    endDate?: Date;
    current?: boolean;
    description?: string;
    location?: string;
    achievements?: string[];
  }>;
  skills?: Array<{
    name: string;
    level?: string;
    endorsements?: number;
    category?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    issueDate?: Date;
    expirationDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    url?: string;
    technologies?: string[];
  }>;
  languages?: Array<{
    language: string;
    proficiency?: string;
  }>;
  volunteerExperiences?: Array<{
    organization: string;
    role?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }>;
  honorsAwards?: Array<{
    title: string;
    issuer?: string;
    date?: Date;
    description?: string;
  }>;
  recommendations?: Array<{
    recommenderName: string;
    recommenderTitle?: string;
    relationship?: string;
    content: string;
    date?: Date;
  }>;
  profileCompleteness?: number;
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 社交媒体Schema
const socialMediaSchema = new Schema({
  linkedin: String,
  github: String,
  twitter: String,
  other: [{ name: String, url: String }]
});

// 联系信息Schema
const contactInfoSchema = new Schema({
  email: String,
  phone: String,
  website: String,
  address: String,
  socialMedia: socialMediaSchema
});

// 教育经历Schema
const educationSchema = new Schema({
  institution: String,
  degree: String,
  field: String,
  startDate: Date,
  endDate: Date,
  description: String,
  location: String
});

// 工作经历Schema
const workExperienceSchema = new Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  description: String,
  location: String,
  achievements: [String]
});

// 技能Schema
const skillSchema = new Schema({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  endorsements: { type: Number, default: 0 },
  category: String
});

// 证书Schema
const certificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: String,
  issueDate: Date,
  expirationDate: Date,
  credentialId: String,
  credentialUrl: String
});

// 项目经历Schema
const projectSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  url: String,
  technologies: [String]
});

// 语言能力Schema
const languageSchema = new Schema({
  language: { type: String, required: true },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'native'],
    default: 'beginner'
  }
});

// 志愿者经历Schema
const volunteerExperienceSchema = new Schema({
  organization: { type: String, required: true },
  role: String,
  startDate: Date,
  endDate: Date,
  description: String
});

// 荣誉与奖项Schema
const honorAwardSchema = new Schema({
  title: { type: String, required: true },
  issuer: String,
  date: Date,
  description: String
});

// 推荐信Schema
const recommendationSchema = new Schema({
  recommenderName: { type: String, required: true },
  recommenderTitle: String,
  relationship: String,
  content: { type: String, required: true },
  date: Date
});

// 用户档案Schema
const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '用户ID是必填项'],
      unique: true
    },
    firstName: String,
    lastName: String,
    headline: String,
    biography: String,
    contactInfo: {
      type: contactInfoSchema,
      default: {}
    },
    educations: [educationSchema],
    workExperiences: [workExperienceSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    projects: [projectSchema],
    languages: [languageSchema],
    volunteerExperiences: [volunteerExperienceSchema],
    honorsAwards: [honorAwardSchema],
    recommendations: [recommendationSchema],
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 索引
userProfileSchema.index({ userId: 1 }, { unique: true });
userProfileSchema.index({ 'skills.name': 1 });
userProfileSchema.index({ 'workExperiences.company': 1 });
userProfileSchema.index({ 'educations.institution': 1 });
userProfileSchema.index({ lastUpdated: 1 });
userProfileSchema.index({ createdAt: 1 });

// 计算档案完整度的方法
userProfileSchema.pre('save', function(next) {
  // 计算档案完整度的逻辑
  let completedSections = 0;
  let totalSections = 8; // 基本信息、联系信息、教育、工作、技能、证书、项目、语言

  // 基本信息
  if (this.headline || this.biography) completedSections++;
  
  // 联系信息
  if (this.contactInfo && (this.contactInfo.email || this.contactInfo.phone)) completedSections++;
  
  // 教育经历
  if (this.educations && this.educations.length > 0) completedSections++;
  
  // 工作经历
  if (this.workExperiences && this.workExperiences.length > 0) completedSections++;
  
  // 技能
  if (this.skills && this.skills.length > 0) completedSections++;
  
  // 证书
  if (this.certifications && this.certifications.length > 0) completedSections++;
  
  // 项目经历
  if (this.projects && this.projects.length > 0) completedSections++;
  
  // 语言能力
  if (this.languages && this.languages.length > 0) completedSections++;

  // 确保最终值不超过100
  const calculatedValue = Math.round((completedSections / totalSections) * 100);
  this.profileCompleteness = Math.min(calculatedValue, 100);
  
  this.lastUpdated = new Date();
  
  next();
});

// 创建模型
const UserProfile = mongoose.model<IUserProfile>('UserProfile', userProfileSchema, 'user_profiles');

export default UserProfile; 