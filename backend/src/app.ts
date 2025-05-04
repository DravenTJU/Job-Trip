import dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, createApiResponse } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';
import companyRoutes from './routes/companyRoutes';
import userJobRoutes from './routes/userJobRoutes';
import resumeRoutes from './routes/resumeRoutes';
import aiRoutes from './routes/aiRoutes';
import { stream } from './utils/logger';
import swaggerSpec from './config/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { getBasicCSP, getDocsCSP } from './utils/cspHelper';

const app: Application = express();

// 安全中间件
app.use(helmet({
  // 修改CSP策略，允许CDN脚本和内联脚本
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:", "cdn.jsdelivr.net", "fonts.googleapis.com", "cdn.redoc.ly"],
      workerSrc: ["'self'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "cdn.jsdelivr.net"],
      fontSrc: ["'self'", "fonts.gstatic.com", "fonts.googleapis.com"],
      connectSrc: ["'self'"]
    }
  },
  // 在非HTTPS环境中禁用这些安全头
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
  originAgentCluster: false,
  strictTransportSecurity: false
}));

// 配置CORS
app.use(cors({
  origin: '*', // 在开发环境中允许所有来源访问
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 速率限制器
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
  max: Number(process.env.RATE_LIMIT_MAX) || 100, // 每个IP在windowMs内限制100个请求
  standardHeaders: true, // 返回标准的RateLimit头信息
  legacyHeaders: false, // 禁用`X-RateLimit-*` 头信息
});

// 应用速率限制到所有请求
app.use(limiter);

// 请求体解析器
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP请求日志
app.use(morgan('combined', { stream }));

// 为Swagger UI创建特定中间件，确保所有资源通过HTTP加载
app.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
  // 设置特定的CSP策略，允许加载所有Swagger UI资源
  res.setHeader('Content-Security-Policy', getDocsCSP());
  // 确保不会使用HSTS头
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  next();
});

// 为ReDoc文档添加特定中间件，确保所有资源通过HTTP加载
app.use('/docs', (req: Request, res: Response, next: NextFunction) => {
  // 设置特定的CSP策略，允许加载所有ReDoc资源，包括Web Worker
  res.setHeader('Content-Security-Policy', getDocsCSP());
  // 确保不会使用HSTS头
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  next();
});

// 为ReDoc的JS文件添加特定中间件
app.use('/redoc-standalone.js', (req: Request, res: Response, next: NextFunction) => {
  // 设置适当的内容类型
  res.setHeader('Content-Type', 'application/javascript');
  // 设置缓存控制头，提高性能
  res.setHeader('Cache-Control', 'public, max-age=86400');
  // 设置CSP允许Web Worker
  res.setHeader('Content-Security-Policy', getDocsCSP());
  // 确保不会使用HSTS头
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  next();
});

// Swagger文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'JobTrip API 文档',
  swaggerOptions: {
    url: '/api-docs.json',
    docExpansion: 'list',
    persistAuthorization: true,
    // 确保所有资源使用相对路径或HTTP协议
    syntaxHighlight: {
      activate: true,
      theme: 'agate'
    },
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
  }
}));

// 提供Swagger规范的JSON端点
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 提供Swagger UI的CSS和JS文件
app.get('/api-docs/swagger-ui.css', (req: Request, res: Response) => {
  // 从node_modules中获取Swagger UI的CSS文件
  const cssPath = require.resolve('swagger-ui-dist/swagger-ui.css');
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(cssPath);
});

app.get('/api-docs/swagger-ui-bundle.js', (req: Request, res: Response) => {
  const jsPath = require.resolve('swagger-ui-dist/swagger-ui-bundle.js');
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(jsPath);
});

app.get('/api-docs/swagger-ui-standalone-preset.js', (req: Request, res: Response) => {
  const jsPath = require.resolve('swagger-ui-dist/swagger-ui-standalone-preset.js');
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(jsPath);
});

