// 简历类型枚举
export enum ResumeType {
  BASE = '基础简历',
  TAILORED = '定制简历'
}

// 简历接口
export interface Resume {
  _id: string;
  name: string;
  user: string;
  content: string;
  type: ResumeType;
  targetPosition?: string;
  targetJob?: string;
  tailored: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// 创建简历数据接口
export interface CreateResumeData {
  name: string;
  content: string;
  type: ResumeType;
  targetPosition?: string;
  targetJob?: string;
  tailored?: boolean;
  thumbnail?: string;
}

// 更新简历数据接口
export interface UpdateResumeData extends Partial<CreateResumeData> {}