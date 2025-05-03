import mongoose, { Document, Schema } from 'mongoose';

// 教育经历接口
export interface IEducation extends Document {
  school: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate: Date;
  description: string;
  isCurrent: boolean;
}

// 工作经历接口
export interface IWorkExperience extends Document {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
  isCurrent: boolean;
}

// 技能接口
export interface ISkill extends Document {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years: number;
}

// 用户档案接口
export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  introduction: string;
  educations: IEducation[];
  workExperiences: IWorkExperience[];
  skills: ISkill[];
  resumeTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

// 教育经历模式
const educationSchema = new Schema<IEducation>({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  major: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  isCurrent: { type: Boolean, default: false },
});

// 工作经历模式
const workExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  isCurrent: { type: Boolean, default: false },
});

// 技能模式
const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true,
  },
  years: { type: Number, required: true },
});

// 用户档案模式
const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    introduction: { type: String },
    educations: [educationSchema],
    workExperiences: [workExperienceSchema],
    skills: [skillSchema],
    resumeTemplate: { type: String },
  },
  {
    timestamps: true,
  }
);

// 创建并导出模型
export const Profile = mongoose.model<IProfile>('Profile', profileSchema); 