
[模式:计划][模型:Claude 3.7 Sonnet]

# 简历预览与PDF下载功能实施计划

## 1. 整体架构

### 1.1 新增文件结构
```
backend/
  ├── src/
  │   ├── services/
  │   │   └── resumeRenderService.ts    // 处理模板渲染和PDF生成
  │   ├── controllers/
  │   │   └── resumeRenderController.ts // HTML预览和PDF下载控制器
  │   ├── routes/
  │   │   └── resumeRenderRoutes.ts     // 新API路由定义
  │   └── templates/
  │       └── resume-template.html      // 存储Handlebars模板
frontend/
  ├── src/
  │   ├── services/
  │   │   └── resumeExportService.ts    // 前端导出服务
  │   └── components/
  │       └── resume/
  │           └── ResumeExportModal.tsx // 导出选项模态框
```

### 1.2 修改数据模型
修改`resumeModel.ts`以适配模板期望的结构：

```typescript
// 保持原有基本字段，修改content内容结构期望
export interface IResumeContent {
  name: string;
  phone: string;
  email: string;
  education: {
    institutionName: string;
    degree: string;
    major: string;
    graduationDate: string;
    location: string;
    gpa?: string;
    relevantCourses?: string;
    achievements?: string[];
  }[];
  skills: {
    programmingLanguages: string;
    technologies: string;
  };
  experiences: {
    companyName: string;
    teamName?: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    responsibilities: string[];
  }[];
  projects: {
    name: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
}
```

## 2. 后端实现

### 2.1 resumeRenderService.ts
```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { IResume } from '../models/resumeModel';

// 浏览器实例管理
let browserInstance: puppeteer.Browser | null = null;

export const resumeRenderService = {
  // 初始化服务
  init: async () => {
    // 启动浏览器实例并保持运行
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // 处理进程退出时关闭浏览器
      process.on('exit', async () => {
        if (browserInstance) {
          await browserInstance.close();
        }
      });
    }
    return browserInstance;
  },

  // 加载并编译模板
  getTemplate: () => {
    const templatePath = path.resolve(__dirname, '../templates/resume-template.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(templateSource);
  },

  // 渲染HTML
  renderHTML: (resume: IResume): string => {
    const template = resumeRenderService.getTemplate();
    const resumeData = JSON.parse(resume.content);
    
    return template(resumeData);
  },

  // 生成PDF
  generatePDF: async (resume: IResume): Promise<Buffer> => {
    // 确保浏览器实例存在
    const browser = await resumeRenderService.init();
    
    // 渲染HTML
    const html = resumeRenderService.renderHTML(resume);
    
    // 在新页面中加载HTML
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // 配置PDF选项
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    // 关闭页面（但保持浏览器实例）
    await page.close();
    
    return pdfBuffer;
  }
};

export default resumeRenderService;
```

### 2.2 resumeRenderController.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import Resume from '../models/resumeModel';
import { AppError } from '../utils/AppError';
import resumeRenderService from '../services/resumeRenderService';

/**
 * @desc    预览简历HTML
 * @route   GET /api/v1/resumes/:id/preview
 * @access  私有
 */
export const previewResumeHTML = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 查找简历 - 确保只能查看自己的简历
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    // 渲染HTML
    const html = resumeRenderService.renderHTML(resume);
    
    // 返回HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('生成简历HTML预览失败:', error);
    next(new AppError(`预览生成失败: ${error.message}`, 500));
  }
};

/**
 * @desc    下载简历PDF
 * @route   GET /api/v1/resumes/:id/pdf
 * @access  私有
 */
export const downloadResumePDF = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 查找简历 - 确保只能下载自己的简历
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    // 生成PDF
    const pdfBuffer = await resumeRenderService.generatePDF(resume);
    
    // 设置响应头
    const fileName = `${resume.name.replace(/\s+/g, '_')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // 发送PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('生成简历PDF失败:', error);
    next(new AppError(`PDF生成失败: ${error.message}`, 500));
  }
};
```

