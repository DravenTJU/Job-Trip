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
 * components:
 *   schemas:
 *     SocialMedia:
 *       type: object
 *       properties:
 *         linkedin: { type: string, format: url, description: 'LinkedIn个人资料URL' }
 *         github: { type: string, format: url, description: 'GitHub个人资料URL' }
 *         twitter: { type: string, format: url, description: 'Twitter个人资料URL' }
 *         other: 
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name: { type: string, description: '其他社交媒体名称' }
 *               url: { type: string, format: url, description: '其他社交媒体URL' }
 *     ContactInfo:
 *       type: object
 *       properties:
 *         email: { type: string, format: email, description: '邮箱地址' }
 *         phone: { type: string, description: '电话号码' }
 *         website: { type: string, format: url, description: '个人网站URL' }
 *         address: { type: string, description: '地址' }
 *         socialMedia: { $ref: '#/components/schemas/SocialMedia' }
 *     Education:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '教育经历的唯一ID' }
 *         institution: { type: string, description: '学校名称' }
 *         degree: { type: string, description: '学位' }
 *         field: { type: string, description: '专业领域' }
 *         startDate: { type: string, format: date, description: '开始日期' }
 *         endDate: { type: string, format: date, description: '结束日期' }
 *         description: { type: string, description: '描述/成就' }
 *         location: { type: string, description: '地点' }
 *     WorkExperience:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '工作经历的唯一ID' }
 *         company: { type: string, description: '公司名称' }
 *         position: { type: string, description: '职位' }
 *         startDate: { type: string, format: date, description: '开始日期' }
 *         endDate: { type: string, format: date, description: '结束日期' }
 *         current: { type: boolean, description: '是否为当前工作' }
 *         description: { type: string, description: '工作描述' }
 *         location: { type: string, description: '地点' }
 *         achievements: { type: array, items: { type: string }, description: '成就列表' }
 *     Skill:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '技能的唯一ID' }
 *         name: { type: string, description: '技能名称' }
 *         level: { type: string, enum: ['beginner', 'intermediate', 'advanced', 'expert'], description: '熟练程度' }
 *         endorsements: { type: number, description: '认可数' }
 *         category: { type: string, description: '技能分类' }
 *     Certification:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '证书的唯一ID' }
 *         name: { type: string, description: '证书名称' }
 *         issuer: { type: string, description: '发证机构' }
 *         issueDate: { type: string, format: date, description: '发证日期' }
 *         expirationDate: { type: string, format: date, description: '到期日期' }
 *         credentialId: { type: string, description: '证书ID' }
 *         credentialUrl: { type: string, format: url, description: '证书链接' }
 *     Project:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '项目的唯一ID' }
 *         name: { type: string, description: '项目名称' }
 *         description: { type: string, description: '项目描述' }
 *         startDate: { type: string, format: date, description: '开始日期' }
 *         endDate: { type: string, format: date, description: '结束日期' }
 *         url: { type: string, format: url, description: '项目链接' }
 *         technologies: { type: array, items: { type: string }, description: '使用的技术' }
 *     Language:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '语言能力的唯一ID' }
 *         language: { type: string, description: '语言名称' }
 *         proficiency: { type: string, enum: ['beginner', 'intermediate', 'advanced', 'native'], description: '熟练程度' }
 *     VolunteerExperience:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '志愿者经历的唯一ID' }
 *         organization: { type: string, description: '组织名称' }
 *         role: { type: string, description: '角色' }
 *         startDate: { type: string, format: date, description: '开始日期' }
 *         endDate: { type: string, format: date, description: '结束日期' }
 *         description: { type: string, description: '描述' }
 *     HonorAward:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '荣誉与奖项的唯一ID' }
 *         title: { type: string, description: '奖项名称' }
 *         issuer: { type: string, description: '颁发机构' }
 *         date: { type: string, format: date, description: '获得日期' }
 *         description: { type: string, description: '描述' }
 *     Recommendation:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '推荐信的唯一ID' }
 *         recommenderName: { type: string, description: '推荐人姓名' }
 *         recommenderTitle: { type: string, description: '推荐人职位' }
 *         relationship: { type: string, description: '与推荐人关系' }
 *         content: { type: string, description: '推荐内容' }
 *         date: { type: string, format: date, description: '推荐日期' }
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         _id: { type: string, format: objectid, description: '用户档案的唯一ID' }
 *         userId: { type: string, format: objectid, description: '关联用户的唯一ID' }
 *         firstName: { type: string, description: '名' }
 *         lastName: { type: string, description: '姓' }
 *         headline: { type: string, description: '个人标题/职业概述' }
 *         biography: { type: string, description: '个人简介' }
 *         contactInfo: { $ref: '#/components/schemas/ContactInfo' }
 *         educations: { type: array, items: { $ref: '#/components/schemas/Education' } }
 *         workExperiences: { type: array, items: { $ref: '#/components/schemas/WorkExperience' } }
 *         skills: { type: array, items: { $ref: '#/components/schemas/Skill' } }
 *         certifications: { type: array, items: { $ref: '#/components/schemas/Certification' } }
 *         projects: { type: array, items: { $ref: '#/components/schemas/Project' } }
 *         languages: { type: array, items: { $ref: '#/components/schemas/Language' } }
 *         volunteerExperiences: { type: array, items: { $ref: '#/components/schemas/VolunteerExperience' } }
 *         honorsAwards: { type: array, items: { $ref: '#/components/schemas/HonorAward' } }
 *         recommendations: { type: array, items: { $ref: '#/components/schemas/Recommendation' } }
 *         profileCompleteness: { type: number, description: '档案完整度百分比 (0-100)' }
 *         lastUpdated: { type: string, format: date-time, description: '最后更新时间' }
 *         createdAt: { type: string, format: date-time, description: '创建时间' }
 *         updatedAt: { type: string, format: date-time, description: '更新时间' }
 *     UserProfileInput:
 *       type: object
 *       properties:
 *         firstName: { type: string, description: '名', example: '三' }
 *         lastName: { type: string, description: '姓', example: '张' }
 *         headline: { type: string, description: '个人标题/职业概述', example: '资深软件工程师' }
 *         biography: { type: string, description: '个人简介', example: '热爱编程与新技术探索' }
 *         contactInfo: 
 *           $ref: '#/components/schemas/ContactInfo'
 *         # For arrays like educations, workExperiences, etc., the input schema might not require _id
 *         # Mongoose will generate _id for new subdocuments if not provided
 *         educations: 
 *           type: array
 *           items: 
 *             $ref: '#/components/schemas/Education' # Ensure Education schema for input doesn't enforce _id
 *         workExperiences:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkExperience'
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Skill'
 *         certifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Certification'
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         languages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Language'
 *         volunteerExperiences:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VolunteerExperience'
 *         honorsAwards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HonorAward'
 *         recommendations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Recommendation'
 * 
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * 
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
 *             $ref: '#/components/schemas/UserProfileInput' # Changed to UserProfileInput
 *     responses:
 *       201:
 *         description: 成功创建用户档案
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       400:
 *         description: 用户档案已存在或请求体无效
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
 *             $ref: '#/components/schemas/UserProfileInput' # Changed to UserProfileInput
 *     responses:
 *       200:
 *         description: 成功更新用户档案
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
 *     tags: [用户档案 - 教育经历]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Education' # Assuming Education schema for input
 *     responses:
 *       201:
 *         description: 成功添加教育经历
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
 */
