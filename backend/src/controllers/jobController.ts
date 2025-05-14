import { Request, Response, NextFunction } from 'express';
import Job from '../models/jobModel';
import UserJob from '../models/userJobModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';
import ApplicationHistory from '../models/applicationHistoryModel';
import jwt from 'jsonwebtoken';

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
            pages: Math.max(1, Math.ceil(total / limit))
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
          pages: Math.max(1, Math.ceil(total / limit))
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

// 字段映射表
const jobTypeMap: Record<string, string> = {
  'Contract': 'contract',
  'Full-time': 'full-time',
  'Part-time': 'part-time',
  'Freelance': 'freelance',
  'Internship': 'internship',
};

// 平台映射表
const platformMap: Record<string, string> = {
  'LinkedIn': 'linkedin',
  'Seek': 'seek',
  'Indeed': 'indeed',
  'Manual': 'manual',
};

/**
 * 修复职位字段
 * 将平台提供的字段映射到系统字段
 */
function fixJobFields(job: any) {
  // 修复工作类型
  if (job.jobType && jobTypeMap[job.jobType]) {
    job.jobType = jobTypeMap[job.jobType];
  }

  // 修复平台名称
  if (job.platform && platformMap[job.platform]) {
    job.platform = platformMap[job.platform];
  }

  return job;
}

/**
 * @desc    创建新职位
 * @route   POST /api/v1/jobs
 * @access  私有
 */
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let jobData = req.body;
    
    // 检查是否包含userToken
    const userToken = jobData.userToken;
    if (userToken) {
      // 从token中提取用户ID
      try {
        const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
        const decoded = jwt.verify(userToken, jwtSecret) as { id: string };
        const userId = decoded.id;
        
        // 删除userToken，不保存到职位中
        delete jobData.userToken;
        
        // 修复字段
        jobData = fixJobFields(jobData);
        
        // 创建职位
        const job = await Job.create(jobData);

        // 自动创建用户-职位关联
        await UserJob.create({
          userId,
          jobId: job._id,
          status: jobData.status || 'new',
          isFavorite: jobData.isFavorite || false,
        });

        // 创建应用历史记录
        await ApplicationHistory.create({
          userJobId: job._id,
          previousStatus: '',
          newStatus: 'new',
          notes: '自动创建',
          updatedBy: userId,
        });

        // 返回结果
        res.status(201).json(createApiResponse(
          201,
          '创建职位成功',
          job
        ));
      } catch (error) {
        // Token验证失败，继续以常规方式创建职位
        console.error('Token验证失败:', error);
        
        // 修复字段
        jobData = fixJobFields(jobData);
        
        // 创建职位
        const job = await Job.create(jobData);
        res.status(201).json(createApiResponse(
          201,
          '创建职位成功',
          job
        ));
      }
    } else {
      // 修复字段
      jobData = fixJobFields(jobData);
      
      // 创建职位
      const job = await Job.create(jobData);
      res.status(201).json(createApiResponse(
        201,
        '创建职位成功',
        job
      ));
    }
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
 * @desc    从浏览器扩展创建职位
 * @route   POST /api/v1/jobs/extension
 * @access  私有
 */
