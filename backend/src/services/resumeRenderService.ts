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
      try {
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
      } catch (error) {
        console.error('初始化浏览器实例失败:', error);
        throw error;
      }
    }
    return browserInstance;
  },

  // 加载并编译模板
  getTemplate: () => {
    try {
      const templatePath = path.resolve(__dirname, '../templates/resume-template.html');
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      return Handlebars.compile(templateSource);
    } catch (error) {
      console.error('加载模板失败:', error);
      throw error;
    }
  },

  // 渲染HTML
  renderHTML: (resume: IResume): string => {
    try {
      const template = resumeRenderService.getTemplate();
      const resumeData = JSON.parse(resume.content);
      
      return template(resumeData);
    } catch (error) {
      console.error('渲染HTML失败:', error);
      throw error;
    }
  },

  // 生成PDF
  generatePDF: async (resume: IResume): Promise<Buffer> => {
    let page = null;
    try {
      // 确保浏览器实例存在
      const browser = await resumeRenderService.init();
      
      // 渲染HTML
      const html = resumeRenderService.renderHTML(resume);
      
      // 在新页面中加载HTML
      page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // 配置PDF选项并确保返回Buffer类型
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
      
      // 确保返回的是Buffer类型
      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('生成PDF失败:', error);
      throw error;
    } finally {
      // 确保页面被关闭，即使出现错误
      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.error('关闭页面失败:', e);
        }
      }
    }
  }
};

export default resumeRenderService; 