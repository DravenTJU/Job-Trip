
[模式:计划][模型:Claude 3.7 Sonnet]

# JobTrip用户档案CRUD后端服务实施计划

## 1. 概述

为JobTrip职途助手系统开发完整的用户档案(user_profiles)CRUD后端服务，支持用户创建和管理个人档案信息，为简历生成器和求职信生成器提供完整数据源。实现将基于当前项目的MongoDB、Express、Node.js架构。

## 2. 文件结构

```
backend/src/
├── models/
│   └── userProfileModel.ts     # 用户档案数据模型
├── controllers/
│   └── userProfileController.ts # 用户档案控制器
├── routes/
│   └── userProfileRoutes.ts    # 用户档案路由
├── validators/
│   └── userProfileValidator.ts # 用户档案数据验证
└── tests/
    └── userProfile.test.ts     # 用户档案测试
```

## 3. 数据模型实现

### 3.1 用户档案模型 (userProfileModel.ts)

创建包含以下要素的Mongoose模型：

- 基础模型结构与数据库需求文档一致
- TypeScript接口定义
- Mongoose Schema定义
- 子模式定义(教育、工作经历等)
- 索引设计
- 计算档案完整度的钩子方法
- 用户引用关系

## 4. 控制器实现

### 4.1 基础CRUD控制器 (userProfileController.ts)

- 获取用户档案 (getCurrentUserProfile)
- 创建/更新用户档案 (updateUserProfile)
- 删除用户档案 (deleteUserProfile)

### 4.2 教育经历控制器

- 添加教育经历 (addEducation)
- 更新教育经历 (updateEducation)
- 删除教育经历 (deleteEducation)

### 4.3 工作经历控制器

- 添加工作经历 (addWorkExperience)
- 更新工作经历 (updateWorkExperience)
- 删除工作经历 (deleteWorkExperience)

### 4.4 技能控制器

- 添加技能 (addSkill)
- 更新技能 (updateSkill)
- 删除技能 (deleteSkill)

### 4.5 证书控制器

- 添加证书 (addCertification)
- 更新证书 (updateCertification)
- 删除证书 (deleteCertification)

### 4.6 项目经历控制器

- 添加项目 (addProject)
- 更新项目 (updateProject)
- 删除项目 (deleteProject)

### 4.7 语言能力控制器

- 添加语言 (addLanguage)
- 更新语言 (updateLanguage)
- 删除语言 (deleteLanguage)

### 4.8 志愿者经历控制器

- 添加志愿者经历 (addVolunteerExperience)
- 更新志愿者经历 (updateVolunteerExperience)
- 删除志愿者经历 (deleteVolunteerExperience)

### 4.9 荣誉与奖项控制器

- 添加荣誉奖项 (addHonorAward)
- 更新荣誉奖项 (updateHonorAward)
- 删除荣誉奖项 (deleteHonorAward)

### 4.10 推荐信控制器

- 添加推荐信 (addRecommendation)
- 更新推荐信 (updateRecommendation)
- 删除推荐信 (deleteRecommendation)

## 5. 路由实现

### 5.1 用户档案基础路由 (userProfileRoutes.ts)

```
GET /api/v1/user-profiles/me         - 获取用户档案
PUT /api/v1/user-profiles/me         - 更新用户档案
DELETE /api/v1/user-profiles/me      - 删除用户档案
```

### 5.2 教育经历路由

```
POST /api/v1/user-profiles/me/educations          - 添加教育经历
PUT /api/v1/user-profiles/me/educations/:index    - 更新教育经历
DELETE /api/v1/user-profiles/me/educations/:index - 删除教育经历
```

### 5.3 工作经历路由

```
POST /api/v1/user-profiles/me/work-experiences          - 添加工作经历
PUT /api/v1/user-profiles/me/work-experiences/:index    - 更新工作经历
DELETE /api/v1/user-profiles/me/work-experiences/:index - 删除工作经历
```

### 5.4 技能路由

```
POST /api/v1/user-profiles/me/skills          - 添加技能
PUT /api/v1/user-profiles/me/skills/:index    - 更新技能
DELETE /api/v1/user-profiles/me/skills/:index - 删除技能
```

### 5.5 其他子项路由

为其余子项(证书、项目、语言等)实现类似的路由结构。

## 6. 数据验证实现

### 6.1 验证中间件 (userProfileValidator.ts)

为以下操作创建验证中间件：

- 基础档案验证
- 教育经历验证
- 工作经历验证 
- 技能验证
- 其他子项验证

## 7. 错误处理与权限控制

### 7.1 错误处理

利用现有的错误处理中间件:
- 参数验证错误
- 数据不存在错误
- 数据格式错误 
- 服务器错误

