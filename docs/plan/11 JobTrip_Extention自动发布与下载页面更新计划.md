# JobTrip_Extention 自动发布与下载页面更新计划

## 背景与目标

目前，JobTrip浏览器扩展程序(JobTrip_Extention)使用一个固定的GitHub代码仓库下载链接。这种方式存在以下问题：

1. 每次下载的都是最新的开发代码，而非稳定版本
2. 无法提供版本化的发布管理
3. 前端下载页面无法显示和追踪最新版本号
4. 用户无法获取发布说明或了解新功能变更

为解决这些问题，本计划旨在实现以下目标：

1. 建立自动化的GitHub Release发布流程
2. 规范扩展程序的版本管理
3. 更新前端下载页面，显示最新版本信息和Release说明
4. 提供更稳定、清晰的下载体验

## 实施步骤

### 1. 创建GitHub Actions工作流

#### 1.1 创建工作流配置文件

在JobTrip_Extention仓库中创建以下文件：`.github/workflows/release-extension.yml`

```yaml
name: Release Extension

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build extension
        run: npm run build
        
      - name: Create ZIP file
        run: |
          cd dist || exit
          zip -r ../jobtrip-extension-${{ github.ref_name }}.zip *
          cd ..
          
      - name: Extract manifest version
        id: manifest
        run: |
          VERSION=$(node -p "require('./manifest.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          
      - name: Create Release
        id: create_release
        uses: softprops/action-gh-release@v1
        with:
          files: jobtrip-extension-${{ github.ref_name }}.zip
          name: JobTrip Extension v${{ steps.manifest.outputs.version }}
          draft: false
          prerelease: false
          generate_release_notes: true
```

#### 1.2 设置版本更新与标签创建脚本

创建自动更新版本号的npm脚本，添加到`package.json`：

```json
"scripts": {
  "version:patch": "npm version patch && node scripts/update-manifest-version.js",
  "version:minor": "npm version minor && node scripts/update-manifest-version.js",
  "version:major": "npm version major && node scripts/update-manifest-version.js"
}
```

#### 1.3 创建manifest版本同步脚本

创建`scripts/update-manifest-version.js`：

```javascript
const fs = require('fs');
const path = require('path');

// 读取package.json获取新版本号
const packageJson = require('../package.json');
const newVersion = packageJson.version;

// 更新manifest.json的版本号
const manifestPath = path.join(__dirname, '../manifest.json');
const manifest = require(manifestPath);
manifest.version = newVersion;

// 写回manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`Updated manifest.json version to ${newVersion}`);
```

### 2. 更新ChromeExtensionPage.tsx页面

#### 2.1 修改下载组件

更新`frontend/src/pages/ChromeExtensionPage.tsx`中的下载部分，添加动态版本信息和Release Notes链接：

```jsx
// 添加状态和useEffect
const [latestVersion, setLatestVersion] = useState('1.0.0');
const [releaseUrl, setReleaseUrl] = useState('');
const [downloadUrl, setDownloadUrl] = useState('');

useEffect(() => {
  // 获取最新release信息
  fetch('https://api.github.com/repos/DravenTJU/Job-Trip/releases/latest')
    .then(response => response.json())
    .then(data => {
      if (data.tag_name) {
        setLatestVersion(data.tag_name.replace('v', ''));
        setReleaseUrl(data.html_url);
        // 获取zip资源的下载URL
        const zipAsset = data.assets.find(asset => asset.name.endsWith('.zip'));
        if (zipAsset) {
          setDownloadUrl(zipAsset.browser_download_url);
        }
      }
    })
    .catch(error => {
      console.error('获取发布信息失败:', error);
      // 设置默认下载链接，以防API请求失败
      setDownloadUrl('https://github.com/DravenTJU/Job-Trip/releases/latest/download/jobtrip-extension.zip');
    });
}, []);
```

#### 2.2 更新下载区域UI

```jsx
{/* 下载区域 */}
<div className="w-fit bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
  <div className="flex flex-col md:flex-row items-center justify-start">
    <div className="flex items-center mb-4 md:mb-0">
      <Chrome className="w-12 h-12 text-indigo-600 mr-4" />
      <div>
        <h2 className="title-sm">Chrome 浏览器扩展插件</h2>
        <p className="text-description">版本 {latestVersion}</p>
        {releaseUrl && (
          <a 
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 block"
          >
            查看发布说明
          </a>
        )}
      </div>
    </div>
    <a 
      href={downloadUrl || "https://github.com/DravenTJU/Job-Trip/releases/latest/download/jobtrip-extension.zip"} 
      download 
      className="md:ml-8"
    >
      <button className="btn btn-primary">
        <Download className="w-4 h-4 mr-2" />
        下载扩展程序
      </button>
    </a>
  </div>
</div>
```

