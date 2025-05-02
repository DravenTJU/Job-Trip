import { Request, Response, NextFunction } from 'express';
import Resume, { ResumeType } from '../models/resumeModel';
import { AppError, createApiResponse } from '../middleware/errorHandler';

/**
 * @desc    获取用户的所有简历
 * @route   GET /api/v1/resumes
 * @access  私有
 */
export const getResumes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 构建查询条件 - 只返回当前用户的简历
    const queryObj = { ...req.query, user: req.user?._id };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 高级筛选
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // 查询数据
    let query = Resume.find(JSON.parse(queryStr));

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
    const resumes = await query;
    
    // 获取总数
    const total = await Resume.countDocuments(JSON.parse(queryStr));

    // 返回结果
    res.status(200).json(createApiResponse(
      200,
      '获取简历列表成功',
      {
        total,
        page,
        size: limit,
        data: resumes,
        totalPages: Math.ceil(total / limit)
      }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取单个简历
 * @route   GET /api/v1/resumes/:id
 * @access  私有
 */
export const getResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '获取简历详情成功',
      resume
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    创建简历
 * @route   POST /api/v1/resumes
 * @access  私有
 */
export const createResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 确保设置当前用户为简历所有者
    const resumeData = {
      ...req.body,
      user: req.user?._id
    };

    // 根据type设置tailored字段
    if (resumeData.type === ResumeType.TAILORED) {
      resumeData.tailored = true;
    }

    const resume = await Resume.create(resumeData);

    res.status(201).json(createApiResponse(
      200,
      '创建简历成功',
      resume
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新简历
 * @route   PUT /api/v1/resumes/:id
 * @access  私有
 */
export const updateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 确保只能更新自己的简历
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新简历成功',
      resume
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除简历
 * @route   DELETE /api/v1/resumes/:id
 * @access  私有
 */
export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 确保只能删除自己的简历
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除简历成功',
      null
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    复制简历
 * @route   POST /api/v1/resumes/:id/duplicate
 * @access  私有
 */
export const duplicateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 查找原始简历
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!originalResume) {
      return next(new AppError('未找到该简历', 404));
    }

    // 创建新简历数据
    const newResumeData = {
      name: `${originalResume.name} (副本)`,
      user: req.user?._id,
      content: originalResume.content,
      type: originalResume.type,
      targetPosition: originalResume.targetPosition,
      targetJob: originalResume.targetJob,
      tailored: originalResume.tailored,
      thumbnail: originalResume.thumbnail
    };

    // 创建新简历
    const newResume = await Resume.create(newResumeData);

    res.status(201).json(createApiResponse(
      200,
      '复制简历成功',
      newResume
    ));
  } catch (error) {
    next(error);
  }
};