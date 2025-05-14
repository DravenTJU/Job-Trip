import mongoose, { Document, Schema } from 'mongoose';

// 用户-职位关联接口
export interface IUserJob extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: string;
  isFavorite: boolean;
  customTags?: string[];
  notes?: string;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 职位申请状态枚举
 * 定义用户对职位的申请状态
 */
export enum JobStatus {
  NEW = 'new',                      // 新发现的职位
  NOT_INTERESTED = 'not_interested', // 不感兴趣
  PENDING = 'pending',              // 待申请
  APPLIED = 'applied',              // 已申请
  INTERVIEWING = 'interviewing',    // 面试中
  OFFER = 'offer',                  // 已收到offer
  REJECTED = 'rejected',            // 已被拒绝
  WITHDRAWN = 'withdrawn',          // 已撤回申请
  CLOSED = 'closed',                // 已关闭
} 

// 用户-职位关联模式
const userJobSchema = new Schema<IUserJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.NEW,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    customTags: [String],
    notes: String,
    reminderDate: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 复合唯一索引，确保一个用户不会多次关联同一个职位
userJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
userJobSchema.index({ userId: 1, status: 1 });
userJobSchema.index({ userId: 1, isFavorite: 1 });
userJobSchema.index({ jobId: 1 });
userJobSchema.index({ createdAt: 1 });

// 创建模型
const UserJob = mongoose.model<IUserJob>('UserJob', userJobSchema, 'user_jobs');

export default UserJob; 