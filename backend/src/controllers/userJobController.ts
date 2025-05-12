import { Request, Response, NextFunction } from 'express';
import UserJob from '../models/userJobModel';
import Job from '../models/jobModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';

/**
 * @desc    获取用户的所有职位申请
 * @route   GET /api/v1/userjobs
 * @access  私有
 */
export const getUserJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从经过认证的请求中获取用户ID
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 构建基本查询
    const queryObj: Record<string, any> = { userId };

    // 添加其他查询条件
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    if (req.query.jobId) {
      queryObj.jobId = req.query.jobId;
    }

    // 准备查询
    let query = UserJob.find(queryObj)
      .populate({
        path: 'jobId',
        select: 'title company location salary description',
      });

    // 排序
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 分页
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // 执行查询
    const userJobs = await query;
    
    // 获取总数
    const total = await UserJob.countDocuments(queryObj);

    // 返回结果
    res.status(200).json(createApiResponse(
      200,
      '获取用户职位申请列表成功',
      {
        total,
        page,
        size: limit,
        data: userJobs,
        totalPages: Math.ceil(total / limit)
      }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取单个用户-职位关联
 * @route   GET /api/v1/userjobs/:id
 * @access  私有
 */
export const getUserJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userJob = await UserJob.findById(req.params.id)
      .populate('jobId');

    // 检查是否找到
    if (!userJob) {
      return next(new AppError('未找到该关联记录', 404));
    }

    // 检查是否属于当前用户
    if (userJob.userId.toString() !== req.user?._id.toString()) {
      return next(new AppError('无权访问此关联记录', 403));
    }

    res.status(200).json({
      success: true,
      data: userJob,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    创建用户-职位关联
 * @route   POST /api/v1/userjobs
 * @access  私有
 */
export const createUserJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 确保只能为当前用户创建关联
    const userId = req.user?._id;
    
    // 创建关联
    const userJob = await UserJob.create({
      ...req.body,
      userId,
    });

    // 创建状态历史记录
    await ApplicationHistory.create({
      userJobId: userJob._id,
      previousStatus: '',
      newStatus: userJob.status,
      notes: '初始状态',
      updatedBy: userId,
    });

    // 返回结果
    res.status(201).json({
      success: true,
      data: userJob,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新用户-职位关联
 * @route   PUT /api/v1/userjobs/:id
 * @access  私有
 */
export const updateUserJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 查找现有关联
    const existingUserJob = await UserJob.findById(req.params.id);
    
    // 检查是否找到
    if (!existingUserJob) {
      return next(new AppError('未找到该关联记录', 404));
    }
    
    // 检查是否属于当前用户
    if (existingUserJob.userId.toString() !== req.user?._id.toString()) {
      return next(new AppError('无权更新此关联记录', 403));
    }

    // 获取之前的状态
    const previousStatus = existingUserJob.status;
    
    // 更新关联
    const userJob = await UserJob.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // 如果状态改变，创建历史记录
    if (userJob && req.body.status && previousStatus !== req.body.status) {
      await ApplicationHistory.create({
        userJobId: userJob._id,
        previousStatus,
        newStatus: userJob.status,
        notes: req.body.notes || '',
        updatedBy: req.user?._id,
      });
    }

    // 返回结果
    res.status(200).json({
      success: true,
      data: userJob,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除用户-职位关联
 * @route   DELETE /api/v1/userjobs/:id
 * @access  私有
 */
export const deleteUserJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 查找现有关联
    const userJob = await UserJob.findById(req.params.id);
    
    // 检查是否找到
    if (!userJob) {
      return next(new AppError('未找到该关联记录', 404));
    }
    
    // 检查是否属于当前用户
    if (userJob.userId.toString() !== req.user?._id.toString()) {
      return next(new AppError('无权删除此关联记录', 403));
    }
    
    // 删除关联
    await UserJob.findByIdAndDelete(req.params.id);
    
    // 删除相关历史记录
    await ApplicationHistory.deleteMany({ userJobId: req.params.id });

    // 返回结果
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}; 