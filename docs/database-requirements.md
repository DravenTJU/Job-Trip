# JobTrip 职途助手数据库需求文档

## 1. 技术选型
- 主数据库：MongoDB
- 缓存：Redis（可选）
- 数据库工具：MongoDB Compass
- 数据库版本：MongoDB 6.0+

## 2. 数据模型设计

### 2.1 用户集合 (users)
```javascript
{
  _id: ObjectId,
  username: String,          // 用户名
  email: String,            // 邮箱
  password: String,         // 加密后的密码
  createdAt: Date,         // 创建时间
  updatedAt: Date,         // 更新时间
  preferences: {
    theme: String,         // 主题偏好
    notifications: Boolean, // 通知设置
    language: String       // 语言偏好
  },
  status: String           // 用户状态
}
```

### 2.2 用户档案集合 (user_profiles)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // 关联用户ID (关联到users集合)
  
  // 基本信息
  firstName: String,        // 名
  lastName: String,         // 姓
  headline: String,           // 个人标题/职业概述
  biography: String,          // 个人简介
  contactInfo: {
    email: String,            // 邮箱
    phone: String,            // 电话
    website: String,          // 个人网站
    address: String,          // 地址
    socialMedia: {            // 社交媒体链接
      linkedin: String,
      github: String,
      twitter: String,
      other: [{ name: String, url: String }]
    }
  },
  
  // 教育经历（可多条）
  educations: [{
    institution: String,      // 学校名称
    degree: String,           // 学位
    field: String,            // 专业领域
    startDate: Date,          // 开始日期
    endDate: Date,            // 结束日期
    description: String,      // 描述/成就
    location: String          // 地点
  }],
  
  // 工作经历（可多条）
  workExperiences: [{
    company: String,          // 公司名称
    position: String,         // 职位
    startDate: Date,          // 开始日期
    endDate: Date,            // 结束日期
    current: Boolean,         // 是否为当前工作
    description: String,      // 工作描述
    location: String,         // 地点
    achievements: [String]    // 成就列表
  }],
  
  // 技能（分组技能）
  skills: [{
    name: String,             // 技能名称
    level: String,            // 熟练程度(初级/中级/高级/专家)
    endorsements: Number,     // 认可数
    category: String          // 技能分类(如技术/软技能/语言等)
  }],
  
  // 证书
  certifications: [{
    name: String,             // 证书名称
    issuer: String,           // 发证机构
    issueDate: Date,          // 发证日期
    expirationDate: Date,     // 到期日期
    credentialId: String,     // 证书ID
    credentialUrl: String     // 证书链接
  }],
  
  // 项目经历
  projects: [{
    name: String,             // 项目名称
    description: String,      // 项目描述
    startDate: Date,          // 开始日期
    endDate: Date,            // 结束日期
    url: String,              // 项目链接
    technologies: [String]    // 使用的技术
  }],
  
  // 语言能力
  languages: [{
    language: String,         // 语言名称
    proficiency: String       // 熟练程度(初级/中级/高级/母语)
  }],
  
  // 志愿者经历
  volunteerExperiences: [{
    organization: String,     // 组织名称
    role: String,             // 角色
    startDate: Date,          // 开始日期
    endDate: Date,            // 结束日期
    description: String       // 描述
  }],
  
  // 荣誉与奖项
  honorsAwards: [{
    title: String,            // 奖项名称
    issuer: String,           // 颁发机构
    date: Date,               // 获得日期
    description: String       // 描述
  }],
  
  // 推荐信
  recommendations: [{
    recommenderName: String,  // 推荐人姓名
    recommenderTitle: String, // 推荐人职位
    relationship: String,     // 与推荐人关系
    content: String,          // 推荐内容
    date: Date                // 推荐日期
  }],
  
  // 元数据
  profileCompleteness: Number, // 档案完整度百分比
  lastUpdated: Date,          // 最后更新时间
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

### 2.3 职位集合 (jobs)
```javascript
{
  _id: ObjectId,
  platform: String,        // 求职平台名称
  title: String,          // 职位标题
  company: String,        // 公司名称
  location: String,       // 工作地点
  description: String,    // 职位描述
  requirements: [String], // 职位要求
  salary: String,         // 薪资范围
  jobType: String,       // 工作类型
  source: String,        // 数据来源
  sourceId: String,      // 平台职位原始ID
  sourceUrl: String,     // 原始链接
  deadline: Date,        // 截止日期
  notes: String,         // 备注
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 更新时间
}
```

