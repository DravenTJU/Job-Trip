# Job-Trip 状态统计API实现计划

## 1. 需求概述

实现一个新的API接口，用于获取用户不同状态的职位数量统计，以支持前端Dashboard页面中的统计卡片功能。

## 2. 技术规范

### 2.1 API端点规范

- **路径**: `/api/v1/userjobs/stats/status`
- **方法**: GET
- **认证**: 需要用户登录
- **响应格式**: 
  ```typescript
  {
    "success": true,
    "code": 200,
    "message": "获取状态统计成功",
    "data": {
      "new": 5,
      "applied": 3,
      "interviewing": 2,
      "offer": 1,
      "rejected": 0,
      "withdrawn": 0
    }
  }
  ```

### 2.2 实现细节

需要修改的文件：
1. `backend/src/controllers/userJobController.ts` - 添加新的控制器函数
2. `backend/src/routes/userJobRoutes.ts` - 添加新的路由

## 3. 具体实现步骤

### 3.1 创建控制器函数

在`userJobController.ts`文件中添加获取统计数据的新函数:

```typescript
/**
 * @desc    获取用户职位状态统计
 * @route   GET /api/v1/userjobs/stats/status
 * @access  私有
 */
export const getStatusStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 使用MongoDB聚合管道获取各状态的数量
    const stats = await UserJob.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 初始化所有可能状态的计数为0
    const result: Record<string, number> = {
      new: 0,
      not_interested: 0
      pending: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      closed: 0
    };

    // 填充实际计数
    stats.forEach((stat) => {
      if (stat._id) {
        result[stat._id] = stat.count;
      }
    });

    res.status(200).json(createApiResponse(
      200,
      '获取状态统计成功',
      result
    ));
  } catch (error) {
    next(error);
  }
};
```

### 3.2 添加新路由

在`userJobRoutes.ts`文件中添加新的路由:

```typescript
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
```

## 4. 验证测试方法

手动测试:
1. 使用Postman/curl发送请求到`/api/v1/userjobs/stats/status`
2. 确认响应格式是否符合预期
3. 在前端Dashboard页面测试统计卡片是否正确显示数据

## 5. 实施检查清单:

1. 在userJobController.ts中导入所需的模块和类型
2. 在userJobController.ts中实现getStatusStats控制器函数
3. 导出getStatusStats函数
4. 在userJobRoutes.ts中导入新的getStatusStats函数
5. 在userJobRoutes.ts中为/stats/status路径添加GET路由
6. 重启Node.js服务器测试新接口
7. 在浏览器中验证前端Dashboard页面是否正确显示统计数据 