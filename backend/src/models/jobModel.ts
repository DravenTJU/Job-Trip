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
  status: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  appliedDate?: Date;
  deadline?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 职位状态枚举
export enum JobStatus {
  NEW = 'new',
  APPLIED = 'applied',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  CLOSED = 'closed',
}

// 工作类型枚举
export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
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
      default: JobType.FULL_TIME,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.NEW,
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
      required: true,
    },
    appliedDate: Date,
    deadline: Date,
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
jobSchema.index({ status: 1 });
jobSchema.index({ platform: 1 });

// 创建模型
const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job; 