router
  .route('/me/educations')
  .post(addEducation);

/**
 * @swagger
 * /user-profiles/me/educations/{educationId}:
 *   put:
 *     summary: 更新指定的教育经历
 *     tags: [用户档案 - 教育经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: educationId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的教育经历的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Education' # Assuming Education schema for input, _id in path overrides body _id
 *     responses:
 *       200:
 *         description: 成功更新教育经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或教育经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的教育经历
 *     tags: [用户档案 - 教育经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: educationId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的教育经历的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除教育经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或教育经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/educations/:educationId')
  .put(updateEducation)
  .delete(deleteEducation);

/**
 * @swagger
 * /user-profiles/me/work-experiences:
 *   post:
 *     summary: 添加工作经历
 *     tags: [用户档案 - 工作经历]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkExperience'
 *     responses:
 *       201:
 *         description: 成功添加工作经历
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
 */
router
  .route('/me/work-experiences')
  .post(addWorkExperience);

/**
 * @swagger
 * /user-profiles/me/work-experiences/{workExperienceId}:
 *   put:
 *     summary: 更新指定的工作经历
 *     tags: [用户档案 - 工作经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workExperienceId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的工作经历的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkExperience'
 *     responses:
 *       200:
 *         description: 成功更新工作经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或工作经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的工作经历
 *     tags: [用户档案 - 工作经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workExperienceId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的工作经历的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除工作经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或工作经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/work-experiences/:workExperienceId')
  .put(updateWorkExperience)
  .delete(deleteWorkExperience);

/**
 * @swagger
 * /user-profiles/me/skills:
 *   post:
 *     summary: 添加技能
 *     tags: [用户档案 - 技能]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       201:
 *         description: 成功添加技能
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
 */
router
  .route('/me/skills')
  .post(addSkill);

/**
 * @swagger
 * /user-profiles/me/skills/{skillId}:
 *   put:
 *     summary: 更新指定的技能
 *     tags: [用户档案 - 技能]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的技能的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       200:
 *         description: 成功更新技能
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或技能不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的技能
 *     tags: [用户档案 - 技能]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的技能的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除技能
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或技能不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/skills/:skillId')
  .put(updateSkill)
  .delete(deleteSkill);

/**
 * @swagger
 * /user-profiles/me/certifications:
 *   post:
 *     summary: 添加证书
 *     tags: [用户档案 - 证书]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Certification'
 *     responses:
 *       201:
 *         description: 成功添加证书
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
 */
router
  .route('/me/certifications')
  .post(addCertification);

