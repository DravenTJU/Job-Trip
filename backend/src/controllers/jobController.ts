import { Request, Response, NextFunction } from 'express';
import Job from '../models/jobModel';
import UserJob from '../models/userJobModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';
import ApplicationHistory from '../models/applicationHistoryModel';
import Company from '../models/companyModel';

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

    // 转换为普通对象并扩展类型
    let jobData = job.toObject() as any;

    // Get current user information
    if (req.user && req.user._id) {
      const userId = req.user._id;

      // Query UserJob record
      const userJob = await UserJob.findOne({ userId: userId, jobId: job._id });

      // If UserJob found, merge data
      if (userJob) {
        jobData.status = userJob.status;
        jobData.isFavorite = userJob.isFavorite;
        jobData.notes = userJob.notes || null;
        jobData.customTags = userJob.customTags || [];
        jobData.reminderDate = userJob.reminderDate || null;
        jobData.userJobId = userJob._id;
      } else {
        // If UserJob not found, set defaults for user-specific fields
        jobData.status = jobData.status || 'new';
        jobData.isFavorite = false;
        jobData.notes = null;
        jobData.customTags = [];
        jobData.reminderDate = null;
        jobData.userJobId = null;
      }
    } else {
      // User not available from req.user, potentially log this unexpected situation
      // For now, set default user-specific fields as if no UserJob was found
      console.warn(`User information not available in getJob for job ID: ${job._id}`);
      jobData.status = jobData.status || 'new';
      jobData.isFavorite = false;
      jobData.notes = null;
      jobData.customTags = [];
      jobData.reminderDate = null;
      jobData.userJobId = null;
    }

    // Return response with merged jobData
    res.status(200).json(createApiResponse(
      200,
      '获取职位详情成功',
      jobData
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * 修复职位字段大小写
 */
function fixJobFields(job: any) {
  // 修复工作类型
  if (job.jobType) {
    job.jobType = job.jobType.toLowerCase();
  }

  // 修复平台名称
  if (job.platform) {
    job.platform = job.platform.toLowerCase();
  }

  // 修复数据来源
  if (job.source) {
    job.source = job.source.toLowerCase();
  }

  return job;
}

/**
 * 查找或创建公司记录
 * @param companyName 公司名称
 * @param companyInfo 可选的公司信息
 * @param companyCache 可选的公司缓存，用于批量处理
 * @returns 公司ID
 */
const _findOrCreateCompany = async (
  companyName: string,
  companyInfo?: any,
  companyCache?: Map<string, string>
): Promise<string> => {
  // 如果有缓存，先从缓存中查找
  if (companyCache && companyCache.has(companyName)) {
    return companyCache.get(companyName) as string;
  }

  // 在数据库中查找公司
  let company = await Company.findOne({ 
    name: companyName,
  });

  // 如果不存在，则创建
  if (!company) {
    company = await Company.create({
      name: companyName,
      info: companyInfo || {},
    });
  }

  // 将结果存入缓存
  if (companyCache) {
    companyCache.set(companyName, company._id.toString());
  }

  return company._id.toString();
};

/**
 * 处理单个职位数据
 * @param jobData 职位数据
 * @param userId 用户ID
 * @param companyCache 可选的公司缓存，用于批量处理
 * @returns 处理结果
 */
const _processJobData = async (
  jobData: any,
  userId: string,
  companyCache?: Map<string, string>
): Promise<any> => {
  try {
    // 1. 数据提取与校验
    if (!jobData) {
      return { error: '职位数据不能为空', jobDetails: null };
    }

    // 修复和清理字段
    const cleanedJobData = fixJobFields({ ...jobData });
    
    // 确保必要字段存在
    if (!cleanedJobData.companyName && !cleanedJobData.company) {
      return { error: '缺少公司名称', jobDetails: cleanedJobData };
    }
    
    const companyName = cleanedJobData.companyName || cleanedJobData.company;
    
    // 确保有平台和sourceId
    cleanedJobData.platform = cleanedJobData.platform || 'manual';
    cleanedJobData.sourceId = cleanedJobData.sourceId || `manual-${Date.now()}`;
    cleanedJobData.sourceUrl = cleanedJobData.sourceUrl || '';
    cleanedJobData.source = cleanedJobData.source || cleanedJobData.platform.toLowerCase();
    
    // 2. 处理公司信息
    const companyId = await _findOrCreateCompany(
      companyName,
      cleanedJobData.companyInfo,
      companyCache
    );
    
    // 3. 职位唯一性检查
    let existingJob = null;
    if (cleanedJobData.sourceId && cleanedJobData.platform) {
      existingJob = await Job.findOne({
        sourceId: cleanedJobData.sourceId,
        platform: cleanedJobData.platform
      });
    }
    
    // 4. 创建或更新职位
    let job;
    if (existingJob) {
      // 如果职位已存在，更新它
      job = await Job.findByIdAndUpdate(
        existingJob._id,
        { ...cleanedJobData, companyId },
        { new: true, runValidators: true }
      );
    } else {
      // 创建新职位
      job = await Job.create({
        ...cleanedJobData,
        companyId,
      });
    }
    
    // 确保job不为null
    if (!job) {
      return { error: '创建或更新职位失败', jobDetails: cleanedJobData };
    }
    
    // 5. 创建/更新用户-职位关联
    let userJob = await UserJob.findOne({
      userId,
      jobId: job._id
    });
    
    if (!userJob) {
      // 如果关联不存在，创建新关联
      userJob = await UserJob.create({
        userId,
        jobId: job._id,
        status: cleanedJobData.status || 'new',
        isFavorite: cleanedJobData.isFavorite || false
      });
      
      // 6. 创建应用历史记录
      await ApplicationHistory.create({
        userJobId: userJob._id,
        previousStatus: 'initial',
        newStatus: userJob.status,
        notes: cleanedJobData.notes || '通过API创建职位',
        updatedBy: userId
      });
    }
    
    // 返回处理结果
    return {
      success: true,
      isNew: !existingJob,
      job,
      userJob
    };
  } catch (error) {
    console.error('职位处理错误:', error);
    return {
      error: error instanceof Error ? error.message : '处理职位数据时发生未知错误',
      jobDetails: jobData
    };
  }
};

/**
 * @desc    创建单个或批量职位
 * @route   POST /api/v1/jobs
 * @access  私有
 */
export const createJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 获取用户ID
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError('用户未认证，无法创建职位', 401));
    }

    // 判断输入类型
    let jobsData: any[] = [];
    
    if (Array.isArray(req.body)) {
      // 请求体直接是数组
      jobsData = req.body;
    } else if (req.body.jobs && Array.isArray(req.body.jobs)) {
      // 请求体中有jobs字段，且是数组
      jobsData = req.body.jobs;
    } else {
      // 单个职位对象
      jobsData = [req.body];
    }

    if (jobsData.length === 0) {
      return next(new AppError('职位数据不能为空', 400));
    }

    // 初始化结果收集器
    const createdJobsResults: any[] = [];
    const errors: any[] = [];
    
    // 初始化公司缓存
    const companyCache = new Map<string, string>();
    
    // 处理每一个职位数据
    for (const jobDataItem of jobsData) {
      const result = await _processJobData(jobDataItem, userId.toString(), companyCache);
      
      if (result.error) {
        errors.push(result);
      } else {
        createdJobsResults.push(result);
      }
    }
    
    // 构建响应
    if (jobsData.length === 1) {
      // 单个职位处理
      if (errors.length > 0) {
        return next(new AppError(errors[0].error, 400));
      } else {
        return res.status(201).json(createApiResponse(
          201,
          createdJobsResults[0].isNew ? '创建职位成功' : '更新职位成功',
          {
            job: createdJobsResults[0].job,
            userJob: createdJobsResults[0].userJob
          }
        ));
      }
    } else {
      // 批量处理
      res.status(207).json(createApiResponse(
        207,
        '批量处理职位完成',
        {
          total: jobsData.length,
          succeeded: createdJobsResults.length,
          failed: errors.length,
          createdJobs: createdJobsResults.map(r => r.job),
          errors: errors
        }
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
    let sortOption: any = { createdAt: -1 }; // 默认按创建时间降序排序
    if (req.query.sort) {
      const sortStr = req.query.sort as string;
      if (sortStr.startsWith('-')) {
        sortOption = { [sortStr.slice(1)]: -1 };
      } else {
        sortOption = { [sortStr]: 1 };
      }
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