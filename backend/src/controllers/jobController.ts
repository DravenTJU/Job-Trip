import { Request, Response, NextFunction } from 'express';
import Job from '../models/jobModel';
import UserJob from '../models/userJobModel';
import { AppError, createApiResponse } from '../middleware/errorHandler';
import ApplicationHistory from '../models/applicationHistoryModel';

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
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 初始化查询对象
    const finalQuery: any = {};
    const sortOptions: any = {};

    console.log('[Backend] Received query parameters:', req.query);

    // 处理状态过滤
    if (req.query.status) {
      finalQuery.status = req.query.status;
      console.log('[Backend] Adding status filter:', req.query.status);
    }

    // 处理工作类型过滤
    if (req.query.jobType) {
      finalQuery.jobType = req.query.jobType;
      console.log('[Backend] Adding jobType filter:', req.query.jobType);
    }

    // 处理平台过滤
    if (req.query.platform) {
      finalQuery.platform = req.query.platform;
      console.log('[Backend] Adding platform filter:', req.query.platform);
    }

    // 处理位置过滤
    if (req.query.location) {
      finalQuery.location = { $regex: String(req.query.location), $options: 'i' };
      console.log('[Backend] Adding location filter:', req.query.location);
    }

    // 处理薪资范围过滤
    if (req.query.salaryRange) {
      const salaryRange = req.query.salaryRange as string;
      console.log('[Backend] Processing salary range:', salaryRange);
      
      // 分页参数
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      if (salaryRange === '') {
        // 默认排序，不做任何处理
        console.log('[Backend] Using default salary sort');
      } else if (salaryRange === 'asc' || salaryRange === 'desc') {
        // 处理排序 - 使用聚合管道来处理薪资范围
        const jobs = await Job.aggregate([
          { $match: finalQuery },
          {
            $addFields: {
              numericSalary: {
                $let: {
                  vars: {
                    // 移除所有非数字字符，保留数字、小数点和连字符
                    cleanSalary: {
                      $replaceAll: {
                        input: { $toLower: "$salary" },
                        find: "k",
                        replacement: ""
                      }
                    }
                  },
                  in: {
                    $cond: {
                      if: { $eq: [{ $indexOfBytes: ["$$cleanSalary", "-"] }, -1] },
                      // 如果不是范围，直接转换为数字
                      then: { $toDouble: "$$cleanSalary" },
                      // 如果是范围，取第一个数字（最小值）
                      else: {
                        $toDouble: {
                          $arrayElemAt: [
                            { $split: ["$$cleanSalary", "-"] },
                            0
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          { $sort: { numericSalary: salaryRange === 'desc' ? -1 : 1 } },
          { $skip: skip },
          { $limit: limit }
        ]);

        // 获取总数
        const total = await Job.countDocuments(finalQuery);
        console.log(`[Backend] Total documents matching query: ${total}`);

        // 返回结果
        return res.status(200).json(createApiResponse(
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
      } else {
        // 处理范围过滤
        const [min, max] = salaryRange.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          finalQuery.$where = function() {
            const salary = this.salary;
            if (!salary) return false;
            
            // 移除所有非数字字符，保留数字和小数点
            const cleanSalary = salary.replace(/[^\d.]/g, '');
            const salaryNum = parseFloat(cleanSalary);
            
            return salaryNum >= min && salaryNum <= max;
          };
          console.log('[Backend] Added salary range filter:', min, '-', max);
        }
      }
    }

    // 处理日期范围过滤
    if (req.query.dateRange) {
      const [startDate, endDate] = (req.query.dateRange as string).split(',');
      if (startDate && endDate) {
        finalQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
        console.log('[Backend] Adding date range filter:', startDate, 'to', endDate);
      }
    }

    // 处理排序
    if (req.query.sort) {
      const sortStr = req.query.sort as string;
      // 支持 -createdAt 这种写法
      if (sortStr.startsWith('-')) {
        sortOptions[sortStr.slice(1)] = -1;
      } else {
        sortOptions[sortStr] = 1;
      }
    }

    // 添加搜索逻辑
    if (req.query.search) {
      console.log(`[Backend] Received search term: ${req.query.search}`);
      const searchRegex = new RegExp(req.query.search as string, 'i');
      finalQuery.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex }
      ];
    }
    
    console.log('[Backend] Final query:', finalQuery);

    try {
      // 分页
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // 执行查询
      const jobs = await Job.find(finalQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      // 获取总数
      const total = await Job.countDocuments(finalQuery);
      console.log(`[Backend] Total documents matching query: ${total}`);

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
      console.error('[Backend] Error in getJobs:', error);
      next(error);
    }
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

/**
 * @desc    从浏览器插件创建职位并关联到用户
 * @route   POST /api/v1/jobs/extension
 * @access  私有
 */
export const createJobFromExtension = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 创建职位记录
    const job = await Job.create({
      ...req.body,
      source: 'extension', // 标记数据来源
      createdBy: req.user?._id
    });

    // 2. 创建用户-职位关联
    const userJob = await UserJob.create({
      userId: req.user?._id,
      jobId: job._id,
      status: 'new',
      notes: req.body.notes || '通过浏览器插件添加'
    });

    // 3. 创建申请历史记录
    await ApplicationHistory.create({
      userJobId: userJob._id,
      previousStatus: '',
      newStatus: 'new',
      notes: '初始状态 - 通过浏览器插件添加',
      updatedBy: req.user?._id,
    });

    // 4. 返回结果
    res.status(201).json(createApiResponse(
      201,
      '职位创建成功',
      {
        job,
        userJob
      }
    ));
  } catch (error) {
    next(error);
  }
}; 