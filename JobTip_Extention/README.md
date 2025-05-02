# Jobtip Browser Extension

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/Rorogogogo/Jobtip-extention/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Rorogogogo/Jobtip-extention)](https://github.com/Rorogogogo/Jobtip-extention/issues)

A browser extension designed to streamline your job search by scraping job listings from various platforms and potentially integrating with the [Jobtip](https://jobtip.me/) service. This tool helps you gather and manage job application information efficiently.

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

-   **Jobtip Sync**: The extension includes components suggesting the ability to sync scraped job data with the [Jobtip](https://jobtip.me/) service or a local backend instance. *(Verification of current sync status recommended)*.

## How to Use

1.  **Installation**
    -   Download or clone the extension's source code.
    -   Open Google Chrome and navigate to `chrome://extensions/`.
    -   Enable "Developer mode" (usually a toggle in the top-right corner).
    -   Click "Load unpacked" and select the directory containing the extension's `manifest.json` file (the `JobTip_Extention` folder).

2.  **Login**:
    -   Make sure you are logged into your account on the job platform(s) you intend to search (e.g., LinkedIn, SEEK, Indeed).
    -   Note: Indeed may require human verification before scraping

3.  **Job Search**
    -   Navigate to a supported job platform (LinkedIn Jobs, SEEK, Indeed).
    -   Perform a job search as usual.

4.  **Scraping & Managing Jobs**
    -   Click the Jobtip extension icon in your browser toolbar. This should open the Side Panel.
    -   Use the controls within the Side Panel to initiate scraping for the current page.
    -   View scraped jobs within the Side Panel.
    -   (If applicable) Use options within the Side Panel or Popup to save/sync jobs to Jobtip.

## Supported Platforms (Details)

-   LinkedIn (`linkedin.com/jobs/*`)
-   SEEK (`seek.com.au/*`, `seek.co.nz/*`)
-   Indeed (`indeed.com/*`, `*.indeed.com/*`)
-   *(Potential experimental support for `reed.co.uk/*`, `workopolis.com/*`)*

## Privacy & Security

-   The extension requests permissions necessary for its functionality (accessing tabs, storage, scripting on specific sites).
-   It primarily scrapes publicly available data from job sites.
-   Review the `host_permissions` in `manifest.json` for the list of sites the extension can interact with.
-   If syncing with Jobtip, data transmission security depends on the service's implementation (likely HTTPS).

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

# Jobtip 浏览器扩展

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/Rorogogogo/Jobtip-extention/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Rorogogogo/Jobtip-extention)](https://github.com/Rorogogogo/Jobtip-extention/issues)

这是一个浏览器扩展，旨在通过从各种平台抓取职位信息并可能与 [Jobtip](https://jobtip.me/) 服务集成来简化您的求职过程。该工具帮助您高效地收集和管理求职申请信息。

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

-   **Jobtip 同步**：扩展包含建议能够将爬取的职位数据与 [Jobtip](https://jobtip.me/) 服务或本地后端实例同步的组件。*（建议验证当前同步状态）*。

## 使用方法

1.  **安装**
    -   下载或克隆扩展的源代码。
    -   打开 Google Chrome 并导航到 `chrome://extensions/`。
    -   启用"开发者模式"（通常在右上角的开关）。
    -   点击"加载已解压的扩展程序"并选择包含扩展 `manifest.json` 文件的目录（`JobTip_Extention` 文件夹）。

2.  **登录**：
    -   确保您已登录到您打算搜索的求职平台（例如 LinkedIn、SEEK、Indeed）。
    -   注意: Indeed可能需要先通過人類驗證才能爬取

3.  **职位搜索**
    -   导航到支持的求职平台（LinkedIn Jobs、SEEK、Indeed）。
    -   像往常一样进行职位搜索。

4.  **爬取和管理职位**
    -   点击浏览器工具栏中的 Jobtip 扩展图标。这将打开侧边栏。
    -   使用侧边栏中的控件开始爬取当前页面。
    -   在侧边栏中查看爬取的职位。
    -   （如果适用）使用侧边栏或弹出窗口中的选项将职位保存/同步到 Jobtip。

## 支持的平台（详情）

-   LinkedIn（`linkedin.com/jobs/*`）
-   SEEK（`seek.com.au/*`、`seek.co.nz/*`）
-   Indeed（`indeed.com/*`、`*.indeed.com/*`）
-   *（可能实验性支持 `reed.co.uk/*`、`workopolis.com/*`）*

## 隐私与安全

-   扩展请求其功能所需的权限（访问标签页、存储、在特定网站上执行脚本）。
-   主要爬取求职网站上公开可用的数据。
-   查看 `manifest.json` 中的 `host_permissions` 了解扩展可以交互的网站列表。
-   如果与 Jobtip 同步，数据传输安全性取决于服务的实现（可能使用 HTTPS）。

## 开发

### 前提条件

-   Google Chrome 浏览器
-   JavaScript、HTML、CSS 和 Chrome 扩展 API（Manifest V3）的基本知识。
-   如果有构建步骤或通过包管理器管理的依赖项，可能需要 Node.js 和 npm/yarn（检查 `package.json`）。

### 本地开发设置

1.  确保已安装前提条件。
2.  克隆仓库：`git clone <repository-url>`
3.  使用"加载已解压的扩展程序"在 Chrome 中加载扩展，如安装部分所述。
4.  修改代码。在 `chrome://extensions/` 中重新加载扩展以查看更新（内容脚本可能需要刷新目标页面）。

### 贡献

（标准贡献步骤 - 从原始版本保留）
1.  Fork 仓库。
2.  创建您的功能分支（`git checkout -b feature/AmazingFeature`）。
3.  提交您的更改（`git commit -m 'Add some AmazingFeature'`）。
4.  推送到分支（`git push origin feature/AmazingFeature`）。
5.  打开 Pull Request。

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
