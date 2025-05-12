import mongoose, { Document, Schema } from 'mongoose';

// 应用历史接口
export interface IApplicationHistory extends Document {
  userJobId: mongoose.Types.ObjectId;
  previousStatus: string;
  newStatus: string;
  notes?: string;
  createdAt: Date;
  updatedBy: mongoose.Types.ObjectId;
}

// 应用历史模式
const applicationHistorySchema = new Schema<IApplicationHistory>(
  {
    userJobId: {
      type: Schema.Types.ObjectId,
      ref: 'UserJob',
      required: true,
    },
    previousStatus: {
      type: String,
      required: true,
    },
    newStatus: {
      type: String,
      required: true,
    },
    notes: String,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引
applicationHistorySchema.index({ userJobId: 1 });
applicationHistorySchema.index({ createdAt: 1 });

// 创建模型
const ApplicationHistory = mongoose.model<IApplicationHistory>(
  'ApplicationHistory',
  applicationHistorySchema,
  'application_history'
);

export default ApplicationHistory; 