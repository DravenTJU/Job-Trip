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
  firstName: String,        // 名
  lastName: String,         // 姓
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

### 2.2 职位集合 (jobs)
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
  status: String,        // 申请状态
  source: String,        // 数据来源
  sourceId: String,      // 平台职位原始ID
  sourceUrl: String,     // 原始链接
  appliedDate: Date,     // 申请日期
  deadline: Date,        // 截止日期
  notes: String,         // 备注
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 更新时间
}
```

### 2.3 用户-职位关联集合 (user_jobs)
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

### 2.4 申请历史集合 (application_history)
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

### 2.5 公司集合 (companies)
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

## 3. 索引设计

### 3.1 用户集合索引
- email (唯一索引)
- username (唯一索引)

### 3.2 职位集合索引
- sourceId + platform (复合唯一索引)
- company (索引)
- title (索引)
- createdAt (索引)
- status (索引)
- platform (索引)

### 3.3 用户-职位关联集合索引
- userId + jobId (复合唯一索引)
- userId + status (复合索引)
- userId + isFavorite (复合索引)
- jobId (索引)
- createdAt (索引)

### 3.4 申请历史集合索引
- userJobId (索引)
- createdAt (索引)

### 3.5 公司集合索引
- name (唯一索引)
- industry (索引)

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