#### 2.3 添加必要的导入和类型

```jsx
import React, { useState, useEffect } from 'react';
import { Download, Chrome, ... } from 'lucide-react';
```

### 3. 建立发布流程文档

为团队成员创建README说明，解释新的发布流程：

#### 3.1 创建发布指南

在JobTrip_Extention仓库中更新`README.md`，添加发布指南部分：

```markdown
## 发布流程

要发布新版本的扩展程序，请遵循以下步骤：

1. 确保所有更改已提交到主分支
2. 使用版本更新命令之一来更新版本号：
   ```bash
   npm run version:patch  # 修复bug或小改动 (1.0.0 -> 1.0.1)
   npm run version:minor  # 添加新功能但向后兼容 (1.0.0 -> 1.1.0)
   npm run version:major  # 重大更改或不兼容更新 (1.0.0 -> 2.0.0)
   ```
3. 推送代码和标签到GitHub：
   ```bash
   git push && git push --tags
   ```
4. GitHub Actions将自动构建扩展并创建新的Release

注意：版本号会自动同步到manifest.json文件中。
```

### 4. 本地测试和生成初始版本

在提交到仓库前进行本地测试，确保发布流程正常工作：

#### 4.1 添加版本管理脚本

```bash
npm init -y  # 如果package.json不存在
npm install --save-dev semver  # 版本号管理库
```

#### 4.2 创建初始标签

```bash
git tag -a v1.0.0 -m "初始版本"
git push origin v1.0.0
```

### 5. 部署到生产环境

#### 5.1 更新前端页面

将修改后的`ChromeExtensionPage.tsx`部署到前端应用。

#### 5.2 验证自动化流程

推送标签并确认GitHub Actions正确触发，生成Release和下载文件。

#### 5.3 测试下载功能

验证前端页面能够正确获取最新版本信息并提供可用的下载链接。

## 实施清单

1. [配置GitHub仓库]
   - [ ] 创建`.github/workflows/`目录
   - [ ] 添加`release-extension.yml`工作流配置文件
   - [ ] 添加GitHub Secrets (如果需要)

2. [版本管理脚本]
   - [ ] 创建`scripts/`目录
   - [ ] 添加`update-manifest-version.js`脚本
   - [ ] 更新`package.json`添加版本更新命令

3. [前端更新]
   - [ ] 修改`ChromeExtensionPage.tsx`添加动态版本信息
   - [ ] 添加Release Notes链接
   - [ ] 更新下载链接使用GitHub Release资源URL

4. [文档更新]
   - [ ] 更新`README.md`添加发布指南
   - [ ] 添加版本历史记录部分

5. [发布初始版本]
   - [ ] 初始化package.json（如果不存在）
   - [ ] 确保manifest.json的版本号正确
   - [ ] 创建并推送初始版本标签v1.0.0

6. [测试和验证]
   - [ ] 在本地测试发布流程
   - [ ] 验证GitHub Actions正确执行
   - [ ] 测试前端页面显示版本信息
   - [ ] 确认下载链接可用并下载正确的扩展文件

## 注意事项

1. 需要确保JobTrip_Extention仓库具有正确的`build`脚本，能够生成有效的扩展程序文件
2. 需要确认GitHub Actions有权限创建Release和上传文件
3. 前端页面的GitHub API请求可能会受到限率的影响，应考虑添加错误处理和退避策略
4. 需要确保manifest.json的版本号与package.json保持同步

## 实施检查清单:
1. 创建GitHub Actions工作流配置文件(.github/workflows/release-extension.yml)
2. 添加版本更新脚本(scripts/update-manifest-version.js)
3. 更新package.json添加版本管理命令
4. 修改ChromeExtensionPage.tsx添加动态版本显示
5. 修改ChromeExtensionPage.tsx更新下载链接使用GitHub Release资源
6. 修改ChromeExtensionPage.tsx添加发布说明链接
7. 更新README.md添加发布流程指南
8. 初始化仓库package.json(如需)
9. 创建初始版本标签并推送
10. 验证GitHub Actions工作流成功执行
11. 验证前端页面显示正确的版本信息
12. 测试下载链接功能 