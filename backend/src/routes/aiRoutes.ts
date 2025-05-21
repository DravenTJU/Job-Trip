import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { generateCoverLetter } from '../controllers/aiController';

const router = express.Router();

/**
 * @swagger
 * /api/v1/ai/cover-letter:
 *   post:
 *     summary: 生成求职信
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobDescription:
 *                 type: string
 *                 description: 职位描述（当不提供jobId时必需）
 *               tone:
 *                 type: string
 *                 enum: [professional, friendly, confident, creative]
 *                 default: professional
 *                 description: 语气风格
 *               language:
 *                 type: string
 *                 enum: [chinese, english]
 *                 default: chinese
 *                 description: 语言
 *               resumeId:
 *                 type: string
 *                 description: 简历ID（可选）
 *               jobId:
 *                 type: string
 *                 description: 职位ID（可选，提供则自动获取职位信息）
 *               user:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   experience:
 *                     type: string
 *                   education:
 *                     type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: 成功生成求职信
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 求职信生成成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     coverLetter:
 *                       type: string
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权访问
 *       500:
 *         description: 服务器内部错误
 */
router.post('/cover-letter', protect, generateCoverLetter);

export default router; 