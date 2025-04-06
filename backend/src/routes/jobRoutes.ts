import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 职位
 *   description: 职位管理API
 */

// 所有路由都需要认证
router.use(protect);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 获取所有职位列表
 *     tags: [职位]
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
 *         description: 返回的字段，用逗号分隔，例如 "title,company,location"
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: 按平台筛选
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, applied, interviewing, offer, rejected, withdrawn, closed]
 *         description: 按状态筛选
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: 按公司名称筛选
 *     responses:
 *       200:
 *         description: 成功获取职位列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobListResponse'
 *             example:
 *               code: 200
 *               message: "获取职位列表成功"
 *               data:
 *                 total: 100
 *                 page: 1
 *                 size: 10
 *                 totalPages: 10
 *                 data:
 *                   - _id: "60d5f8b74c4ba52d4038a2c1"
 *                     platform: "seek"
 *                     title: "Web开发工程师"
 *                     company: "科技有限公司"
 *                     location: "奥克兰, 新西兰"
 *                     description: "负责公司网站的开发和维护"
 *                     jobType: "full-time"
 *                     status: "new"
 *                     source: "seek"
 *                     sourceId: "12345"
 *                     sourceUrl: "https://seek.co.nz/job/12345"
 *                     createdAt: "2021-06-25T14:55:34.567Z"
 *                     updatedAt: "2021-06-25T14:55:34.567Z"
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   post:
 *     summary: 创建新职位
 *     tags: [职位]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *               - title
 *               - company
 *               - location
 *               - source
 *               - sourceId
 *               - sourceUrl
 *             properties:
 *               platform:
 *                 type: string
 *                 description: 求职平台名称
 *               title:
 *                 type: string
 *                 description: 职位标题
 *               company:
 *                 type: string
 *                 description: 公司名称
 *               location:
 *                 type: string
 *                 description: 工作地点
 *               description:
 *                 type: string
 *                 description: 职位描述
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 职位要求
 *               salary:
 *                 type: string
 *                 description: 薪资范围，例如："100k-130k NZD"
 *               jobType:
 *                 type: string
 *                 enum: [full-time, part-time, contract, freelance, internship]
 *                 default: full-time
 *               status:
 *                 type: string
 *                 enum: [new, applied, interviewing, offer, rejected, withdrawn, closed]
 *                 default: new
 *               source:
 *                 type: string
 *                 enum: [linkedin, seek, indeed, manual, other]
 *               sourceId:
 *                 type: string
 *                 description: 平台职位原始ID
 *               sourceUrl:
 *                 type: string
 *                 description: 原始链接
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 截止日期
 *               notes:
 *                 type: string
 *                 description: 备注
 *     responses:
 *       201:
 *         description: 职位创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *             example:
 *               code: 200
 *               message: "创建职位成功"
 *               data:
 *                 _id: "60d5f8b74c4ba52d4038a2c1"
 *                 platform: "seek"
 *                 title: "Web开发工程师"
 *                 company: "科技有限公司"
 *                 location: "奥克兰, 新西兰"
 *                 description: "负责公司网站的开发和维护"
 *                 jobType: "full-time"
 *                 status: "new"
 *                 source: "seek"
 *                 sourceId: "12345"
 *                 sourceUrl: "https://seek.co.nz/job/12345"
 *                 createdAt: "2021-06-25T14:55:34.567Z"
 *                 updatedAt: "2021-06-25T14:55:34.567Z"
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route('/')
  .get(getJobs)
  .post(createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: 获取单个职位详情
 *     tags: [职位]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 职位ID
 *     responses:
 *       200:
 *         description: 成功获取职位详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *             example:
 *               code: 200
 *               message: "获取职位详情成功"
 *               data:
 *                 _id: "60d5f8b74c4ba52d4038a2c1"
 *                 platform: "seek"
 *                 title: "Web开发工程师"
 *                 company: "科技有限公司"
 *                 location: "奥克兰, 新西兰"
 *                 description: "负责公司网站的开发和维护"
 *                 requirements:
 *                   - "熟悉JavaScript, HTML, CSS"
 *                   - "有React或Angular经验"
 *                   - "了解后端开发"
 *                 salary: "70k-90k NZD",
 *                 jobType: "full-time",
 *                 status: "new"
 *                 source: "seek"
 *                 sourceId: "12345"
 *                 sourceUrl: "https://seek.co.nz/job/12345"
 *                 createdAt: "2021-06-25T14:55:34.567Z"
 *                 updatedAt: "2021-06-25T14:55:34.567Z"
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   put:
 *     summary: 更新职位信息
 *     tags: [职位]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 职位ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               salary:
 *                 type: string
 *                 description: 薪资范围，例如："100k-130k NZD"
 *               jobType:
 *                 type: string
 *                 enum: [full-time, part-time, contract, freelance, internship]
 *               status:
 *                 type: string
 *                 enum: [new, applied, interviewing, offer, rejected, withdrawn, closed]
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: 职位更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *             example:
 *               code: 200
 *               message: "更新职位成功"
 *               data:
 *                 _id: "60d5f8b74c4ba52d4038a2c1"
 *                 platform: "seek"
 *                 title: "高级Web开发工程师"
 *                 company: "科技有限公司"
 *                 location: "奥克兰, 新西兰"
 *                 description: "负责公司网站的开发和维护，领导团队"
 *                 requirements:
 *                   - "精通JavaScript, HTML, CSS"
 *                   - "熟悉React或Angular"
 *                   - "了解后端开发"
 *                 status: "applied"
 *                 source: "seek"
 *                 sourceId: "12345"
 *                 sourceUrl: "https://seek.co.nz/job/12345"
 *                 createdAt: "2021-06-25T14:55:34.567Z"
 *                 updatedAt: "2021-06-26T10:30:22.123Z"
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     summary: 删除职位
 *     tags: [职位]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 职位ID
 *     responses:
 *       200:
 *         description: 职位删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               code: 200
 *               message: "删除职位成功"
 *               data: null
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route('/:id')
  .get(getJob)
  .put(updateJob)
  .delete(deleteJob);

export default router; 