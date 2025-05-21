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