// ReDoc 美化版API文档
app.get('/docs', (req: Request, res: Response) => {
  // 获取当前请求的协议和主机信息
  // const protocol = req.protocol;
  const protocol = "http"; // 强制使用HTTP协议
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  
  // 获取CSP策略
  const cspPolicy = getDocsCSP();
  
  // 读取ReDoc HTML模板并注入我们的API规范
  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>JobTrip API 文档 - ReDoc</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="${cspPolicy}">
    <link rel="icon" href="/favicon.ico" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      .menu-content {
        background-color: #f9f9f9;
      }
      .api-info, .api-info h1, .api-info p {
        font-family: sans-serif;
      }
      .redoc-wrap {
        font-family: sans-serif;
      }
      .api-logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .api-logo img {
        max-width: 120px;
        padding: 10px;
      }
      .redoc-wrap .operation-type {
        border-radius: 3px;
        font-family: monospace;
        font-weight: bold;
      }
      .react-tabs__tab--selected {
        background-color: #f0f0f0 !important;
      }
      .http-verb {
        padding: 5px 10px;
        border-radius: 3px;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        display: inline-block;
        margin-right: 10px;
      }
      .http-get {
        background-color: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }
      .http-post {
        background-color: rgba(63, 81, 181, 0.1);
        color: #3f51b5;
      }
      .http-put {
        background-color: rgba(255, 152, 0, 0.1);
        color: #ff9800;
      }
      .http-delete {
        background-color: rgba(244, 67, 54, 0.1);
        color: #f44336;
      }
      .http-patch {
        background-color: rgba(0, 150, 136, 0.1);
        color: #009688;
      }
    </style>
  </head>
  <body>
    <redoc spec-url="${baseUrl}/api-docs.json" hide-download-button></redoc>
    <script src="/redoc-standalone.js"></script>
    <script>
      // 自定义主题配置
      window.addEventListener('load', function() {
        if (window.Redoc) {
          // 自定义主题配置
          const theme = {
            typography: {
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              headings: {
                fontFamily: 'sans-serif',
                fontWeight: '600'
              }
            },
            colors: {
              primary: { main: '#3f51b5' },
              success: { main: '#4caf50' },
              warning: { main: '#ff9800' },
              error: { main: '#f44336' },
              http: {
                get: '#4caf50',
                post: '#3f51b5',
                put: '#ff9800',
                delete: '#f44336',
                options: '#9c27b0',
                patch: '#009688'
              }
            }
          };
          
          try {
            const redocEl = document.querySelector('redoc');
            if (redocEl) {
              redocEl.setAttribute('theme', JSON.stringify(theme));
            }
          } catch (e) {
            console.error('应用ReDoc主题时出错:', e);
          }
        }
      });
    </script>
  </body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlContent);
});

// 本地托管ReDoc脚本，解决CSP问题
app.get('/redoc-standalone.js', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/assets/js/redoc.standalone.js'));
});

// 设置静态文件目录，以便访问生成的静态ReDoc文档
app.use('/static-docs', express.static(path.join(__dirname, '../public/docs')));
// 设置静态文件目录，提供本地静态资源
app.use('/public', express.static(path.join(__dirname, '../public')));

// 为所有静态资源添加安全头信息
app.use('/static-docs', (req: Request, res: Response, next: NextFunction) => {
  // 设置内容安全策略
  res.setHeader('Content-Security-Policy', getBasicCSP());
  // 禁用HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  next();
});

app.use('/public', (req: Request, res: Response, next: NextFunction) => {
  // 设置内容安全策略
  res.setHeader('Content-Security-Policy', getBasicCSP());
  // 禁用HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  next();
});

// 处理favicon请求
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});

// 主API路由
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/userjobs', userJobRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/ai', aiRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: 健康检查端点
 *     description: 用于检查API服务是否正常运行
 *     tags: [系统]
 *     responses:
 *       200:
 *         description: 服务运行正常
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 message:
 *                   type: string
 *                   example: Server is running
 */
// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json(createApiResponse(200, 'Server is running', { status: 'UP' }));
});

// 404处理
app.use((req: Request, res: Response) => {
  const traceId = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.status(404).json(createApiResponse(
    404,
    `无法找到资源：${req.originalUrl}`,
    null,
    traceId as string
  ));
});

// 全局错误处理中间件
app.use(errorHandler);

export default app;