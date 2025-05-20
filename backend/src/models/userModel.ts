import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

// 用户偏好接口
export interface IUserPreferences {
  theme: string;
  notifications: boolean;
  language: string;
}

// 用户接口
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: IUserPreferences;
  status: string;
  
  // 方法
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): string;
}

// 用户模式
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, '用户名必填'],
      unique: true,
      trim: true,
      minlength: [3, '用户名最少3个字符'],
      maxlength: [30, '用户名最多30个字符'],
    },
    email: {
      type: String,
      required: [true, '邮箱必填'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '请提供有效的邮箱地址'],
    },
    password: {
      type: String,
      required: [true, '密码必填'],
      minlength: [8, '密码最少8个字符'],
      select: false, // 默认查询不返回密码
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    preferences: {
      theme: {
        type: String,
        default: 'light',
        enum: ['light', 'dark', 'system'],
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: 'en-US',
        enum: ['zh-CN', 'zh-TW', 'en-US'],
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// 保存前加密密码
userSchema.pre('save', async function (next) {
  // 只有当密码被修改时才重新哈希
  if (!this.isModified('password')) return next();

  try {
    // 生成盐并哈希密码
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 比较密码
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// 生成JWT令牌
userSchema.methods.generateAuthToken = function (): string {
  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(
    { id: this._id, email: this.email, username: this.username },
    jwtSecret,
    { expiresIn } as SignOptions
  );
};

// 创建模型
const User = mongoose.model<IUser>('User', userSchema);

export default User; 