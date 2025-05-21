import mongoose, { Document, Schema } from 'mongoose';

// 职位接口
export interface IJob extends Document {
  platform: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  requirements?: string[];
  salary?: string;
  jobType?: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  deadline?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 工作类型枚举
export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  N_A = 'n-a',
}

// 职位模式
const jobSchema = new Schema<IJob>(
  {
    platform: {
      type: String,
      required: [true, '平台名称必填'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, '职位标题必填'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, '公司名称必填'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, '工作地点必填'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    requirements: [String],
    salary: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
      default: JobType.N_A,
    },
    source: {
      type: String,
      required: true,
      enum: ['linkedin', 'seek', 'indeed', 'manual', 'other'],
    },
    sourceId: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引
jobSchema.index({ sourceId: 1, platform: 1 }, { unique: true });
jobSchema.index({ company: 1 });
jobSchema.index({ title: 1 });
jobSchema.index({ createdAt: 1 });
jobSchema.index({ platform: 1 });

// 创建模型
const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job; 