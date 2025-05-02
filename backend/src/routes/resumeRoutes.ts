import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume
} from '../controllers/resumeController';

const router = express.Router();

// 保护所有简历路由，需要登录
router.use(protect);

// 获取所有简历 / 创建简历
router.route('/')
  .get(getResumes)
  .post(createResume);

// 获取/更新/删除单个简历
router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

// 复制简历
router.post('/:id/duplicate', duplicateResume);

export default router;