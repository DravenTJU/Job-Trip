import { Request, Response, NextFunction } from 'express';
import Company from '../models/companyModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';

/**
 * @desc    获取所有公司
 * @route   GET /api/v1/companies
 * @access  私有
 */
export const getCompanies = async (
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
    let query = Company.find(JSON.parse(queryStr));

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
    const companies = await query;
    
    // 获取总数
    const total = await Company.countDocuments(JSON.parse(queryStr));

    // 返回结果
    res.status(200).json(createApiResponse(
      200,
      '获取公司列表成功',
      {
        total,
        page,
        size: limit,
        data: companies,
        totalPages: Math.ceil(total / limit)
      }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取单个公司
 * @route   GET /api/v1/companies/:id
 * @access  私有
 */
export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new AppError('未找到该公司', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '获取公司详情成功',
      company
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    创建公司
 * @route   POST /api/v1/companies
 * @access  私有
 */
export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json(createApiResponse(
      200,
      '创建公司成功',
      company
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新公司
 * @route   PUT /api/v1/companies/:id
 * @access  私有
 */
export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return next(new AppError('未找到该公司', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新公司成功',
      company
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除公司
 * @route   DELETE /api/v1/companies/:id
 * @access  私有/管理员
 */
export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return next(new AppError('未找到该公司', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除公司成功',
      null
    ));
  } catch (error) {
    next(error);
  }
}; 