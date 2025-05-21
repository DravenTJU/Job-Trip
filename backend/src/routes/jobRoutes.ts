import express from 'express';
import {
  getJobs,
  getJob,
  createJobs,
  updateJob,
  deleteJob,
  getUserRelatedJobs
} from '../controllers/jobController';
import { protect } from '../middleware/authMiddleware';
import UserJob from '../models/userJobModel';
import ApplicationHistory from '../models/applicationHistoryModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';
import Job from '../models/jobModel';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 职位
 *   description: 职位管理API
 */

// 所有路由都受protect保护
router.use(protect);

// POST / - 创建单个或批量职位
router.post('/', createJobs); 

// 获取用户关联的职位列表
router.get('/user', getUserRelatedJobs);

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
 *     summary: 创建新职位(单个或批量)
 *     tags: [职位]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - platform
 *                   - title
 *                   - company
 *                   - location
 *                   - source
 *                   - sourceId
 *                   - sourceUrl
 *                 properties:
 *                   platform:
 *                     type: string
 *                     description: 求职平台名称
 *                   title:
 *                     type: string
 *                     description: 职位标题
 *                   company:
 *                     type: string
 *                     description: 公司名称
 *                   location:
 *                     type: string
 *                     description: 工作地点
 *                   description:
 *                     type: string
 *                     description: 职位描述
 *                   requirements:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: 职位要求
 *                   salary:
 *                     type: string
 *                     description: 薪资范围，例如："100k-130k NZD"
 *                   jobType:
 *                     type: string
 *                     enum: [full-time, part-time, contract, freelance, internship, n-a]
 *                     default: n/a
 *                   status:
 *                     type: string
 *                     enum: [new, applied, interviewing, offer, rejected, withdrawn, closed]
 *                     default: new
 *                   source:
 *                     type: string
 *                     enum: [linkedin, seek, indeed, manual, other]
 *                   sourceId:
 *                     type: string
 *                     description: 平台职位原始ID
 *                   sourceUrl:
 *                     type: string
 *                     description: 原始链接
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *                     description: 截止日期
 *                   notes:
 *                     type: string
 *                     description: 备注
 *               - type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - platform
 *                     - title
 *                     - company
 *                     - location
 *     responses:
 *       201:
 *         description: 职位创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *             example:
 *               code: 201
 *               message: "创建职位成功"
 *               data:
 *                 job:
 *                   _id: "60d5f8b74c4ba52d4038a2c1"
 *                   platform: "seek"
 *                   title: "Web开发工程师"
 *                   company: "科技有限公司"
 *                   location: "奥克兰, 新西兰"
 *                   description: "负责公司网站的开发和维护"
 *                   jobType: "full-time"
 *                   status: "new"
 *                   source: "seek"
 *                   sourceId: "12345"
 *                   sourceUrl: "https://seek.co.nz/job/12345"
 *                   createdAt: "2021-06-25T14:55:34.567Z"
 *                   updatedAt: "2021-06-25T14:55:34.567Z"
 *                 userJob:
 *                   _id: "60d5f8b74c4ba52d4038a2c2"
 *                   userId: "60d5f8b74c4ba52d4038a2c3"
 *                   jobId: "60e5f8b74c4ba52d4038a2c1"
 *                   status: "new"
 *                   createdAt: "2021-06-25T14:55:34.567Z"
 *                   updatedAt: "2021-06-25T14:55:34.567Z"
 *       207:
 *         description: 批量处理职位完成
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 207
 *                 message:
 *                   type: string
 *                   example: "批量处理职位完成"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 5
 *                     succeeded:
 *                       type: number
 *                       example: 4
 *                     failed:
 *                       type: number
 *                       example: 1
 *                     createdJobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           error:
 *                             type: string
 *                           jobDetails:
 *                             type: object
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getJobs);

// 更新职位状态 - 实际上是更新用户-职位关联的状态
router.put('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 查找或创建用户-职位关联
    let userJob = await UserJob.findOne({ userId, jobId: id });
    
    if (!userJob) {
      // 如果不存在关联，创建新关联
      userJob = await UserJob.create({
        userId,
        jobId: id,
        status,
        isFavorite: false
      });
      
      // 创建状态历史记录
      await ApplicationHistory.create({
        userJobId: userJob._id,
        previousStatus: '',
        newStatus: status,
        notes: '初始状态',
        updatedBy: userId
      });
    } else {
      // 记录之前的状态
      const previousStatus = userJob.status;
      
      // 更新状态
      userJob.status = status;
      await userJob.save();
      
      // 创建状态变更历史
      if (previousStatus !== status) {
        await ApplicationHistory.create({
          userJobId: userJob._id,
          previousStatus,
          newStatus: status,
          notes: req.body.notes || '',
          updatedBy: userId
        });
      }
    }

    // 获取完整的职位信息
    const job = await Job.findById(id);
    
    if (!job) {
      return next(new AppError('职位不存在', 404));
    }

    // 创建响应对象，使用明确的对象而非spread
    const responseData = {
      _id: job._id,
      platform: job.platform,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      jobType: job.jobType,
      source: job.source,
      sourceId: job.sourceId,
      sourceUrl: job.sourceUrl,
      deadline: job.deadline,
      notes: job.notes,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      // 添加UserJob特有字段
      status: userJob.status,
      userJobId: userJob._id
    };

    // 返回结果
    res.status(200).json(createApiResponse(
      200,
      '更新职位状态成功',
      responseData
    ));
  } catch (error) {
    next(error);
  }
});

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
 *                 salary: "70k-90k NZD"
 *                 jobType: "full-time"
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
 *                 enum: [full-time, part-time, contract, freelance, internship, n-a]
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
router.get('/:id', getJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router; 