### 2.3 resumeRenderRoutes.ts
```typescript
import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  previewResumeHTML,
  downloadResumePDF
} from '../controllers/resumeRenderController';

const router = express.Router();

// 保护所有路由，需要登录
router.use(protect);

// 预览简历HTML
router.get('/:id/preview', previewResumeHTML);

// 下载简历PDF
router.get('/:id/pdf', downloadResumePDF);

export default router;
```

### 2.4 路由集成到主应用
修改`app.ts`或相应的主应用文件：

```typescript
import resumeRenderRoutes from './routes/resumeRenderRoutes';

// 添加到现有路由
app.use('/api/v1/resumes', resumeRenderRoutes);
```

## 3. 前端实现

### 3.1 resumeExportService.ts
```typescript
import api from './api';

const resumeExportService = {
  // 获取简历HTML预览URL
  getResumePreviewUrl: (resumeId: string): string => {
    return `/api/v1/resumes/${resumeId}/preview`;
  },
  
  // 下载简历PDF
  downloadResumePDF: async (resumeId: string): Promise<void> => {
    try {
      // 获取认证令牌
      const token = localStorage.getItem('token');
      
      // 创建下载链接
      const downloadUrl = `/api/v1/resumes/${resumeId}/pdf`;
      
      // 打开新窗口进行下载
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('下载简历PDF失败:', error);
      throw error;
    }
  }
};

export default resumeExportService;
```

### 3.2 ResumeExportModal.tsx
```tsx
import React from 'react';
import { FileText, Download } from 'lucide-react';
import resumeExportService from '@/services/resumeExportService';
import { useTranslation } from 'react-i18next';

interface ResumeExportModalProps {
  resumeId: string;
  resumeName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResumeExportModal: React.FC<ResumeExportModalProps> = ({
  resumeId,
  resumeName,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation('resume');
  
  if (!isOpen) return null;
  
  // 获取预览URL
  const previewUrl = resumeExportService.getResumePreviewUrl(resumeId);
  
  // 处理PDF下载
  const handleDownloadPDF = async () => {
    try {
      await resumeExportService.downloadResumePDF(resumeId);
    } catch (error) {
      console.error('下载PDF失败:', error);
      // 这里可以添加错误提示
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t('export_resume', '导出简历')} - {resumeName}
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <a 
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 transition-colors"
            >
              <FileText className="w-5 h-5" />
              {t('preview_html', '在浏览器中预览简历')}
            </a>
            
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300 transition-colors"
            >
              <Download className="w-5 h-5" />
              {t('download_pdf', '下载PDF格式简历')}
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            {t('close', '关闭')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeExportModal;
```

### 3.3 集成到ResumeBuilderPage.tsx
修改现有的`ResumeBuilderPage.tsx`文件：

```tsx
// 添加导入
import ResumeExportModal from '@/components/resume/ResumeExportModal';

// 添加状态
const [showExportModal, setShowExportModal] = useState(false);
const [resumeToExport, setResumeToExport] = useState<Resume | null>(null);

// 添加处理函数
const handleExportResume = (resume: Resume) => {
  setResumeToExport(resume);
  setShowExportModal(true);
};

// 在按钮区域添加
<button 
  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
  onClick={() => handleExportResume(resume)}
>
  <FileExport className="w-4 h-4" />
  {t('export', '导出')}
</button>

// 在组件末尾添加模态框
{showExportModal && resumeToExport && (
  <ResumeExportModal
    resumeId={resumeToExport._id}
    resumeName={resumeToExport.name}
    isOpen={showExportModal}
    onClose={() => setShowExportModal(false)}
  />
)}
```

## 4. 前端表单适配

### 4.1 修改ResumeFormPage.tsx中的数据结构
修改数据处理逻辑，适配新的结构要求：

