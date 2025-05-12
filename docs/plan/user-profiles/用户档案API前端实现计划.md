
[模式:计划][模型:Claude 3.7 Sonnet]

# 用户档案API前端实现计划

## 1. 设计profileService.ts

### 1.1 基础设置和接口
- 定义API基础URL和请求配置
- 创建基本的错误处理函数
- 设计统一的响应类型接口

### 1.2 基本用户档案API
- 获取当前用户档案 (GET `/user-profiles/me`)
- 更新用户档案 (PUT `/user-profiles/me`)
- 删除用户档案 (DELETE `/user-profiles/me`)

### 1.3 教育经历API
- 添加教育经历 (POST `/user-profiles/me/educations`)
- 更新教育经历 (PUT `/user-profiles/me/educations/:id`)
- 删除教育经历 (DELETE `/user-profiles/me/educations/:id`)

### 1.4 工作经历API
- 添加工作经历 (POST `/user-profiles/me/work-experiences`)
- 更新工作经历 (PUT `/user-profiles/me/work-experiences/:id`)
- 删除工作经历 (DELETE `/user-profiles/me/work-experiences/:id`)

### 1.5 技能API
- 添加技能 (POST `/user-profiles/me/skills`)
- 更新技能 (PUT `/user-profiles/me/skills/:id`)
- 删除技能 (DELETE `/user-profiles/me/skills/:id`)

### 1.6 证书API
- 添加证书 (POST `/user-profiles/me/certifications`)
- 更新证书 (PUT `/user-profiles/me/certifications/:id`)
- 删除证书 (DELETE `/user-profiles/me/certifications/:id`)

### 1.7 项目经历API
- 添加项目 (POST `/user-profiles/me/projects`)
- 更新项目 (PUT `/user-profiles/me/projects/:id`)
- 删除项目 (DELETE `/user-profiles/me/projects/:id`)

### 1.8 语言能力API
- 添加语言 (POST `/user-profiles/me/languages`)
- 更新语言 (PUT `/user-profiles/me/languages/:id`)
- 删除语言 (DELETE `/user-profiles/me/languages/:id`)

### 1.9 志愿者经历API
- 添加志愿者经历 (POST `/user-profiles/me/volunteer-experiences`)
- 更新志愿者经历 (PUT `/user-profiles/me/volunteer-experiences/:id`)
- 删除志愿者经历 (DELETE `/user-profiles/me/volunteer-experiences/:id`)

### 1.10 荣誉奖项API
- 添加奖项 (POST `/user-profiles/me/honors-awards`)
- 更新奖项 (PUT `/user-profiles/me/honors-awards/:id`)
- 删除奖项 (DELETE `/user-profiles/me/honors-awards/:id`)

### 1.11 推荐信API
- 添加推荐信 (POST `/user-profiles/me/recommendations`)
- 更新推荐信 (PUT `/user-profiles/me/recommendations/:id`)
- 删除推荐信 (DELETE `/user-profiles/me/recommendations/:id`)

## 2. 更新profileSlice.ts

### 2.1 状态定义
- 确保state包含完整的UserProfile类型
- 添加加载状态和错误状态字段
- 添加当前编辑的section标记

### 2.2 基本异步Action
- 创建fetchUserProfile异步thunk
- 创建updateUserProfile异步thunk
- 创建deleteUserProfile异步thunk

### 2.3 教育经历Action
- 创建addEducation异步thunk
- 创建updateEducation异步thunk
- 创建deleteEducation异步thunk

### 2.4 工作经历Action
- 创建addWorkExperience异步thunk
- 创建updateWorkExperience异步thunk
- 创建deleteWorkExperience异步thunk

### 2.5 技能Action
- 创建addSkill异步thunk
- 创建updateSkill异步thunk
- 创建deleteSkill异步thunk

### 2.6 证书Action
- 创建addCertification异步thunk
- 创建updateCertification异步thunk
- 创建deleteCertification异步thunk

### 2.7 项目经历Action
- 创建addProject异步thunk
- 创建updateProject异步thunk
- 创建deleteProject异步thunk

### 2.8 语言能力Action
- 创建addLanguage异步thunk
- 创建updateLanguage异步thunk
- 创建deleteLanguage异步thunk

### 2.9 志愿者经历Action
- 创建addVolunteerExperience异步thunk
- 创建updateVolunteerExperience异步thunk
- 创建deleteVolunteerExperience异步thunk

### 2.10 荣誉奖项Action
- 创建addHonorAward异步thunk
- 创建updateHonorAward异步thunk
- 创建deleteHonorAward异步thunk

### 2.11 推荐信Action
- 创建addRecommendation异步thunk
- 创建updateRecommendation异步thunk
- 创建deleteRecommendation异步thunk

### 2.12 UI控制Action
- 创建setActiveSection reducer
- 创建setEditMode reducer
- 创建clearError reducer

## 3. 类型定义更新 (types/profile.ts)

### 3.1 核心类型
- 确保UserProfile类型与后端一致
- 确保所有子类型（Education, WorkExperience等）与后端一致
- 添加适当的ID字段和可选字段

### 3.2 请求类型
- 为每个API端点定义请求参数类型
- 为每个API端点定义响应类型

### 3.3 State类型
- 定义ProfileState类型
- 包含完整的profile字段、加载状态和错误状态

## 4. 组件更新

### 4.1 表单组件
- 确保所有表单组件使用正确的API请求
- 添加适当的加载状态和错误处理
- 实现表单验证与后端要求一致

### 4.2 展示组件
- 确保所有列表组件能正确展示API返回的数据
- 实现正确的排序和过滤功能

## 实施检查清单:
1. 创建profileService.ts文件
2. 在profileService中实现所有API端点函数
3. 更新profileSlice.ts中的异步thunk
4. 确保所有类型定义都与后端一致
5. 更新组件以使用新的API服务
6. 添加适当的加载指示器
7. 添加错误处理和错误显示
8. 添加表单验证
9. 测试所有CRUD操作功能
10. 优化性能和用户体验