/**
 * @swagger
 * /user-profiles/me/certifications/{certificationId}:
 *   put:
 *     summary: 更新指定的证书
 *     tags: [用户档案 - 证书]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificationId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的证书的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Certification'
 *     responses:
 *       200:
 *         description: 成功更新证书
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或证书不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的证书
 *     tags: [用户档案 - 证书]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificationId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的证书的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除证书
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或证书不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/certifications/:certificationId')
  .put(updateCertification)
  .delete(deleteCertification);

/**
 * @swagger
 * /user-profiles/me/projects:
 *   post:
 *     summary: 添加项目经历
 *     tags: [用户档案 - 项目经历]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: 成功添加项目经历
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
 */
router
  .route('/me/projects')
  .post(addProject);

/**
 * @swagger
 * /user-profiles/me/projects/{projectId}:
 *   put:
 *     summary: 更新指定的项目经历
 *     tags: [用户档案 - 项目经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的项目经历的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: 成功更新项目经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或项目经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的项目经历
 *     tags: [用户档案 - 项目经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的项目经历的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除项目经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或项目经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/projects/:projectId')
  .put(updateProject)
  .delete(deleteProject);

/**
 * @swagger
 * /user-profiles/me/languages:
 *   post:
 *     summary: 添加语言能力
 *     tags: [用户档案 - 语言能力]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       201:
 *         description: 成功添加语言能力
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
 */
router
  .route('/me/languages')
  .post(addLanguage);

/**
 * @swagger
 * /user-profiles/me/languages/{languageId}:
 *   put:
 *     summary: 更新指定的语言能力
 *     tags: [用户档案 - 语言能力]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: languageId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的语言能力的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       200:
 *         description: 成功更新语言能力
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或语言能力不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的语言能力
 *     tags: [用户档案 - 语言能力]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: languageId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的语言能力的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除语言能力
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或语言能力不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/languages/:languageId')
  .put(updateLanguage)
  .delete(deleteLanguage);

/**
 * @swagger
 * /user-profiles/me/volunteer-experiences:
 *   post:
 *     summary: 添加志愿者经历
 *     tags: [用户档案 - 志愿者经历]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VolunteerExperience'
 *     responses:
 *       201:
 *         description: 成功添加志愿者经历
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
 */
router
  .route('/me/volunteer-experiences')
  .post(addVolunteerExperience);

/**
 * @swagger
 * /user-profiles/me/volunteer-experiences/{volunteerExperienceId}:
 *   put:
 *     summary: 更新指定的志愿者经历
 *     tags: [用户档案 - 志愿者经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: volunteerExperienceId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的志愿者经历的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VolunteerExperience'
 *     responses:
 *       200:
 *         description: 成功更新志愿者经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或志愿者经历不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的志愿者经历
 *     tags: [用户档案 - 志愿者经历]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: volunteerExperienceId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的志愿者经历的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除志愿者经历
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或志愿者经历不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/volunteer-experiences/:volunteerExperienceId')
  .put(updateVolunteerExperience)
  .delete(deleteVolunteerExperience);

/**
 * @swagger
 * /user-profiles/me/honors-awards:
 *   post:
 *     summary: 添加荣誉奖项
 *     tags: [用户档案 - 荣誉奖项]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HonorAward'
 *     responses:
 *       201:
 *         description: 成功添加荣誉奖项
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
 */
router
  .route('/me/honors-awards')
  .post(addHonorAward);

/**
 * @swagger
 * /user-profiles/me/honors-awards/{honorAwardId}:
 *   put:
 *     summary: 更新指定的荣誉奖项
 *     tags: [用户档案 - 荣誉奖项]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: honorAwardId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的荣誉奖项的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HonorAward'
 *     responses:
 *       200:
 *         description: 成功更新荣誉奖项
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或荣誉奖项不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的荣誉奖项
 *     tags: [用户档案 - 荣誉奖项]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: honorAwardId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的荣誉奖项的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除荣誉奖项
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或荣誉奖项不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/honors-awards/:honorAwardId')
  .put(updateHonorAward)
  .delete(deleteHonorAward);

/**
 * @swagger
 * /user-profiles/me/recommendations:
 *   post:
 *     summary: 添加推荐信
 *     tags: [用户档案 - 推荐信]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recommendation'
 *     responses:
 *       201:
 *         description: 成功添加推荐信
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
 */
router
  .route('/me/recommendations')
  .post(addRecommendation);

/**
 * @swagger
 * /user-profiles/me/recommendations/{recommendationId}:
 *   put:
 *     summary: 更新指定的推荐信
 *     tags: [用户档案 - 推荐信]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recommendationId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要更新的推荐信的唯一ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recommendation'
 *     responses:
 *       200:
 *         description: 成功更新推荐信
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或推荐信不存在
 *       500:
 *         description: 服务器错误
 *   delete:
 *     summary: 删除指定的推荐信
 *     tags: [用户档案 - 推荐信]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recommendationId
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: 要删除的推荐信的唯一ID
 *     responses:
 *       200:
 *         description: 成功删除推荐信
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户档案不存在或推荐信不存在
 *       500:
 *         description: 服务器错误
 */
router
  .route('/me/recommendations/:recommendationId')
  .put(updateRecommendation)
  .delete(deleteRecommendation);

export default router;