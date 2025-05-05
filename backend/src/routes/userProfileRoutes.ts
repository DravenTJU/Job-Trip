import express from 'express';
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
  addProject,
  updateProject,
  deleteProject,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addCertification,
  updateCertification,
  deleteCertification
} from '../controllers/userProfileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 用户档案
 *   description: 用户档案管理API
 */

// 所有路由都需要认证
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
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.get('/me', getProfile);

/**
 * @swagger
 * /user-profiles/me:
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
 *             type: object
 *             properties:
 *               introduction:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新用户档案
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.put('/me', updateProfile);

/**
 * @swagger
 * /user-profiles/me/education:
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
 *             required:
 *               - school
 *               - degree
 *               - major
 *               - startDate
 *               - endDate
 *             properties:
 *               school:
 *                 type: string
 *               degree:
 *                 type: string
 *               major:
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
 *         description: 成功添加教育经历
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.post('/me/education', addEducation);

/**
 * @swagger
 * /user-profiles/me/education/{id}:
 *   put:
 *     summary: 更新教育经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 教育经历ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school:
 *                 type: string
 *               degree:
 *                 type: string
 *               major:
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
 *         description: 成功更新教育经历
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到教育经历
 *       500:
 *         description: 服务器错误
 */
router.put('/me/education/:id', updateEducation);

/**
 * @swagger
 * /user-profiles/me/education/{id}:
 *   delete:
 *     summary: 删除教育经历
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 教育经历ID
 *     responses:
 *       200:
 *         description: 成功删除教育经历
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到教育经历
 *       500:
 *         description: 服务器错误
 */
router.delete('/me/education/:id', deleteEducation);

/**
 * @swagger
 * /user-profiles/me/work-experience:
 *   post:
 *     summary: 添加工作经验
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - position
 *               - startDate
 *               - endDate
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
 *               description:
 *                 type: string
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功添加工作经验
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.post('/me/work-experience', addWorkExperience);

/**
 * @swagger
 * /user-profiles/me/work-experience/{id}:
 *   put:
 *     summary: 更新工作经验
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 工作经验ID
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
 *               description:
 *                 type: string
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功更新工作经验
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到工作经验
 *       500:
 *         description: 服务器错误
 */
router.put('/me/work-experience/:id', updateWorkExperience);

/**
 * @swagger
 * /user-profiles/me/work-experience/{id}:
 *   delete:
 *     summary: 删除工作经验
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 工作经验ID
 *     responses:
 *       200:
 *         description: 成功删除工作经验
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到工作经验
 *       500:
 *         description: 服务器错误
 */
router.delete('/me/work-experience/:id', deleteWorkExperience);

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
 *             required:
 *               - name
 *               - level
 *               - yearsOfExperience
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced, expert]
 *               yearsOfExperience:
 *                 type: number
 *     responses:
 *       200:
 *         description: 成功添加技能
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.post('/me/skills', addSkill);

/**
 * @swagger
 * /user-profiles/me/skills/{id}:
 *   put:
 *     summary: 更新技能
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 技能ID
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
 *                 enum: [beginner, intermediate, advanced, expert]
 *               yearsOfExperience:
 *                 type: number
 *     responses:
 *       200:
 *         description: 成功更新技能
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到技能
 *       500:
 *         description: 服务器错误
 */
router.put('/me/skills/:id', updateSkill);

/**
 * @swagger
 * /user-profiles/me/skills/{id}:
 *   delete:
 *     summary: 删除技能
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 技能ID
 *     responses:
 *       200:
 *         description: 成功删除技能
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到技能
 *       500:
 *         description: 服务器错误
 */
router.delete('/me/skills/:id', deleteSkill);

/**
 * @swagger
 * /user-profiles/me/projects:
 *   post:
 *     summary: 添加项目经验
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
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
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功添加项目经验
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.post('/me/projects', addProject);

/**
 * @swagger
 * /user-profiles/me/projects/{id}:
 *   put:
 *     summary: 更新项目经验
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 项目经验ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
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
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功更新项目经验
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到项目经验
 *       500:
 *         description: 服务器错误
 */
router.put('/me/projects/:id', updateProject);

/**
 * @swagger
 * /user-profiles/me/projects/{id}:
 *   delete:
 *     summary: 删除项目经验
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 项目经验ID
 *     responses:
 *       200:
 *         description: 成功删除项目经验
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到项目经验
 *       500:
 *         description: 服务器错误
 */
router.delete('/me/projects/:id', deleteProject);

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
 *             required:
 *               - name
 *               - level
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [basic, intermediate, advanced, native]
 *     responses:
 *       200:
 *         description: 成功添加语言能力
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.post('/me/languages', addLanguage);

/**
 * @swagger
 * /user-profiles/me/languages/{id}:
 *   put:
 *     summary: 更新语言能力
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 语言能力ID
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
 *                 enum: [basic, intermediate, advanced, native]
 *     responses:
 *       200:
 *         description: 成功更新语言能力
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到语言能力
 *       500:
 *         description: 服务器错误
 */
router.put('/me/languages/:id', updateLanguage);

/**
 * @swagger
 * /user-profiles/me/languages/{id}:
 *   delete:
 *     summary: 删除语言能力
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 语言能力ID
 *     responses:
 *       200:
 *         description: 成功删除语言能力
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到语言能力
 *       500:
 *         description: 服务器错误
 */
router.delete('/me/languages/:id', deleteLanguage);

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
 *             required:
 *               - title
 *               - issuer
 *               - issueDate
 *             properties:
 *               title:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               credentialId:
 *                 type: string
 *               credentialUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功添加证书
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.post('/me/certifications', addCertification);

/**
 * @swagger
 * /user-profiles/me/certifications/{id}:
 *   put:
 *     summary: 更新证书
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 证书ID
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
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
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
 *         description: 未认证
 *       404:
 *         description: 未找到证书
 *       500:
 *         description: 服务器错误
 */
router.put('/me/certifications/:id', updateCertification);

/**
 * @swagger
 * /user-profiles/me/certifications/{id}:
 *   delete:
 *     summary: 删除证书
 *     tags: [用户档案]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 证书ID
 *     responses:
 *       200:
 *         description: 成功删除证书
 *       401:
 *         description: 未认证
 *       404:
 *         description: 未找到证书
 *       500:
 *         description: 服务器错误
 */
router.delete('/me/certifications/:id', deleteCertification);

export default router; 