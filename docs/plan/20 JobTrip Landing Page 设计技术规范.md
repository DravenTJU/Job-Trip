
[模式:计划][模型:Claude 3.7 Sonnet]

# JobTrip Landing Page 设计技术规范

## 1. 概述

本文档详细规划JobTrip网站的landing page设计与实现，整合已有设计风格，并支持多语言和暗色模式。

### 1.1 设计目标

- 展示JobTrip的核心价值与功能
- 保持与登录界面一致的设计语言
- 支持三种语言：英文、简体中文、繁体中文
- 完全适配明/暗两种模式
- 响应式设计，确保在桌面和移动设备上有良好体验

## 2. 页面结构设计

### 2.1 组件层次结构

```
LandingPage/
├── Navbar/
├── HeroBanner/
├── ClientLogos/
├── FeatureSections/
│   ├── ChromeExtension/
│   ├── JobListSection/
│   ├── ApplicationTracking/
│   ├── ProfileSection/
│   ├── ResumeBuilder/
│   ├── CoverLetterAI/
├── Testimonial/
├── CTASection/
├── Footer/
```

### 2.2 页面布局与组件详情

#### 2.2.1 Navbar组件

- 左侧Logo
- 中部导航链接
- 右侧语言切换与登录/注册按钮
- 支持滚动时背景变化效果

#### 2.2.2 HeroBanner组件

- 左侧：标题、副标题、主按钮、次按钮
- 右侧：Job-Trip界面预览图
- 背景：渐变彩色方块装饰

#### 2.2.3 ClientLogos组件

- 5-8个合作伙伴/知名企业logo
- 灰度处理，保持统一视觉

#### 2.2.4 核心功能展示组件（每节交替左右布局）

1. **ChromeExtension**
   - 标题：一键安装，便捷抓取
   - 特性介绍：自动从LinkedIn、Seek、Indeed抓取职位信息
   - 图片：Chrome扩展使用界面截图
   - 按钮：立即安装

2. **JobListSection**
   - 标题：统一管理，一目了然
   - 特性介绍：集中浏览所有职位信息
   - 图片：职位列表界面
   - 按钮：查看职位

3. **ApplicationTracking**
   - 标题：看板追踪，进度清晰
   - 特性介绍：拖拽管理申请状态
   - 图片：Kanban看板界面
   - 按钮：开始追踪

4. **ProfileSection**
   - 标题：个人档案，一次维护
   - 特性介绍：集中管理个人信息
   - 图片：个人档案表单界面
   - 按钮：完善资料

5. **ResumeBuilder**
   - 标题：智能简历，一键生成
   - 特性介绍：基于职位和个人信息自动生成
   - 图片：简历生成界面
   - 按钮：制作简历

6. **CoverLetterAI**
   - 标题：AI求职信，多语言支持
   - 特性介绍：根据职位智能生成中英文求职信
   - 图片：求职信编辑界面
   - 按钮：生成求职信

#### 2.2.5 Testimonial组件

- 用户头像、姓名、职位
- 引用格式的用户评价
- 卡片式设计

#### 2.2.6 CTASection组件

- 主标题：开始你的求职之旅
- 副标题：简短激励文案
- 主按钮：立即注册
- 次按钮：了解更多

#### 2.2.7 Footer组件

- Logo与版权信息
- 导航链接
- 社交媒体图标
- 隐私政策与条款链接

## 3. 技术实现详情

### 3.1 文件结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── ClientLogos.tsx
│   │   │   ├── FeatureSection.tsx
│   │   │   ├── Testimonial.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── Footer.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   ├── public/
│   │   ├── locales/
│   │   │   ├── en-US/
│   │   │   │   ├── landing.json
│   │   │   ├── zh-CN/
│   │   │   │   ├── landing.json
│   │   │   ├── zh-TW/
│   │   │   │   ├── landing.json
```

### 3.2 核心组件实现

#### 3.2.1 LandingPage.tsx 主框架

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import ClientLogos from '@/components/landing/ClientLogos';
import FeatureSection from '@/components/landing/FeatureSection';
import Testimonial from '@/components/landing/Testimonial';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const LandingPage: React.FC = () => {
  const { t } = useTranslation('landing');
  
  const features = [
    {
      id: 'chrome-extension',
      title: t('features.extension.title'),
      description: t('features.extension.description'),
      imageUrl: '/assets/images/landing/chrome-extension.png',
      buttonText: t('features.extension.button'),
      buttonLink: '/download',
      imagePosition: 'right'
    },
    // ... 其他5个功能区块配置
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <HeroBanner />
      <ClientLogos />
      
      <div className="py-12 md:py-20">
        {features.map((feature, index) => (
          <FeatureSection 
            key={feature.id}
            {...feature}
            imagePosition={index % 2 === 0 ? 'right' : 'left'}
          />
        ))}
      </div>
      
      <Testimonial />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
```

#### 3.2.2 HeroBanner.tsx 实现

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  const { t } = useTranslation('landing');
  
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* 装饰性方块背景 */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-lg opacity-80 ${getRandomColorClass()} ${getRandomSize()} ${getRandomPosition()}`}
          />
        ))}
      </div>
      
      <div className="container-lg relative z-10 pt-20 pb-16 md:py-28">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1 mb-12 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {t('hero.primaryButton')}
              </Link>
              <Link 
                to="/download" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {t('hero.secondaryButton')}
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-1">
              <img 
                src="/assets/images/landing/dashboard-preview.png" 
                alt="JobTrip Dashboard" 
                className="w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 生成随机样式的辅助函数
const getRandomColorClass = () => {
  const colors = [
    'bg-blue-200 dark:bg-blue-900/40',
    'bg-indigo-200 dark:bg-indigo-900/40',
    'bg-purple-200 dark:bg-purple-900/40',
    'bg-pink-200 dark:bg-pink-900/40',
    'bg-green-200 dark:bg-green-900/40',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomSize = () => {
  const sizes = ['w-20 h-20', 'w-24 h-24', 'w-16 h-16', 'w-32 h-32'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const getRandomPosition = () => {
  return `top-${Math.floor(Math.random() * 40)} left-${Math.floor(Math.random() * 80)}`;
};

export default HeroBanner;
```

