import React from 'react';
import { Download, Chrome, Zap, Star, Bookmark, FileText, CheckCircle } from 'lucide-react';

/**
 * Chrome扩展页面组件
 * 展示JobTrip浏览器扩展的功能、价值和安装步骤
 * 基于项目核心功能：自动收集多平台职位信息并集中管理
 */
const ChromeExtensionPage: React.FC = () => {
  return (
    <div className="container-lg">
      <div className="section">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Chrome 浏览器扩展插件</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          安装我们的开源浏览器扩展，自动从 LinkedIn、Seek 和 Indeed 等热门求职平台收集职位信息，将所有机会集中到一处，简化您的求职流程。
        </p>
      </div>

      {/* 下载区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Chrome className="w-12 h-12 text-indigo-600 mr-4" />
            <div>
              <h2 className="title-sm">Chrome 浏览器扩展插件</h2>
              <p className="text-description">版本 1.0.0</p>
            </div>
          </div>
            <a href="https://codeload.github.com/MagicDogGuo/JobTip_Extention/zip/refs/heads/main" download>
                <button className="btn btn-primary">
                    <Download className="w-4 h-4 mr-2" />
                    下载扩展程序
                </button>
            </a>
        </div>
      </div>

      {/* 安装步骤 */}
      <div className="section">
        <h2 className="title-md mb-6">快速安装指南</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">1</span>
            </div>
            <div>
              <h3 className="title-sm mb-1">下载扩展文件</h3>
              <p className="text-description">点击上方的"下载扩展程序"按钮，获取JobTrip职途助手扩展文件包。</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">2</span>
            </div>
            <div>
              <h3 className="title-sm mb-1">打开 Chrome 扩展管理页面</h3>
              <p className="text-description mb-2">在 Chrome 浏览器地址栏输入以下地址：</p>
              <code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md font-mono text-sm">
                chrome://extensions/
              </code>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">3</span>
            </div>
            <div>
              <h3 className="title-sm mb-1">启用开发者模式</h3>
              <p className="text-description mb-2">在扩展页面右上角找到开发者模式开关：</p>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div className="w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative mr-3">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Developer mode</span>
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">4</span>
            </div>
            <div>
              <h3 className="title-sm mb-1">安装扩展</h3>
              <p className="text-description">将下载的扩展文件拖放到扩展页面，完成安装。</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">5</span>
            </div>
            <div>
              <h3 className="title-sm mb-1">固定扩展程序</h3>
              <p className="text-description">点击 Chrome 工具栏上的拼图图标，固定 JobTrip 扩展程序以方便访问。</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">6</span>
            </div>
            <div>
              <h3 className="title-sm mb-1">开始自动化您的求职过程</h3>
              <p className="text-description mb-2">点击工具栏中的 JobTrip 图标，输入您的求职条件（职位、地点），选择目标平台（LinkedIn、Seek、Indeed等），点击"开始搜索"。扩展程序会自动收集职位信息并同步到 JobTrip 系统中，为您提供一站式管理体验。</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  为确保最佳体验，请先登录您要搜索的招聘平台（LinkedIn、Seek、Indeed等），这样扩展才能访问完整的职位信息。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-8">
        <h3 className="title-sm mb-2 text-blue-800 dark:text-blue-200">隐私与安全</h3>
        <p className="text-blue-700 dark:text-blue-300">
          我们的扩展程序需要访问招聘网站的权限才能抓取职位信息。JobTrip 是完全开源的，您可以随时查看源代码以确保数据安全。我们只收集您明确授权的职位相关信息，如职位标题、公司名称、地点等。
        </p>
      </div>

      {/* 常见问题 */}
      <div className="section">
        <h2 className="title-md mb-6">常见问题</h2>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="title-sm mb-2">扩展支持哪些招聘平台？</h3>
            <p className="text-description">目前支持 LinkedIn、Seek 和 Indeed 等主要新西兰求职平台。我们正在开发对更多平台的支持，未来版本将不断扩展覆盖范围。</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="title-sm mb-2">扩展需要付费吗？</h3>
            <p className="text-description">JobTrip 职途助手完全免费且开源，符合我们简化求职流程、让所有人都能轻松获取职位信息的使命。</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="title-sm mb-2">如何同步数据到 JobTrip 系统？</h3>
            <p className="text-description">当您使用扩展收集职位信息后，点击导出按钮，数据会自动同步到您的 JobTrip 账户。您可在 JobTrip 平台上查看、管理和跟踪所有收集的职位。</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="title-sm mb-2">遇到网站变更导致扩展无法工作怎么办？</h3>
            <p className="text-description">我们采用模块化设计，会定期更新扩展以适应招聘网站的变化。可重新下载扩展程序，并按照安装步骤重新安装。如遇问题，请联系我们的支持团队，我们会尽快解决。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChromeExtensionPage; 