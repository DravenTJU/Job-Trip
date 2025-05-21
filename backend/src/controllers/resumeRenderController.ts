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
    
    // 返回HTML，确保正确的字符编码
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error: any) {
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
    
    // 确保正确设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // 确保缓存控制
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // 发送PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('生成简历PDF失败:', error);
    next(new AppError(`PDF生成失败: ${error.message}`, 500));
  }
}; 