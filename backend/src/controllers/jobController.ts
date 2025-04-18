import { Request, Response, NextFunction } from 'express';
import Job from '../models/jobModel';
import UserJob from '../models/userJobModel';
import { AppError, createApiResponse } from '../middleware/errorHandler';

/**
 * @desc    获取所有职位
 * @route   GET /api/v1/jobs
 * @access  私有
 */
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 构建查询条件
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 高级筛选
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // 查询数据
    let query = Job.find(JSON.parse(queryStr));

    // 排序
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 字段限制
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 分页
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // 执行查询
    const jobs = await query;
    
    // 获取总数
    const total = await Job.countDocuments(JSON.parse(queryStr));

    // 返回结果
    res.status(200).json(createApiResponse(
      200,
      '获取职位列表成功',
      {
        total,
        page,
        size: limit,
        data: jobs,
        totalPages: Math.ceil(total / limit)
      }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取单个职位
 * @route   GET /api/v1/jobs/:id
 * @access  私有
 */
export const getJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('未找到该职位', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '获取职位详情成功',
      job
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    创建职位
 * @route   POST /api/v1/jobs
 * @access  私有
 */
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Job.create(req.body);

    // 如果有用户，自动创建用户-职位关联
    if (req.user) {
      await UserJob.create({
        userId: req.user._id,
        jobId: job._id,
        status: 'new',
      });
    }

    res.status(201).json(createApiResponse(
      200,
      '创建职位成功',
      job
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新职位
 * @route   PUT /api/v1/jobs/:id
 * @access  私有/管理员
 */
export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return next(new AppError('未找到该职位', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新职位成功',
      job
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除职位
 * @route   DELETE /api/v1/jobs/:id
 * @access  私有/管理员
 */
export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return next(new AppError('未找到该职位', 404));
    }

    // 删除所有相关的用户-职位关联
    await UserJob.deleteMany({ jobId: req.params.id });

    res.status(200).json(createApiResponse(
      200,
      '删除职位成功',
      null
    ));
  } catch (error) {
    next(error);
  }
}; 