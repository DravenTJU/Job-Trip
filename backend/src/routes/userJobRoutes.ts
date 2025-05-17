import express from 'express';
import {
  getUserJobs,
  getUserJob,
  createUserJob,
  updateUserJob,
  deleteUserJob,
  getStatusStats
} from '../controllers/userJobController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 用户职位关联
 *   description: 用户与职位关联管理API
 */

// 所有路由都需要认证
router.use(protect);

/**
 * @swagger
 * /userjobs:
 *   get:
 *     summary: 获取当前用户的所有关联职位
 *     tags: [用户职位关联]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页记录数
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: 排序字段，例如 "-createdAt" 表示按创建时间降序排序
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: 返回的字段，用逗号分隔
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, applied, interviewing, offer, rejected, withdrawn, closed]
 *         description: 按状态筛选
 *       - in: query
 *         name: isFavorite
 *         schema:
 *           type: boolean
 *         description: 按收藏状态筛选
 *     responses:
 *       200:
 *         description: 成功获取关联职位列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserJobListResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   post:
 *     summary: 创建用户-职位关联
 *     tags: [用户职位关联]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: 职位ID
 *               status:
 *                 type: string
 *                 enum: [new, applied, interviewing, offer, rejected, withdrawn, closed]
 *                 default: new
 *                 description: 申请状态
 *               isFavorite:
 *                 type: boolean
 *                 default: false
 *                 description: 是否收藏
 *               customTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 自定义标签
 *               notes:
 *                 type: string
 *                 description: 备注
 *               reminderDate:
 *                 type: string
 *                 format: date-time
 *                 description: 提醒日期
 *     responses:
 *       201:
 *         description: 关联创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserJobResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route('/')
  .get(getUserJobs)
  .post(createUserJob);

/**
 * @swagger
 * /userjobs/{id}:
 *   get:
 *     summary: 获取单个用户-职位关联详情
 *     tags: [用户职位关联]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 关联ID
 *     responses:
 *       200:
 *         description: 成功获取关联详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserJobResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   put:
 *     summary: 更新用户-职位关联
 *     tags: [用户职位关联]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 关联ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, applied, interviewing, offer, rejected, withdrawn, closed]
 *                 description: 申请状态
 *               isFavorite:
 *                 type: boolean
 *                 description: 是否收藏
 *               customTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 自定义标签
 *               notes:
 *                 type: string
 *                 description: 备注
 *               reminderDate:
 *                 type: string
 *                 format: date-time
 *                 description: 提醒日期
 *     responses:
 *       200:
 *         description: 关联更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserJobResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     summary: 删除用户-职位关联
 *     tags: [用户职位关联]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 关联ID
 *     responses:
 *       200:
 *         description: 关联删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route('/:id')
  .get(getUserJob)
  .put(updateUserJob)
  .delete(deleteUserJob);

/**
 * @swagger
 * /userjobs/stats/status:
 *   get:
 *     summary: 获取用户职位状态统计
 *     tags: [用户职位关联]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取状态统计
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 获取状态统计成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     new:
 *                       type: number
 *                       example: 5
 *                     applied:
 *                       type: number
 *                       example: 3
 *                     interviewing:
 *                       type: number
 *                       example: 2
 *                     offer:
 *                       type: number
 *                       example: 1
 *                     rejected:
 *                       type: number
 *                       example: 0
 *                     withdrawn:
 *                       type: number
 *                       example: 0
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stats/status', getStatusStats);

export default router; 