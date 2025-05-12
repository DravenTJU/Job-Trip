# JobTrip 职途助手后端

JobTrip是一个帮助求职者管理求职过程的平台，本仓库包含后端API服务。

## 技术栈

- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT (用户认证)
- Jest (测试框架)
- Swagger (API文档)

## 安装与运行

### 前提条件

- Node.js (>=14.0.0)
- MongoDB

### 安装依赖

```bash
npm install
```

### 环境变量配置

1. 复制`.env.example`文件为`.env`
2. 根据需要修改以下配置:
   - `PORT` - API服务端口
   - `HOST` - 服务器监听地址（默认为0.0.0.0，允许局域网访问）
   - `MONGODB_URI` - MongoDB连接字符串
   - `JWT_SECRET` - JWT密钥
   - 其他配置...

### 运行开发环境

```bash
npm run dev
```

### 构建生产环境

```bash
npm run build
```

### 运行生产环境

```bash
npm start
```

### 运行测试

```bash
npm test
```

## 局域网访问

默认配置允许从局域网访问开发服务器：

1. 确保`.env`文件中设置了`HOST=0.0.0.0`
2. 找到服务器的IP地址（例如：192.168.1.132）
3. 在局域网内的其他设备上，通过浏览器访问：
   ```
   http://192.168.1.132:5001
   ```

注意：
- 确保服务器防火墙允许5001端口的入站连接
- 如果使用了不同端口，请相应调整访问URL

## API文档

API文档使用以下方式提供：

1. **Swagger UI文档**
   - 本地访问: http://localhost:5001/api-docs
   - 局域网访问: http://192.168.1.132:5001/api-docs
   - Swagger JSON: http://localhost:5001/api-docs.json

2. **ReDoc美化文档** (推荐)
   - 本地访问: http://localhost:5001/docs
   - 局域网访问: http://192.168.1.132:5001/docs
   - 静态文档: http://localhost:5001/static-docs

### 生成静态API文档
要生成静态API文档，请使用以下命令：

```bash
# 确保API服务已启动
npm run dev

# 新开一个终端窗口，运行以下命令
npm run generate-docs
```

生成的文档将保存在 `public/docs` 目录下。

## API概览

### 用户管理

- `POST /api/v1/users/register` - 用户注册
- `POST /api/v1/users/login` - 用户登录
- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me` - 更新当前用户信息
- `PUT /api/v1/users/password` - 更新当前用户密码

### 职位管理

- `GET /api/v1/jobs` - 获取职位列表
- `POST /api/v1/jobs` - 创建新职位
- `GET /api/v1/jobs/:id` - 获取单个职位
- `PUT /api/v1/jobs/:id` - 更新职位
- `DELETE /api/v1/jobs/:id` - 删除职位

### 公司管理

- `GET /api/v1/companies` - 获取公司列表
- `POST /api/v1/companies` - 创建新公司
- `GET /api/v1/companies/:id` - 获取单个公司
- `PUT /api/v1/companies/:id` - 更新公司
- `DELETE /api/v1/companies/:id` - 删除公司

### 用户-职位关联管理

- `GET /api/v1/userjobs` - 获取用户关联的职位列表
- `POST /api/v1/userjobs` - 创建新的用户-职位关联
- `GET /api/v1/userjobs/:id` - 获取单个用户-职位关联
- `PUT /api/v1/userjobs/:id` - 更新用户-职位关联
- `DELETE /api/v1/userjobs/:id` - 删除用户-职位关联

### 系统

- `GET /health` - 服务健康检查

## 代码结构

```
/backend
├── src/                   # 源代码
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── services/          # 业务服务
│   ├── utils/             # 工具函数
│   ├── app.ts             # Express应用
│   └── index.ts           # 应用入口
├── dist/                  # 编译输出
├── logs/                  # 日志文件
├── tests/                 # 测试文件
├── .env.example           # 环境变量示例
├── .gitignore             # Git忽略文件
├── README.md              # 项目说明
├── package.json           # 项目依赖
└── tsconfig.json          # TypeScript配置
```

## 授权认证

除了登录和注册外，大多数API都需要认证。在请求头中添加以下内容：

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 贡献

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

MIT 

## 开发指南

### 启动开发服务器

项目支持HTTP和HTTPS两种模式进行开发：

```bash
# HTTP模式（默认）
npm run dev:http

# HTTPS模式（使用自签名证书）
npm run dev:https
```

### HTTP/HTTPS问题排查

如果遇到浏览器报SSL错误，可能原因有：

1. 服务器运行在HTTP模式，但资源通过HTTPS请求
2. 使用了自签名证书，浏览器显示不安全警告

解决方法：

- 使用HTTP模式：`npm run dev:http`
- 在浏览器中手动接受自签名证书
- 参考 `docs/http-https-dev.md` 了解更多细节 