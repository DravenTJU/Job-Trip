# jobtrip Browser Extension

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)


![intruoduction](https://github.com/user-attachments/assets/46e03815-69ff-475d-9d99-52d5faa215d3)

A browser extension designed to streamline your job search by scraping job listings from various platforms and potentially integrating with the jobtrip service. This tool helps you gather and manage job application information efficiently.

## Attention
- You need to run jobtrip service (e.g.: http://localhost:3000/ ) before you can use this extension to use web crawler normally, otherwise it won't work properly.

## ⚠️ Important Disclaimer

This extension uses web scraping to collect job information. Please be mindful of the following:

-   **Rate Limiting**: Excessive scraping can overload job site servers and may lead to temporary or permanent IP blocks.
    -   Use the extension moderately, mimicking normal browsing behavior.
    -   Avoid running rapid, automated searches across many pages.
-   **Terms of Service**: Automated scraping may violate the terms of service of the job platforms you visit.
    -   Use this tool responsibly and ethically.
    -   This extension is intended for personal, non-commercial use.
-   **Data Accuracy**: Job details can change frequently.
    -   Always verify information directly on the original job posting page.
    -   Scraped data accuracy cannot be guaranteed due to potential website structure changes or listing updates.
-   **Site Changes**: Job platforms often update their website layouts, which can break the scraping functionality.
    -   The extension may require updates to adapt to these changes. Please report any issues you encounter.

## Features

### Core Functionality

-   **Job Scraping**: Extracts job details from search result pages and potentially individual job pages.
-   **Side Panel UI**: Provides an interface within the browser's side panel to manage and view scraped jobs.
-   **Background Processing**: Handles communication between components and fetches job detail page content when needed.

### Supported Platforms (Primary)

-   **LinkedIn**: Extracts job listings from `linkedin.com/jobs`.
-   **SEEK**: Supports `seek.com.au` (Australia) and `seek.co.nz` (New Zealand).
-   **Indeed**: Extracts jobs from various regional Indeed sites (e.g., `.com`, `.com.au`, `.co.nz`, `.co.uk`, `.ca`).

*(Note: The extension manifest includes permissions for Reed.co.uk and Workopolis.com, but scraping functionality for these might be experimental or incomplete.)*

### Data Extraction

The extension attempts to extract the following details (availability may vary by platform and listing):

-   Title (Job Title)
-   Company (Company Name)
-   Location
-   Description (Job Description Snippet / Full)
-   Salary  (when available)
-   Job Type (Full-time, Part-time, Contract, etc.)
-   SourceId (Job ID, aunique identifier for the job listing)
-   SourceUrl (Direct URL to the Job Posting)
-   Platform (linkedin, indeed, seek)
-   CreatedAt (Date Posted)
-   UpdatedAt (timestamp for when the job was last updated)

### Potential Integration

-   **jobtrip Sync**: The extension includes components suggesting the ability to sync scraped job data with the jobtrip service or a local backend instance. *(Verification of current sync status recommended)*.

## How to Use

1.  **Installation**
    -   Download or clone the extension's source code.
    -   Open Google Chrome and navigate to `chrome://extensions/`.
    -   Enable "Developer mode" (usually a toggle in the top-right corner).
    -   Click "Load unpacked" and select the directory containing the extension's `manifest.json` file (the `jobtrip_Extention` folder).

2.  **Login**:
    -   Make sure you are logged into your account on the job platform(s) you intend to search (e.g., LinkedIn, SEEK, Indeed).
    -   Note: Indeed may require human verification before scraping

3.  **Job Search**
    -   Navigate to a supported job platform (LinkedIn Jobs, SEEK, Indeed).
    -   Perform a job search as usual.
      


4.  **Scraping & Managing Jobs**
    -   Click the jobtrip extension icon in your browser toolbar. This should open the Side Panel.
    -   Use the controls within the Side Panel to initiate scraping for the current page.
    -   View scraped jobs within the Side Panel.
    <img src="https://github.com/user-attachments/assets/8847cdeb-640f-476e-aa41-65bed3ec8b30" width="500" />

    
5. **Manage jobs**
    - Save/synchronise jobs to jobtrip using the sidebar option (Export Job Results By API).
    <img src="https://github.com/user-attachments/assets/9cc998e4-7841-4701-b95d-943641c0412f" width="500" />

    - Save jobs as Json file locally using sidebar option (Export Job Results).
    <img src="https://github.com/user-attachments/assets/3ef1f0a8-de0b-480c-b0d3-de3d799d6fdd" width="500" />

6. **Job details**
    - Tap View job to go to the job details page.
      
## Supported Platforms (Details)

-   LinkedIn (`linkedin.com/jobs/*`)
-   SEEK (`seek.com.au/*`, `seek.co.nz/*`)
-   Indeed (`indeed.com/*`, `*.indeed.com/*`)
-   *(Potential experimental support for `reed.co.uk/*`, `workopolis.com/*`)*

## Privacy & Security

-   The extension requests permissions necessary for its functionality (accessing tabs, storage, scripting on specific sites).
-   It primarily scrapes publicly available data from job sites.
-   Review the `host_permissions` in `manifest.json` for the list of sites the extension can interact with.
-   If syncing with jobtrip, data transmission security depends on the service's implementation (likely HTTPS).

## Development

### Prerequisites

-   Google Chrome Browser
-   Basic knowledge of JavaScript, HTML, CSS, and Chrome Extension APIs (Manifest V3).
-   Node.js and npm/yarn might be required if there are build steps or dependencies managed via package managers (check for `package.json`).

### Local Development Setup

1.  Ensure you have the prerequisites installed.
2.  Clone the repository: `git clone <repository-url>`
3.  Load the extension in Chrome using "Load unpacked" as described in the Installation section.
4.  Make changes to the code. Reload the extension in `chrome://extensions/` to see updates (content scripts might require refreshing the target page).

### Testing

This project uses [Jest](https://jestjs.io/) for unit testing. Tests are located in the `JobTrip_Extention/tests/` directory.

To run the tests, use the following command in your terminal:

```bash
npm test
```

The tests cover various parts of the extension, including:
- Service modules (`src/services/`)
- Background script logic (`background.js`)
- Content script message handling and specific functionalities (`content.js`)
- Panel script logic and UI interactions (`panel.js`)

Ensure that all tests pass before committing changes or creating a pull request.

### Release Process

To publish a new version of the extension, follow these steps:

1. Ensure all changes have been committed to the main branch
2. Use one of the version update commands to update the version number:
   ```bash
   npm run version:patch  # For bug fixes or small changes (1.0.0 -> 1.0.1)
   npm run version:minor  # For new features with backward compatibility (1.0.0 -> 1.1.0)
   npm run version:major  # For major changes or breaking updates (1.0.0 -> 2.0.0)
   ```
3. Push the code and tags to GitHub:
   ```bash
   git tag -a <tag-name> -m 'Release version'
   git push origin <tag-name>
   ```
4. GitHub Actions will automatically build the extension and create a new Release

Note: The version number will automatically be synchronized between package.json and manifest.json.

### Contribution

(Standard contribution steps - kept from original)
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# jobtrip 浏览器扩展

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)


这是一个浏览器扩展，旨在通过从各种平台抓取职位信息并可能与 jobtrip 服务集成来简化您的求职过程。该工具帮助您高效地收集和管理求职申请信息。

## 注意
- 需要先運行jobtrip服务(如: http://localhost:3000/ )，才能正常使用本扩展使用网络爬虫，否则无法正常使用。

## ⚠️ 重要免责声明

本扩展使用网络爬虫来收集职位信息。请注意以下几点：

-   **速率限制**：过度爬取可能会使求职网站服务器过载，并可能导致临时或永久性的 IP 封禁。
    -   适度使用扩展，模拟正常的浏览行为。
    -   避免在多个页面进行快速、自动化的搜索。
-   **服务条款**：自动爬取可能违反您访问的求职平台的服务条款。
    -   负责任且道德地使用此工具。
    -   本扩展仅供个人、非商业用途使用。
-   **数据准确性**：职位详情可能会频繁变化。
    -   始终在原始职位发布页面上直接验证信息。
    -   由于潜在的网站结构变化或职位更新，无法保证爬取数据的准确性。
-   **网站变更**：求职平台经常更新其网站布局，这可能会破坏爬取功能。
    -   扩展可能需要更新以适应这些变化。如遇到任何问题，请报告。

## 功能特点

### 核心功能

-   **职位爬取**：从搜索结果页面和可能的单个职位页面提取职位详情。
-   **侧边栏界面**：在浏览器的侧边栏中提供管理和查看爬取职位的界面。
-   **后台处理**：处理组件之间的通信，并在需要时获取职位详情页面内容。

### 支持的平台（主要）

-   **LinkedIn**：从 `linkedin.com/jobs` 提取职位列表。
-   **SEEK**：支持 `seek.com.au`（澳大利亚）和 `seek.co.nz`（新西兰）。
-   **Indeed**：从各个地区的 Indeed 网站提取职位（例如 `.com`、`.com.au`、`.co.nz`、`.co.uk`、`.ca`）。

*（注意：扩展清单包含对 Reed.co.uk 和 Workopolis.com 的权限，但这些平台的爬取功能可能处于实验阶段或不完整。）*

### 数据提取

扩展尝试提取以下详细信息（可用性可能因平台和职位而异）：

-   标题（职位名称）
-   公司（公司名称）
-   地点
-   描述（职位描述片段/完整描述）
-   薪资（如有）
-   工作类型（全职、兼职、合同等）
-   SourceId（职位 ID，职位的唯一标识符）
-   SourceUrl（职位发布的直接链接）
-   平台（linkedin、indeed、seek）
-   CreatedAt（发布日期）
-   UpdatedAt（职位最后更新时间）

### 潜在集成

-   **jobtrip 同步**：扩展包含建议能够将爬取的职位数据与 jobtrip 服务或本地后端实例同步的组件。*（建议验证当前同步状态）*。

## 使用方法

1.  **安装**
    -   下载或克隆扩展的源代码。
    -   打开 Google Chrome 并导航到 `chrome://extensions/`。
    -   启用"开发者模式"（通常在右上角的开关）。
    -   点击"加载已解压的扩展程序"并选择包含扩展 `manifest.json` 文件的目录（`jobtrip_Extention` 文件夹）。

2.  **登录**：
    -   确保您已登录到您打算搜索的求职平台（例如 LinkedIn、SEEK、Indeed）。
    -   注意: Indeed可能需要先通過人類驗證才能爬取

3.  **职位搜索**
    -   导航到支持的求职平台（LinkedIn Jobs、SEEK、Indeed）。
    -   像往常一样进行职位搜索。

4.  **爬取职位**
    -   点击浏览器工具栏中的 jobtrip 扩展图标。这将打开侧边栏。
    -   使用侧边栏中的控件开始爬取当前页面。
    -   在侧边栏中查看爬取的职位。
      
5. **管理职位**
    -   使用侧边栏选项(Export Job Results By API)将职位保存/同步到 jobtrip。
    -   使用侧边栏选项(Export Job Results)将职位保存為Json file到本地。

6. **职位詳情**
    -   点选View job可进入职位详情页


## 支持的平台（详情）

-   LinkedIn（`linkedin.com/jobs/*`）
-   SEEK（`seek.com.au/*`、`seek.co.nz/*`）
-   Indeed（`indeed.com/*`、`*.indeed.com/*`）
-   *（可能实验性支持 `reed.co.uk/*`、`workopolis.com/*`）*

## 隐私与安全

-   扩展请求其功能所需的权限（访问标签页、存储、在特定网站上执行脚本）。
-   主要爬取求职网站上公开可用的数据。
-   查看 `manifest.json` 中的 `host_permissions` 了解扩展可以交互的网站列表。
-   如果与 jobtrip 同步，数据传输安全性取决于服务的实现（可能使用 HTTPS）。

## 开发

### 前提条件

-   Google Chrome 浏览器
-   JavaScript、HTML、CSS 和 Chrome 扩展 API（Manifest V3）的基本知识。
-   如果有构建步骤或通过包管理器管理的依赖项，可能需要 Node.js 和 npm/yarn（查看是否有 `package.json`）。

### 本地开发设置

1.  确保您已安装所有前提条件。
2.  克隆存储库：`git clone <repository-url>`
3.  按照安装部分所述，使用"加载未打包"在 Chrome 中加载扩展。
4.  修改代码。在 `chrome://extensions/` 中重新加载扩展以查看更新（内容脚本可能需要刷新目标页面）。

### 测试

本项目使用 [Jest](https://jestjs.io/) 进行单元测试。测试文件位于 `JobTrip_Extention/tests/` 目录下。

要运行测试，请在终端中使用以下命令：

```bash
npm test
```

测试覆盖了扩展的多个部分，包括：
- 服务模块 (`src/services/`)
- 后台脚本逻辑 (`background.js`)
- 内容脚本的消息处理和特定功能 (`content.js`)
- 面板脚本逻辑和用户界面交互 (`panel.js`)

在提交更改或创建拉取请求之前，请确保所有测试都通过。

### 发布流程

要发布扩展程序的新版本，请按照以下步骤操作：

1. 确保所有更改已提交到主分支
2. 使用版本更新命令之一来更新版本号：
   ```bash
   npm run version:patch  # 修复bug或小改动 (1.0.0 -> 1.0.1)
   npm run version:minor  # 添加新功能但向后兼容 (1.0.0 -> 1.1.0)
   npm run version:major  # 重大更改或不兼容更新 (1.0.0 -> 2.0.0)
   ```
3. 推送代码和标签到GitHub：
   ```bash
   git tag -a <tag-name> -m '发布版本'
   git push origin <tag-name>
   ```
4. GitHub Actions将自动构建扩展并创建新的Release

注意：版本号会自动同步到manifest.json文件中。

### 贡献

（标准贡献步骤 - 从原始版本保留）
1.  Fork 仓库。
2.  创建您的功能分支（`git checkout -b feature/AmazingFeature`）。
3.  提交您的更改（`git commit -m 'Add some AmazingFeature'`）。
4.  推送到分支（`git push origin feature/AmazingFeature`）。
5.  打开 Pull Request。

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
