import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  updatePassword,
  logoutUser
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 用户
 *   description: 用户管理API
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: 注册新用户
 *     tags: [用户]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用户邮箱
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 密码
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 description: 名
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: 姓
 *                 example: Doe
 *               preferences:
 *                 type: object
 *                 properties:
 *                   theme:
 *                     type: string
 *                     enum: [light, dark, system]
 *                     default: light
 *                   notifications:
 *                     type: boolean
 *                     default: true
 *                   language:
 *                     type: string
 *                     enum: [zh-CN, en-US]
 *                     default: zh-CN
 *     responses:
 *       201:
 *         description: 用户注册成功，返回用户信息和JWT令牌
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               code: 200
 *               message: "用户注册成功"
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   id: "60d5f8b74c4ba52d4038a2b6"
 *                   username: "johndoe"
 *                   email: "john@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   preferences:
 *                     theme: "light"
 *                     notifications: true
 *                     language: "zh-CN"
 *                   status: "active"
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       400:
 *         description: 验证错误或用户已存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 用户登录
 *     tags: [用户]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用户邮箱
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功，返回用户信息和JWT令牌
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               code: 200
 *               message: "登录成功"
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   id: "60d5f8b74c4ba52d4038a2b6"
 *                   username: "johndoe"
 *                   email: "john@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   preferences:
 *                     theme: "light"
 *                     notifications: true
 *                     language: "zh-CN"
 *                   status: "active"
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       400:
 *         description: 验证错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 无效的凭据
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 获取当前登录用户信息
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功返回用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               code: 200
 *               message: "获取用户信息成功"
 *               data:
 *                 id: "60d5f8b74c4ba52d4038a2b6"
 *                 username: "johndoe"
 *                 email: "john@example.com"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 preferences:
 *                   theme: "light"
 *                   notifications: true
 *                   language: "zh-CN"
 *                 status: "active"
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
 */
router.get('/me', protect, getCurrentUser);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: 更新当前用户信息
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               preferences:
 *                 type: object
 *                 properties:
 *                   theme:
 *                     type: string
 *                     enum: [light, dark, system]
 *                   notifications:
 *                     type: boolean
 *                   language:
 *                     type: string
 *                     enum: [zh-CN, en-US]
 *     responses:
 *       200:
 *         description: 用户信息更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               code: 200
 *               message: "用户信息更新成功"
 *               data:
 *                 id: "60d5f8b74c4ba52d4038a2b6"
 *                 username: "johndoe_updated"
 *                 email: "john@example.com"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 preferences:
 *                   theme: "dark"
 *                   notifications: true
 *                   language: "zh-CN"
 *                 status: "active"
 *                 createdAt: "2021-06-25T14:55:34.567Z"
 *                 updatedAt: "2021-06-26T10:30:22.123Z"
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       400:
 *         description: 验证错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/me', protect, updateUser);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: 更新用户密码
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: 当前密码
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: 新密码
 *     responses:
 *       200:
 *         description: 密码更新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *             example:
 *               code: 200
 *               message: "密码更新成功"
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               timestamp: 1629789258000
 *               traceId: "1629789258000-abc123"
 *       400:
 *         description: 验证错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 当前密码不正确
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/password', protect, updatePassword);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: 用户退出登录
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 用户退出登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               code: 200
 *               message: "用户退出登录成功"
 *               data: {}
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/logout', protect, logoutUser);

export default router; 