export const createJobFromExtension = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { job, userToken } = req.body;

    if (!job) {
      return next(new AppError('职位数据不能为空', 400));
    }

    if (!userToken) {
      return next(new AppError('用户令牌不能为空', 400));
    }

    // 验证令牌并提取用户ID
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    const decoded = jwt.verify(userToken, jwtSecret) as { id: string };
    const userId = decoded.id;

    // 修复字段
    const jobData = {
      ...job,
      source: job.platform?.toLowerCase() || 'manual',
      sourceId: job.sourceId || `manual-${Date.now()}`,
      sourceUrl: job.sourceUrl || '',
    };

    // 检查该职位是否已存在
    let existingJob = null;
    if (jobData.sourceId && jobData.platform) {
      existingJob = await Job.findOne({
        sourceId: jobData.sourceId,
        platform: jobData.platform
      });
    }

    let createdJob;
    if (existingJob) {
      // 如果职位已存在，更新它
      createdJob = await Job.findByIdAndUpdate(
        existingJob._id,
        jobData,
        { new: true, runValidators: true }
      );
    } else {
      // 否则创建新职位
      createdJob = await Job.create(jobData);
    }

    // 创建或更新用户-职位关联
    let userJob = await UserJob.findOne({
      userId,
      jobId: createdJob._id
    });

    if (!userJob) {
      // 如果关联不存在，创建新关联
      userJob = await UserJob.create({
        userId,
        jobId: createdJob._id,
        status: 'new', // 默认状态为新职位
        isFavorite: false
      });

      // 创建状态历史记录
      await ApplicationHistory.create({
        userJobId: userJob._id,
        previousStatus: '',
        newStatus: 'new',
        notes: '从浏览器扩展创建',
        updatedBy: userId
      });
    }

    // 返回结果
    res.status(201).json(createApiResponse(
      201,
      existingJob ? '更新职位成功' : '创建职位成功',
      {
        job: createdJob,
        userJob
      }
    ));
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('无效的用户令牌', 401));
    }
    next(error);
  }
};

/**
 * @desc    批量导入职位
 * @route   POST /api/v1/jobs/batch
 * @access  私有
 */
export const createJobsBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobs, userToken } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return next(new AppError('职位列表不能为空', 400));
    }

    if (!userToken) {
      return next(new AppError('用户令牌不能为空', 400));
    }

    // 验证用户令牌并获取用户ID
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET as string) as { id: string };
    const userId = decoded.id;

    // 批量创建职位
    const createdJobs = await Job.insertMany(jobs);

    // 创建用户职位关联
    const userJobs = createdJobs.map(job => ({
      userId,
      jobId: job._id,
      status: job.status || 'unapplied',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await UserJob.insertMany(userJobs);

    res.status(201).json(createApiResponse(
      201,
      '批量导入职位成功',
      {
        total: createdJobs.length,
        jobs: createdJobs
      }
    ));
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('无效的用户令牌', 401));
    }
    next(error);
  }
};

/**
 * @desc    获取用户关联的职位列表
 * @route   GET /api/v1/jobs/user
 * @access  私有
 */
export const getUserRelatedJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 构建查询条件
    const queryObj: any = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 处理状态过滤
    const userJobQuery: any = { userId };
    if (queryObj.status) {
      userJobQuery.status = queryObj.status;
      delete queryObj.status;
    }

    // 分页
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 排序
    const sortOption = {};
    if (req.query.sort) {
      const sortStr = req.query.sort as string;
      if (sortStr.startsWith('-')) {
        sortOption[sortStr.slice(1)] = -1;
      } else {
        sortOption[sortStr] = 1;
      }
    } else {
      sortOption['createdAt'] = -1;
    }

    // 执行用户职位关联查询
    const userJobs = await UserJob.find(userJobQuery)
      .populate({
        path: 'jobId',
        match: queryObj,
        select: 'title company location description salary jobType platform sourceUrl createdAt updatedAt'
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // 过滤掉jobId为null的结果（当职位不匹配queryObj条件时）
    const filteredUserJobs = userJobs.filter(userJob => userJob.jobId);

    // 格式化数据
    const jobs = filteredUserJobs.map(userJob => {
      const job = userJob.jobId as any;
      return {
        ...job.toObject(),
        status: userJob.status,
        isFavorite: userJob.isFavorite,
        userJobId: userJob._id,
        customTags: userJob.customTags,
        notes: userJob.notes,
        reminderDate: userJob.reminderDate
      };
    });

    // 获取总数（考虑到过滤）
    const totalUserJobs = await UserJob.countDocuments(userJobQuery);
    
    // 简单估算总页数（这不完全准确，因为我们在查询后进行了过滤）
    const estimatedPages = Math.max(1, Math.ceil(totalUserJobs / limit));

    // 返回结果
    res.status(200).json(createApiResponse(
      200,
      '获取用户关联职位列表成功',
      {
        total: filteredUserJobs.length,
        page,
        size: limit,
        data: jobs,
        pages: estimatedPages
      }
    ));
  } catch (error) {
    next(error);
  }
}; 