### 2.4 用户-职位关联集合 (user_jobs)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // 关联用户ID
  jobId: ObjectId,         // 关联职位ID
  status: String,          // 用户对该职位的申请状态
  isFavorite: Boolean,     // 是否收藏
  customTags: [String],    // 用户自定义标签
  notes: String,           // 用户备注
  reminderDate: Date,      // 提醒日期
  createdAt: Date,         // 创建时间
  updatedAt: Date          // 更新时间
}
```

### 2.5 申请历史集合 (application_history)
```javascript
{
  _id: ObjectId,
  userJobId: ObjectId,    // 关联用户-职位ID
  previousStatus: String, // 之前的状态
  newStatus: String,      // 新状态
  notes: String,          // 备注
  createdAt: Date,        // 创建时间
  updatedBy: ObjectId     // 更新者ID
}
```

### 2.6 公司集合 (companies)
```javascript
{
  _id: ObjectId,
  name: String,          // 公司名称
  website: String,       // 公司网站
  industry: String,      // 行业
  size: String,         // 公司规模
  location: String,     // 公司地点
  description: String,  // 公司描述
  createdAt: Date,      // 创建时间
  updatedAt: Date       // 更新时间
}
```

## 2.7 简历集合 (resumes)

```javascript
{
  _id: ObjectId,
  name: String,           // 简历名称
  user: ObjectId,         // 关联用户ID
  content: String,        // 简历内容（JSON格式字符串）
  targetPosition: String, // 目标职位
  targetJob: String,      // 目标工作
  createdAt: Date,        // 创建时间
  updatedAt: Date         // 更新时间
}
```

### 2.8 简历内容结构

简历内容以JSON字符串形式存储在content字段中，解析后的结构如下：

```javascript
{
  personalInfo: {
    fullName: String,     // 姓名
    email: String,        // 邮箱
    phone: String,        // 电话
    location: String      // 所在地
  },
  educations: [
    {
      education: String,   // 学历
      school: String,      // 学校
      major: String,       // 专业
      startDate: String,   // 开始日期
      endDate: String      // 结束日期
    }
  ],
  workExperiences: [
    {
      company: String,     // 公司
      position: String,    // 职位
      startDate: String,   // 开始日期
      endDate: String,     // 结束日期
      responsibilities: String // 职责描述
    }
  ],
  skills: String          // 技能描述
}
```

## 3. 索引设计

### 3.1 用户集合索引
- email (唯一索引)
- username (唯一索引)

### 3.2 用户档案集合索引
- userId (唯一索引)
- skills.name (索引)
- workExperiences.company (索引)
- educations.institution (索引)
- lastUpdated (索引)
- createdAt (索引)

### 3.3 职位集合索引
- sourceId + platform (复合唯一索引)
- company (索引)
- title (索引)
- createdAt (索引)
- platform (索引)

### 3.4 用户-职位关联集合索引
- userId + jobId (复合唯一索引)
- userId + status (复合索引)
- userId + isFavorite (复合索引)
- jobId (索引)
- createdAt (索引)

### 3.5 申请历史集合索引
- userJobId (索引)
- createdAt (索引)

### 3.6 公司集合索引
- name (唯一索引)
- industry (索引)

### 3.7 简历集合索引
- userId (索引)
- createdAt (索引)
- name (索引) 

## 4. 数据安全

### 4.1 访问控制
- 用户数据隔离
- 角色权限控制
- 数据加密存储

### 4.2 数据备份
- 定期备份策略
- 备份验证
- 恢复测试

### 4.3 数据完整性
- 外键约束
- 数据验证
- 事务支持

## 5. 性能优化

### 5.1 查询优化
- 索引优化
- 查询计划分析
- 慢查询监控

### 5.2 存储优化
- 数据压缩
- 分片策略
- 存储引擎选择

### 5.3 缓存策略
- 热点数据缓存
- 查询结果缓存
- 缓存更新策略

## 6. 监控和维护

### 6.1 监控指标
- 连接数
- 查询性能
- 存储空间
- 复制延迟

### 6.2 维护计划
- 定期优化
- 索引维护
- 数据清理
- 版本升级

## 7. 扩展性考虑（暂不考虑）

### 7.1 分片策略
- 按用户ID分片
- 按时间范围分片
- 按地理位置分片

### 7.2 读写分离
- 主从复制
- 读操作负载均衡
- 写操作路由

## 8. 数据迁移

### 8.1 迁移策略
- 数据备份
- 增量迁移
- 数据验证
- 回滚计划

### 8.2 版本控制
- 数据库版本管理
- 模型变更记录
- 迁移脚本管理 