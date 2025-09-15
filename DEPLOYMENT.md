# JobTrip 部署指南

## 服务器环境要求

- Ubuntu 20.04+ / CentOS 7+
- Node.js 18.0+
- MongoDB 5.0+
- Nginx 1.18+
- PM2 (进程管理)

## 域名和SSL配置

**域名**: `jobtrip.draven.best`
**SSL证书**: Cloudflare 证书

### SSL证书部署

1. 将Cloudflare证书文件上传到服务器：
```bash
sudo mkdir -p /etc/nginx/ssl
sudo cp cloudflare.pem /etc/nginx/ssl/
sudo cp cloudflare.key /etc/nginx/ssl/
sudo chmod 600 /etc/nginx/ssl/cloudflare.key
sudo chmod 644 /etc/nginx/ssl/cloudflare.pem
```

## 项目部署步骤

### 1. 克隆项目代码
```bash
cd /var/www
sudo git clone https://github.com/DravenTJU/Job-Trip.git jobtrip
sudo chown -R $USER:$USER /var/www/Job-Trip
cd /var/www/Job-Trip
```

### 2. 后端部署

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等参数

# 构建项目
npm run build

# 使用PM2启动后端服务
npm install -g pm2
pm2 start dist/index.js --name "jobtrip-backend"
pm2 save
pm2 startup
```

### 3. 前端部署

```bash
cd ../frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 确保构建文件存在
ls -la dist/
```

### 4. Nginx配置

```bash
# 复制nginx配置
sudo cp /var/www/Job-Trip/nginx.conf.example /etc/nginx/sites-available/jobtrip
sudo ln -s /etc/nginx/sites-available/jobtrip /etc/nginx/sites-enabled/

# 测试nginx配置
sudo nginx -t

# 重启nginx
sudo systemctl restart nginx
```

### 5. MongoDB配置

```bash
# 启动MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 初始化数据库（如果需要）
cd /var/www/Job-Trip/backend
npm run init-db
```

## 服务管理

### 后端服务管理
```bash
# 查看服务状态
pm2 status

# 重启后端服务
pm2 restart jobtrip-backend

# 查看日志
pm2 logs jobtrip-backend

# 停止服务
pm2 stop jobtrip-backend
```

### Nginx管理
```bash
# 重启nginx
sudo systemctl restart nginx

# 查看nginx状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/jobtrip.error.log

# 查看访问日志
sudo tail -f /var/log/nginx/jobtrip.access.log
```

## 文件路径说明

- **前端静态文件**: `/var/www/Job-Trip/frontend/dist`
- **后端服务**: `http://localhost:5000`
- **SSL证书**: `/etc/nginx/ssl/cloudflare.{pem,key}`
- **Nginx配置**: `/etc/nginx/sites-available/jobtrip`
- **日志文件**: `/var/log/nginx/jobtrip.{access,error}.log`

## 安全配置

### 1. 防火墙设置
```bash
# 允许HTTP和HTTPS
sudo ufw allow 80
sudo ufw allow 443

# 允许SSH（如果需要）
sudo ufw allow 22

# 启用防火墙
sudo ufw enable
```

### 2. SSL安全评级
配置文件已包含：
- TLS 1.2/1.3 支持
- 强加密套件
- HSTS头部
- 安全头部设置

### 3. 速率限制
- API接口：10请求/秒
- 登录接口：5请求/分钟

## 监控和维护

### 1. 服务监控
```bash
# 检查所有服务状态
sudo systemctl status nginx mongod
pm2 status

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :5000
```

### 2. 日志监控
```bash
# 实时查看错误日志
sudo tail -f /var/log/nginx/jobtrip.error.log

# 查看PM2日志
pm2 logs --lines 100
```

### 3. 性能优化
- 开启Gzip压缩
- 静态资源缓存（1年）
- API响应缓存
- MongoDB索引优化

## 更新部署

### 1. 更新代码
```bash
cd /var/www/Job-Trip
git pull origin main
```

### 2. 更新后端
```bash
cd backend
npm install
npm run build
pm2 restart jobtrip-backend
```

### 3. 更新前端
```bash
cd frontend
npm install
npm run build
```

### 4. 重启服务
```bash
sudo systemctl reload nginx
```

## 故障排除

### 1. 常见问题

**503 错误 - 后端无响应**
```bash
# 检查后端服务状态
pm2 status
pm2 logs jobtrip-backend

# 重启后端服务
pm2 restart jobtrip-backend
```

**SSL证书错误**
```bash
# 检查证书文件权限
ls -la /etc/nginx/ssl/

# 测试SSL配置
sudo nginx -t
```

**前端页面无法加载**
```bash
# 检查前端文件权限
ls -la /var/www/Job-Trip/frontend/dist/

# 检查nginx配置
sudo nginx -t
```

### 2. 健康检查
```bash
# 检查网站可访问性
curl -I https://jobtrip.draven.best

# 检查API接口
curl -I https://jobtrip.draven.best/api/health

# 检查SSL证书
openssl s_client -connect jobtrip.draven.best:443 -servername jobtrip.draven.best
```

## 备份策略

### 1. 数据库备份
```bash
# 创建MongoDB备份
mongodump --db jobtrip --out /backup/mongodb/$(date +%Y%m%d)

# 恢复数据库
mongorestore --db jobtrip /backup/mongodb/20231201/jobtrip
```

### 2. 代码备份
```bash
# 备份整个项目
tar -czf /backup/jobtrip-$(date +%Y%m%d).tar.gz /var/www/Job-Trip
```