```typescript
// 提交表单时的数据转换
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 从表单收集数据
  const resumeContent = {
    name: (document.getElementById('fullName') as HTMLInputElement)?.value || '',
    email: (document.getElementById('email') as HTMLInputElement)?.value || '',
    phone: (document.getElementById('phone') as HTMLInputElement)?.value || '',
    
    // 转换教育信息
    education: educations.map(edu => ({
      institutionName: edu.school,
      degree: edu.education,
      major: edu.major,
      graduationDate: edu.endDate,
      location: '',  // 需要在表单中添加此字段
      achievements: []  // 可选，需要在表单中添加
    })),
    
    // 转换技能信息
    skills: {
      programmingLanguages: (document.getElementById('programmingLanguages') as HTMLTextAreaElement)?.value || '',
      technologies: (document.getElementById('technologies') as HTMLTextAreaElement)?.value || ''
    },
    
    // 转换工作经历
    experiences: workExperiences.map(exp => ({
      companyName: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: '',  // 需要在表单中添加此字段
      responsibilities: exp.responsibilities.split('\n').filter(item => item.trim() !== '')
    })),
    
    // 项目信息（可选，需要添加到表单中）
    projects: []
  };
  
  // ...提交表单逻辑
}
```

### 4.2 添加必要的表单字段
在教育背景和工作经历部分添加"位置"字段：

```tsx
// 在教育背景部分添加
<div className="mb-2">
  <label htmlFor={`eduLocation-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location', '所在地')}</label>
  <input
    type="text"
    id={`eduLocation-${index}`}
    name={`eduLocation-${index}`}
    className="form-input"
    value={education.location || ''}
    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
    placeholder={t('location_placeholder', '学校所在地')}
  />
</div>

// 在工作经历部分添加
<div className="mb-2">
  <label htmlFor={`workLocation-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location', '工作地点')}</label>
  <input
    type="text"
    id={`workLocation-${index}`}
    name={`workLocation-${index}`}
    className="form-input"
    value={experience.location || ''}
    onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
    placeholder={t('work_location_placeholder', '工作地点')}
  />
</div>

// 在技能部分修改为两个字段
<div className="mb-4">
  <label htmlFor="programmingLanguages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('programming_languages', '编程语言')}</label>
  <textarea
    id="programmingLanguages"
    name="programmingLanguages"
    className="form-textarea"
    rows={2}
    placeholder={t('programming_languages_placeholder', '例如: JavaScript, TypeScript, Python')}
  />
</div>

<div className="mb-4">
  <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('technologies', '技术与框架')}</label>
  <textarea
    id="technologies"
    name="technologies"
    className="form-textarea"
    rows={2}
    placeholder={t('technologies_placeholder', '例如: React, Node.js, MongoDB')}
  />
</div>
```

## 5. 安装依赖与配置

```bash
# 安装后端依赖
cd backend
npm install handlebars puppeteer

# 复制模板文件
mkdir -p src/templates
cp docs/plan/resume/resume-template.html src/templates/
```

## 6. 服务器配置

确保服务器上安装了Puppeteer所需的依赖：

```bash
# 在Ubuntu/Debian上
apt-get update && apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
  libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
  xdg-utils wget
```

## 实施检查清单:
1. 创建resumeRenderService.ts服务
2. 创建resumeRenderController.ts控制器
3. 创建resumeRenderRoutes.ts路由
4. 集成路由到主应用
5. 创建resumeExportService.ts前端服务
6. 创建ResumeExportModal.tsx组件
7. 修改ResumeBuilderPage.tsx添加导出选项
8. 修改ResumeFormPage.tsx适配新数据结构
9. 安装后端依赖(handlebars, puppeteer)
10. 复制HTML模板到服务器
11. 配置服务器Puppeteer依赖
12. 测试HTML预览功能
13. 测试PDF下载功能
14. 调整模板样式(可选)
