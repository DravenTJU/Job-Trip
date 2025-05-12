import express from 'express';
import {
  getCurrentUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSkill,
  updateSkill,
  deleteSkill,
  addCertification,
  updateCertification,
  deleteCertification,
  addProject,
  updateProject,
  deleteProject,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addVolunteerExperience,
  updateVolunteerExperience,
  deleteVolunteerExperience,
  addHonorAward,
  updateHonorAward,
  deleteHonorAward,
  addRecommendation,
  updateRecommendation,
  deleteRecommendation
} from '../controllers/userProfileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// 所有路由都需要通过认证
router.use(protect);

/**
 * @swagger
 * /user-profiles/me:
 *   get:
 *     summary: 获取当前用户的档案
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户档案
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 *   post:
 *     summary: 创建用户档案
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfile'
 *     responses:
 *       201:
 *         description: 成功创建用户档案
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       400:
 *         description: 用户档案已存在
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 *   put:
 *     summary: 更新当前用户的档案
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfile'
 *     responses:
 *       200:
 *         description: 成功更新用户档案
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除当前用户的档案
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功删除用户档案
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me')
  .get(getCurrentUserProfile)
  .post(createUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserProfile);

/**
 * @swagger
 * /user-profiles/me/educations:
 *   post:
 *     summary: 添加教育经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               field:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功添加教育经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/educations')
  .post(addEducation);

/**
 * @swagger
 * /user-profiles/me/educations/{index}:
 *   put:
 *     summary: 更新教育经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 教育经历的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               field:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新教育经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或教育经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除教育经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 教育经历的索引
 *     responses:
 *       200:
 *         description: 成功删除教育经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或教育经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/educations/:index')
  .put(updateEducation)
  .delete(deleteEducation);

/**
 * @swagger
 * /user-profiles/me/work-experiences:
 *   post:
 *     summary: 添加工作经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               current:
 *                 type: boolean
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: 成功添加工作经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/work-experiences')
  .post(addWorkExperience);

/**
 * @swagger
 * /user-profiles/me/work-experiences/{index}:
 *   put:
 *     summary: 更新工作经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 工作经历的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               current:
 *                 type: boolean
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功更新工作经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或工作经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除工作经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 工作经历的索引
 *     responses:
 *       200:
 *         description: 成功删除工作经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或工作经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/work-experiences/:index')
  .put(updateWorkExperience)
  .delete(deleteWorkExperience);

/**
 * @swagger
 * /user-profiles/me/skills:
 *   post:
 *     summary: 添加技能
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               level:
 *                 type: string
 *                 enum: ['初级', '中级', '高级', '专家']
 *               endorsements:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功添加技能
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/skills')
  .post(addSkill);

/**
 * @swagger
 * /user-profiles/me/skills/{index}:
 *   put:
 *     summary: 更新技能
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 技能的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: ['初级', '中级', '高级', '专家']
 *               endorsements:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新技能
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或技能不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除技能
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 技能的索引
 *     responses:
 *       200:
 *         description: 成功删除技能
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或技能不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/skills/:index')
  .put(updateSkill)
  .delete(deleteSkill);

/**
 * @swagger
 * /user-profiles/me/certifications:
 *   post:
 *     summary: 添加证书
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               issuer:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expirationDate:
 *                 type: string
 *                 format: date
 *               credentialId:
 *                 type: string
 *               credentialUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功添加证书
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/certifications')
  .post(addCertification);

/**
 * @swagger
 * /user-profiles/me/certifications/{index}:
 *   put:
 *     summary: 更新证书
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 证书的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expirationDate:
 *                 type: string
 *                 format: date
 *               credentialId:
 *                 type: string
 *               credentialUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新证书
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或证书不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除证书
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 证书的索引
 *     responses:
 *       200:
 *         description: 成功删除证书
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或证书不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/certifications/:index')
  .put(updateCertification)
  .delete(deleteCertification);

/**
 * @swagger
 * /user-profiles/me/projects:
 *   post:
 *     summary: 添加项目经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               url:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: 成功添加项目经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/projects')
  .post(addProject);

/**
 * @swagger
 * /user-profiles/me/projects/{index}:
 *   put:
 *     summary: 更新项目经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 项目经历的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               url:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功更新项目经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或项目经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除项目经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 项目经历的索引
 *     responses:
 *       200:
 *         description: 成功删除项目经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或项目经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/projects/:index')
  .put(updateProject)
  .delete(deleteProject);

/**
 * @swagger
 * /user-profiles/me/languages:
 *   post:
 *     summary: 添加语言能力
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 required: true
 *               proficiency:
 *                 type: string
 *                 enum: ['初级', '中级', '高级', '母语']
 *     responses:
 *       201:
 *         description: 成功添加语言能力
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/languages')
  .post(addLanguage);

/**
 * @swagger
 * /user-profiles/me/languages/{index}:
 *   put:
 *     summary: 更新语言能力
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 语言能力的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               proficiency:
 *                 type: string
 *                 enum: ['初级', '中级', '高级', '母语']
 *     responses:
 *       200:
 *         description: 成功更新语言能力
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或语言能力不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除语言能力
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 语言能力的索引
 *     responses:
 *       200:
 *         description: 成功删除语言能力
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或语言能力不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/languages/:index')
  .put(updateLanguage)
  .delete(deleteLanguage);

/**
 * @swagger
 * /user-profiles/me/volunteer-experiences:
 *   post:
 *     summary: 添加志愿者经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *                 required: true
 *               role:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功添加志愿者经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/volunteer-experiences')
  .post(addVolunteerExperience);

/**
 * @swagger
 * /user-profiles/me/volunteer-experiences/{index}:
 *   put:
 *     summary: 更新志愿者经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 志愿者经历的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *               role:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新志愿者经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或志愿者经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除志愿者经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 志愿者经历的索引
 *     responses:
 *       200:
 *         description: 成功删除志愿者经历
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或志愿者经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/volunteer-experiences/:index')
  .put(updateVolunteerExperience)
  .delete(deleteVolunteerExperience);

/**
 * @swagger
 * /user-profiles/me/honors-awards:
 *   post:
 *     summary: 添加荣誉奖项
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *               issuer:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功添加荣誉奖项
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/honors-awards')
  .post(addHonorAward);

/**
 * @swagger
 * /user-profiles/me/honors-awards/{index}:
 *   put:
 *     summary: 更新荣誉奖项
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 荣誉奖项的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               issuer:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新荣誉奖项
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或荣誉奖项不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除荣誉奖项
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 荣誉奖项的索引
 *     responses:
 *       200:
 *         description: 成功删除荣誉奖项
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或荣誉奖项不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/honors-awards/:index')
  .put(updateHonorAward)
  .delete(deleteHonorAward);

/**
 * @swagger
 * /user-profiles/me/recommendations:
 *   post:
 *     summary: 添加推荐信
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recommenderName:
 *                 type: string
 *                 required: true
 *               recommenderTitle:
 *                 type: string
 *               relationship:
 *                 type: string
 *               content:
 *                 type: string
 *                 required: true
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: 成功添加推荐信
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/recommendations')
  .post(addRecommendation);

/**
 * @swagger
 * /user-profiles/me/recommendations/{index}:
 *   put:
 *     summary: 更新推荐信
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 推荐信的索引
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recommenderName:
 *                 type: string
 *               recommenderTitle:
 *                 type: string
 *               relationship:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: 成功更新推荐信
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或推荐信不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除推荐信
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: 推荐信的索引
 *     responses:
 *       200:
 *         description: 成功删除推荐信
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或推荐信不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/recommendations/:index')
  .put(updateRecommendation)
  .delete(deleteRecommendation);

export default router; 