### 7.2 权限控制

利用现有的认证中间件:
- 用户认证(protect中间件)
- 确保用户只能访问自己的档案数据

## 8. 测试实现

### 8.1 单元测试 (userProfile.test.ts)

为以下功能编写测试:
- 模型测试(验证、默认值等)
- 控制器测试
- 路由测试
- 权限测试

## 9. 集成与部署

### 9.1 应用集成

- 在app.ts中注册路由
- 添加Swagger文档
- 注册必要的中间件

### 9.2 数据库迁移

- 创建数据库迁移脚本

## 10. 文档编写

### 10.1 API文档

- 为所有端点添加Swagger文档注释
- 添加示例请求和响应

### 10.2 代码文档

- 为所有模块添加JSDoc文档注释

## 文件创建详情

### userProfileModel.ts (数据模型)

```typescript
import mongoose, { Document, Schema } from 'mongoose';
import { User } from './userModel';

// 用户档案接口
export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId | User;
  headline?: string;
  photo?: string;
  biography?: string;
  contactInfo: {
    // 联系信息字段...
  };
  educations?: Array<{
    // 教育经历字段...
  }>;
  workExperiences?: Array<{
    // 工作经历字段...
  }>;
  skills?: Array<{
    // 技能字段...
  }>;
  // 其他档案字段...
  profileCompleteness?: number;
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 子模式定义...

// 用户档案Schema
const userProfileSchema = new Schema<IUserProfile>(
  {
    // Schema字段定义...
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 索引
userProfileSchema.index({ userId: 1 }, { unique: true });
// 其他索引...

// 计算档案完整度的方法
userProfileSchema.pre('save', function(next) {
  // 档案完整度计算逻辑...
  next();
});

// 创建模型
const UserProfile = mongoose.model<IUserProfile>('UserProfile', userProfileSchema);

export default UserProfile;
```

### userProfileController.ts (控制器)

```typescript
import { Request, Response, NextFunction } from 'express';
import UserProfile from '../models/userProfileModel';
import { AppError, createApiResponse } from '../middleware/errorHandler';

// 获取当前用户档案
export const getCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 实现逻辑...
  } catch (error) {
    next(error);
  }
};

// 更新用户档案
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 实现逻辑...
  } catch (error) {
    next(error);
  }
};

// 添加教育经历
export const addEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 实现逻辑...
  } catch (error) {
    next(error);
  }
};

// 其他控制器方法...
```

### userProfileRoutes.ts (路由)

```typescript
import express from 'express';
import {
  getCurrentUserProfile,
  updateUserProfile,
  // 其他控制器方法...
} from '../controllers/userProfileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// 所有路由都需要通过认证
router.use(protect);

// 用户档案基本操作
router.route('/me')
  .get(getCurrentUserProfile)
  .put(updateUserProfile);

// 教育经历
router.route('/me/educations')
  .post(addEducation);

// 其他路由...

export default router;
```

## 实施检查清单:

1. [准备] 创建项目分支用于开发用户档案功能
2. [模型] 创建userProfileModel.ts文件并定义所有子模式
3. [模型] 实现用户档案主Schema与字段定义
4. [模型] 添加索引与计算档案完整度的钩子方法
5. [控制器] 创建userProfileController.ts文件
6. [控制器] 实现基础CRUD功能(获取/更新/删除用户档案)
7. [控制器] 实现教育经历CRUD功能
8. [控制器] 实现工作经历CRUD功能
9. [控制器] 实现技能CRUD功能
10. [控制器] 实现证书CRUD功能
11. [控制器] 实现项目经历CRUD功能
12. [控制器] 实现语言能力CRUD功能
13. [控制器] 实现志愿者经历CRUD功能
14. [控制器] 实现荣誉奖项CRUD功能
15. [控制器] 实现推荐信CRUD功能
16. [路由] 创建userProfileRoutes.ts文件
17. [路由] 实现基础档案路由
18. [路由] 实现所有子项路由
19. [验证] 创建userProfileValidator.ts文件
20. [验证] 实现基础档案数据验证
21. [验证] 实现所有子项数据验证
22. [测试] 创建userProfile.test.ts测试文件
23. [测试] 实现模型和字段验证测试
24. [测试] 实现控制器功能测试
25. [集成] 在app.ts中注册用户档案路由
26. [集成] 添加Swagger API文档
27. [测试] 运行单元测试确认功能正常
28. [测试] 使用Postman测试API端点
29. [文档] 完善代码注释与文档
30. [部署] 创建数据库迁移脚本
31. [部署] 提交代码并创建Pull Request