#### 3.2.3 FeatureSection.tsx 实现

```typescript
import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  imagePosition: 'left' | 'right';
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  imagePosition
}) => {
  return (
    <div className="py-16 container-lg">
      <div className={`flex flex-col ${imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center gap-12`}>
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {description}
          </p>
          <Link
            to={buttonLink}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
        <div className="flex-1">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-1">
            <img
              src={imageUrl}
              alt={title}
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
```

## 4. 多语言与暗色模式支持

### 4.1 多语言支持实现

创建翻译文件：

1. `frontend/public/locales/en-US/landing.json`
2. `frontend/public/locales/zh-CN/landing.json`
3. `frontend/public/locales/zh-TW/landing.json`

英文翻译文件内容示例：

```json
{
  "meta": {
    "title": "JobTrip - Your AI-Powered Job Application Assistant",
    "description": "Simplify your job hunt with Chrome automation, intelligent resume builder, and one-click tracking"
  },
  "nav": {
    "features": "Features",
    "about": "About",
    "pricing": "Pricing",
    "login": "Log in",
    "signup": "Sign up"
  },
  "hero": {
    "title": "Your One-Stop AI-Powered Job Application Assistant",
    "subtitle": "Simplify your job hunt with Chrome automation, intelligent resume builder, and one-click tracking.",
    "primaryButton": "Try JobTrip Now",
    "secondaryButton": "Install Chrome Extension"
  },
  "features": {
    "extension": {
      "title": "Install Chrome Extension",
      "description": "Automatically capture job information from LinkedIn, Seek, and Indeed to boost efficiency.",
      "button": "Download Extension"
    },
    "jobList": {
      "title": "Browse Job Listings",
      "description": "View jobs captured automatically or added manually in one centralized location.",
      "button": "View Job List"
    },
    "tracking": {
      "title": "Track Application Status",
      "description": "Drag-and-drop kanban board to manage your application progress from applied to hired.",
      "button": "Track Jobs"
    },
    "profile": {
      "title": "Complete Your Profile",
      "description": "Maintain education, work experience, and skills in one place to power other features.",
      "button": "Edit Profile"
    },
    "resume": {
      "title": "Generate Targeted Resumes",
      "description": "One-click resume templates tailored to specific positions to increase interview chances.",
      "button": "Create Resume"
    },
    "coverLetter": {
      "title": "AI Personalized Cover Letters",
      "description": "Paste job details, and AI generates high-quality cover letters in English and Chinese.",
      "button": "Generate Cover Letter"
    }
  },
  "testimonial": {
    "text": "I was amazed at how quickly and efficiently this tool organized my job search. It's saved me countless hours tracking applications and following up with companies. I can't imagine my job search without it!",
    "author": "Sarah Johnson",
    "position": "Software Engineer"
  },
  "cta": {
    "title": "Start Your Job Search Journey Today",
    "subtitle": "Join thousands of job seekers who have simplified their application process",
    "button": "Get Started For Free"
  },
  "footer": {
    "copyright": "© 2025 JobTrip. All rights reserved.",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "contact": "Contact Us"
  }
}
```

### 4.2 暗色模式适配

全局暗色模式切换组件（`frontend/src/components/common/ThemeToggle.tsx`）：

```typescript
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
```

## 5. 路由配置

更新路由配置（`frontend/src/routes/index.tsx`）：

```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
// ... 其他导入

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* ... 其他路由 */}
    </Routes>
  );
};

export default AppRoutes;
```

## 6. 图片资源需求

1. 创建以下目录结构：
   ```
   frontend/public/assets/images/landing/
   ```

2. 准备以下图片资源：
   - `dashboard-preview.png`（Hero区域展示图）
   - `chrome-extension.png`（扩展功能截图）
   - `job-list.png`（职位列表截图）
   - `kanban-board.png`（看板追踪截图）
   - `profile-form.png`（个人资料截图）
   - `resume-builder.png`（简历生成截图）
   - `cover-letter.png`（求职信截图）
   - `company-logos/`（各公司logo）
   - `testimonial-avatar.jpg`（用户头像）

## 实施检查清单:
1. 安装所需NPM包：heroicons/react、react-spring等动效库
2. 创建landing目录和组件文件结构
3. 在routes/index.tsx中添加LandingPage路由
4. 创建Landing Page主框架文件LandingPage.tsx
5. 实现Navbar组件，包含语言切换和主题切换功能
6. 实现HeroBanner组件，添加动态装饰方块背景
7. 实现ClientLogos组件，展示合作伙伴/企业标志
8. 实现FeatureSection组件，用于各功能模块展示
9. 实现Testimonial组件，展示用户评价
10. 实现CTASection组件，添加主要行动号召
11. 实现Footer组件，包含版权和链接信息
12. 准备并放置所有必要的图片资源
13. 创建英文(en-US)翻译文件landing.json
14. 创建简体中文(zh-CN)翻译文件landing.json
15. 创建繁体中文(zh-TW)翻译文件landing.json
16. 测试页面在亮色/暗色模式下的显示效果
17. 测试页面在三种语言下的显示效果
18. 测试页面在桌面和移动设备上的响应式布局
19. 优化首屏加载性能，确保图片资源适当压缩
20. 进行无障碍性(a11y)检查和优化
