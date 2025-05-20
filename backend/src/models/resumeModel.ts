import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

// 简历类型枚举
export enum ResumeType {
  BASE = '基础简历',
  TAILORED = '定制简历'
}

// 简历文档接口
export interface IResume extends Document {
  name: string;
  user: mongoose.Types.ObjectId | IUser;
  content: string;
  type: ResumeType;
  targetPosition?: string;
  targetJob?: string;
  tailored: boolean;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 简历模式
const resumeSchema = new Schema<IResume>(
  {
    name: {
      type: String,
      required: [true, '简历名称是必填项'],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '用户ID是必填项'],
    },
    content: {
      type: String,
      required: [true, '简历内容是必填项'],
    },
    type: {
      type: String,
      enum: Object.values(ResumeType),
      default: ResumeType.BASE,
    },
    targetPosition: {
      type: String,
      trim: true,
    },
    targetJob: {
      type: String,
      trim: true,
    },
    tailored: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: 'https://placehold.co/120x160?text=简历',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 创建模型
const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export default Resume;