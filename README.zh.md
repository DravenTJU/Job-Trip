# JobTrip 职途助手

[English Version](README.md) | 中文版

JobTrip是一个智能求职追踪系统，旨在帮助求职者更有效地管理求职过程。该系统包括浏览器扩展和Web应用程序，可以自动收集主流招聘平台的职位信息，提供集中管理应用的平台，并帮助用户有效地组织和跟踪求职流程。

## 项目概述

JobTrip为新西兰就业市场的求职者提供了一站式解决方案，具有以下主要功能：

- 自动从LinkedIn、Indeed和Seek等热门招聘网站收集职位信息
- 提供一个集中平台管理所有职位申请
- **个性化职位状态跟踪系统**，每位用户可以独立管理自己关注的职位状态
- **实时状态更新**，修改职位状态无需刷新页面，提升用户体验
- **历史状态记录**，记录职位状态变更历史，便于回顾申请进程
- 手动添加职位时自动创建用户关联，实现无缝集成
- 提供数据分析和求职建议

## 技术栈

### 前端
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Material-UI (MUI)
- Redux Toolkit
- React Router DOM
- Axios

### 后端
- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT (用户认证)
- Swagger (API文档)
- Winston (日志管理)

### 浏览器扩展
- Chrome Extension API
- Web Scraping技术

## 系统架构

项目采用前后端分离的架构：

1. **前端**：
   - React单页应用，负责用户界面和交互
   - 状态管理采用Redux，通过RTK管理API请求和本地状态
   - 组件设计遵循"关注点分离"原则，如StatusBadge组件独立管理UI状态

2. **后端**：
   - Node.js API服务，处理业务逻辑和数据存储
   - RESTful API设计，遵循资源导向原则
   - 多层数据模型，实现用户-职位关联的灵活管理

3. **浏览器扩展**：
   - 实现从招聘网站自动收集职位信息
   - 与主系统无缝集成

## 安装与运行

### 后端

#### 前提条件
- Node.js (>=14.0.0)
- MongoDB

#### 安装依赖
```bash
cd backend
npm install
```

#### 环境变量配置
1. 复制`.env.example`文件为`.env`
2. 根据需要修改以下配置:
   - `PORT` - API服务端口
   - `HOST` - 服务器监听地址
   - `MONGODB_URI` - MongoDB连接字符串
   - `JWT_SECRET` - JWT密钥

#### 运行开发环境
```bash
npm run dev:http
```

#### 构建生产环境
```bash
npm run build
npm start
```

### 前端

#### 前提条件
- Node.js (>=14.0.0)

#### 安装依赖
```bash
cd frontend
npm install
```

#### 运行开发环境
```bash
# 本地开发
npm run dev

# 局域网访问
npm run dev:host
```

#### 构建生产环境
```bash
npm run build
```

## API文档

API文档使用以下方式提供：

1. **Swagger UI文档**
   - 本地访问: http://localhost:5001/api-docs

2. **ReDoc美化文档** (推荐)
   - 本地访问: http://localhost:5001/docs

### 生成静态API文档
```bash
cd backend
npm run generate-docs
```

## 主要功能

### 用户管理
- 用户注册和登录
- 个人资料管理
- 密码更新

### 职位管理
- 获取职位列表
- 创建、查看、更新和删除职位
- 职位搜索和筛选
- **手动添加职位**时自动创建用户关联，无需额外操作
- **职位详情页**显示和更新职位状态，实时反映最新状态

### 公司管理
- 获取公司列表
- 创建、查看、更新和删除公司信息

### 用户-职位关联
- **个性化状态跟踪**：每位用户独立管理关注职位的状态
- **多状态支持**：新职位、已申请、面试中、录用、拒绝等状态支持
- **状态实时更新**：前端独立状态管理，避免页面刷新
- **状态历史记录**：记录所有状态变更，便于回顾申请过程
- **智能数据统计**：按状态统计职位数量，提供可视化报告

## 项目结构

```
/
├── frontend/                # 前端React应用
│   ├── src/                 # 源代码
│   │   ├── assets/          # 静态资源
│   │   ├── components/      # 组件
│   │   │   ├── common/      # 通用组件
│   │   ├── context/         # React上下文
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── pages/           # 页面组件
│   │   ├── redux/           # Redux状态管理
│   │   │   ├── slices/      # 状态切片
│   │   ├── routes/          # 路由配置
│   │   ├── services/        # API服务
│   │   ├── styles/          # 样式文件
│   │   ├── types/           # TypeScript类型定义
│   │   ├── utils/           # 工具函数
│   │   ├── App.tsx          # 应用入口组件
│   │   └── main.tsx         # 应用启动入口
│   └── package.json         # 项目依赖
│
├── backend/                 # 后端API服务
│   ├── src/                 # 源代码
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务服务
│   │   ├── utils/           # 工具函数
│   │   ├── app.ts           # Express应用
│   │   └── index.ts         # 应用入口
│   ├── logs/                # 日志文件
│   └── package.json         # 项目依赖
│
└── docs/                    # 项目文档
    ├── backend-requirements.md    # 后端需求文档
    ├── database-requirements.md   # 数据库需求文档
    ├── deployment-guide.md        # 部署指南
    ├── frontend-requirements.md   # 前端需求文档
    └── Project Proposal.md        # 项目提案
```

## 贡献指南

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

MIT
