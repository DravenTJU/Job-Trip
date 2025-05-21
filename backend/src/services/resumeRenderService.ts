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
  generatePDF: async (resume: IResume): Promise<any> => {
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