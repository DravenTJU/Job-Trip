import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getProfile,
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSkill,
  updateSkill,
  deleteSkill,
  generateResume
} from '../controllers/profileController';

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

// 获取和更新用户档案
router.route('/')
  .get(getProfile)
  .put(updateProfile);

// 教育经历相关路由
router.route('/educations')
  .post(addEducation);

router.route('/educations/:id')
  .put(updateEducation)
  .delete(deleteEducation);

// 工作经历相关路由
router.route('/work-experiences')
  .post(addWorkExperience);

router.route('/work-experiences/:id')
  .put(updateWorkExperience)
  .delete(deleteWorkExperience);

// 技能相关路由
router.route('/skills')
  .post(addSkill);

router.route('/skills/:id')
  .put(updateSkill)
  .delete(deleteSkill);

// 生成简历
router.post('/generate-resume', generateResume);

export default router; 