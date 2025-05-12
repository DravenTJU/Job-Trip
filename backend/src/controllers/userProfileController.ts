import { Request, Response, NextFunction } from 'express';
import UserProfile from '../models/userProfileModel';
import User from '../models/userModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';
import { Document } from 'mongoose';

/**
 * @desc    获取当前用户的档案
 * @route   GET /api/v1/user-profiles/me
 * @access  私有
 */
export const getCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    // 如果用户档案不存在，返回404状态码而不是创建新档案
    if (!userProfile) {
      return res.status(404).json(createApiResponse(
        404,
        '用户档案不存在',
        { profileExists: false }
      ));
    }

    res.status(200).json(createApiResponse(
      200,
      '获取用户档案成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    创建用户档案（新API）
 * @route   POST /api/v1/user-profiles/me
 * @access  私有
 */
export const createUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 检查用户档案是否已存在
    const existingProfile = await UserProfile.findOne({ userId: req.user?._id });
    
    if (existingProfile) {
      return res.status(400).json(createApiResponse(
        400,
        '用户档案已存在',
        { profileExists: true }
      ));
    }
    
    const { firstName, lastName, ...profileData } = req.body;
    
    // 创建新用户档案
    const newUserProfile = await UserProfile.create({
      userId: req.user?._id,
      ...profileData,
      profileCompleteness: 0  // 初始完整度为0
    });

    // 计算更新后的档案完整度
    const profileCompleteness = calculateProfileCompleteness(newUserProfile);
    newUserProfile.profileCompleteness = profileCompleteness;
    await newUserProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '用户档案创建成功',
      newUserProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新当前用户的档案
 * @route   PUT /api/v1/user-profiles/me
 * @access  私有
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });
    const { firstName, lastName } = req.body;

    if (!userProfile) {
      return res.status(404).json(createApiResponse(
        404,
        '用户档案不存在，请先创建档案',
        { profileExists: false }
      ));
    }

    // 更新用户档案
    // 不允许更改userId字段
    const { userId, ...updateData } = req.body;

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      userProfile._id,
      updateData,
      { new: true, runValidators: true }
    );

    // 计算更新后的档案完整度
    if (updatedProfile) {
      const profileCompleteness = calculateProfileCompleteness(updatedProfile);
      updatedProfile.profileCompleteness = profileCompleteness;
      await updatedProfile.save();
    }

    res.status(200).json(createApiResponse(
      200,
      '用户档案更新成功',
      updatedProfile
    ));
  } catch (error) {
    next(error);
  }
};

// 添加档案完整度计算函数
const calculateProfileCompleteness = (profile: Document) => {
  if (!profile) return 0;
  
  let completedSections = 0;
  let totalSections = 8; // 基本信息、教育、工作、技能、证书、项目、语言、荣誉奖项
  
  // 基本信息（标题、简介）
  if (profile.headline && profile.biography) completedSections++;
  
  // 联系信息
  if (profile.contactInfo && (profile.contactInfo.email || profile.contactInfo.phone)) completedSections++;
  
  // 其他部分
  if (profile.educations && profile.educations.length > 0) completedSections++;
  if (profile.workExperiences && profile.workExperiences.length > 0) completedSections++;
  if (profile.skills && profile.skills.length > 0) completedSections++;
  if (profile.certifications && profile.certifications.length > 0) completedSections++;
  if (profile.projects && profile.projects.length > 0) completedSections++;
  if (profile.languages && profile.languages.length > 0) completedSections++;
  if (profile.honorsAwards && profile.honorsAwards.length > 0) completedSections++;
  
  return Math.round((completedSections / totalSections) * 100);
};

/**
 * @desc    删除当前用户的档案
 * @route   DELETE /api/v1/user-profiles/me
 * @access  私有
 */
export const deleteUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    await UserProfile.findByIdAndDelete(userProfile._id);

    res.status(200).json(createApiResponse(
      200,
      '用户档案删除成功',
      null
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加教育经历
 * @route   POST /api/v1/user-profiles/me/educations
 * @access  私有
 */
export const addEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.educations = userProfile.educations || [];
    userProfile.educations.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加教育经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新教育经历
 * @route   PUT /api/v1/user-profiles/me/educations/:index
 * @access  私有
 */
export const updateEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.educations || !userProfile.educations[Number(index)]) {
      return next(new AppError('教育经历不存在', 404));
    }

    userProfile.educations[Number(index)] = {
      ...userProfile.educations[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新教育经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除教育经历
 * @route   DELETE /api/v1/user-profiles/me/educations/:index
 * @access  私有
 */
export const deleteEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.educations || !userProfile.educations[Number(index)]) {
      return next(new AppError('教育经历不存在', 404));
    }

    userProfile.educations.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除教育经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加工作经历
 * @route   POST /api/v1/user-profiles/me/work-experiences
 * @access  私有
 */
export const addWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.workExperiences = userProfile.workExperiences || [];
    userProfile.workExperiences.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加工作经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新工作经历
 * @route   PUT /api/v1/user-profiles/me/work-experiences/:index
 * @access  私有
 */
export const updateWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.workExperiences || !userProfile.workExperiences[Number(index)]) {
      return next(new AppError('工作经历不存在', 404));
    }

    userProfile.workExperiences[Number(index)] = {
      ...userProfile.workExperiences[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新工作经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除工作经历
 * @route   DELETE /api/v1/user-profiles/me/work-experiences/:index
 * @access  私有
 */
export const deleteWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.workExperiences || !userProfile.workExperiences[Number(index)]) {
      return next(new AppError('工作经历不存在', 404));
    }

    userProfile.workExperiences.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除工作经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加技能
 * @route   POST /api/v1/user-profiles/me/skills
 * @access  私有
 */
export const addSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.skills = userProfile.skills || [];
    userProfile.skills.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加技能成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新技能
 * @route   PUT /api/v1/user-profiles/me/skills/:index
 * @access  私有
 */
export const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.skills || !userProfile.skills[Number(index)]) {
      return next(new AppError('技能不存在', 404));
    }

    userProfile.skills[Number(index)] = {
      ...userProfile.skills[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新技能成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除技能
 * @route   DELETE /api/v1/user-profiles/me/skills/:index
 * @access  私有
 */
export const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.skills || !userProfile.skills[Number(index)]) {
      return next(new AppError('技能不存在', 404));
    }

    userProfile.skills.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除技能成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加证书
 * @route   POST /api/v1/user-profiles/me/certifications
 * @access  私有
 */
export const addCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.certifications = userProfile.certifications || [];
    userProfile.certifications.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加证书成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新证书
 * @route   PUT /api/v1/user-profiles/me/certifications/:index
 * @access  私有
 */
export const updateCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.certifications || !userProfile.certifications[Number(index)]) {
      return next(new AppError('证书不存在', 404));
    }

    userProfile.certifications[Number(index)] = {
      ...userProfile.certifications[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新证书成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除证书
 * @route   DELETE /api/v1/user-profiles/me/certifications/:index
 * @access  私有
 */
export const deleteCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.certifications || !userProfile.certifications[Number(index)]) {
      return next(new AppError('证书不存在', 404));
    }

    userProfile.certifications.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除证书成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加项目经历
 * @route   POST /api/v1/user-profiles/me/projects
 * @access  私有
 */
export const addProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.projects = userProfile.projects || [];
    userProfile.projects.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加项目经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新项目经历
 * @route   PUT /api/v1/user-profiles/me/projects/:index
 * @access  私有
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.projects || !userProfile.projects[Number(index)]) {
      return next(new AppError('项目经历不存在', 404));
    }

    userProfile.projects[Number(index)] = {
      ...userProfile.projects[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新项目经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除项目经历
 * @route   DELETE /api/v1/user-profiles/me/projects/:index
 * @access  私有
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.projects || !userProfile.projects[Number(index)]) {
      return next(new AppError('项目经历不存在', 404));
    }

    userProfile.projects.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除项目经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加语言能力
 * @route   POST /api/v1/user-profiles/me/languages
 * @access  私有
 */
export const addLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.languages = userProfile.languages || [];
    userProfile.languages.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加语言能力成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新语言能力
 * @route   PUT /api/v1/user-profiles/me/languages/:index
 * @access  私有
 */
export const updateLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.languages || !userProfile.languages[Number(index)]) {
      return next(new AppError('语言能力不存在', 404));
    }

    userProfile.languages[Number(index)] = {
      ...userProfile.languages[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新语言能力成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除语言能力
 * @route   DELETE /api/v1/user-profiles/me/languages/:index
 * @access  私有
 */
export const deleteLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.languages || !userProfile.languages[Number(index)]) {
      return next(new AppError('语言能力不存在', 404));
    }

    userProfile.languages.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除语言能力成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加志愿者经历
 * @route   POST /api/v1/user-profiles/me/volunteer-experiences
 * @access  私有
 */
export const addVolunteerExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.volunteerExperiences = userProfile.volunteerExperiences || [];
    userProfile.volunteerExperiences.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加志愿者经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新志愿者经历
 * @route   PUT /api/v1/user-profiles/me/volunteer-experiences/:index
 * @access  私有
 */
export const updateVolunteerExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.volunteerExperiences || !userProfile.volunteerExperiences[Number(index)]) {
      return next(new AppError('志愿者经历不存在', 404));
    }

    userProfile.volunteerExperiences[Number(index)] = {
      ...userProfile.volunteerExperiences[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新志愿者经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除志愿者经历
 * @route   DELETE /api/v1/user-profiles/me/volunteer-experiences/:index
 * @access  私有
 */
export const deleteVolunteerExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.volunteerExperiences || !userProfile.volunteerExperiences[Number(index)]) {
      return next(new AppError('志愿者经历不存在', 404));
    }

    userProfile.volunteerExperiences.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除志愿者经历成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加荣誉奖项
 * @route   POST /api/v1/user-profiles/me/honors-awards
 * @access  私有
 */
export const addHonorAward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.honorsAwards = userProfile.honorsAwards || [];
    userProfile.honorsAwards.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加荣誉奖项成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新荣誉奖项
 * @route   PUT /api/v1/user-profiles/me/honors-awards/:index
 * @access  私有
 */
export const updateHonorAward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.honorsAwards || !userProfile.honorsAwards[Number(index)]) {
      return next(new AppError('荣誉奖项不存在', 404));
    }

    userProfile.honorsAwards[Number(index)] = {
      ...userProfile.honorsAwards[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新荣誉奖项成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除荣誉奖项
 * @route   DELETE /api/v1/user-profiles/me/honors-awards/:index
 * @access  私有
 */
export const deleteHonorAward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.honorsAwards || !userProfile.honorsAwards[Number(index)]) {
      return next(new AppError('荣誉奖项不存在', 404));
    }

    userProfile.honorsAwards.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除荣誉奖项成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加推荐信
 * @route   POST /api/v1/user-profiles/me/recommendations
 * @access  私有
 */
export const addRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    userProfile.recommendations = userProfile.recommendations || [];
    userProfile.recommendations.push(req.body);
    await userProfile.save();

    res.status(201).json(createApiResponse(
      201,
      '添加推荐信成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新推荐信
 * @route   PUT /api/v1/user-profiles/me/recommendations/:index
 * @access  私有
 */
export const updateRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.recommendations || !userProfile.recommendations[Number(index)]) {
      return next(new AppError('推荐信不存在', 404));
    }

    userProfile.recommendations[Number(index)] = {
      ...userProfile.recommendations[Number(index)],
      ...req.body
    };

    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '更新推荐信成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除推荐信
 * @route   DELETE /api/v1/user-profiles/me/recommendations/:index
 * @access  私有
 */
export const deleteRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { index } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    if (!userProfile.recommendations || !userProfile.recommendations[Number(index)]) {
      return next(new AppError('推荐信不存在', 404));
    }

    userProfile.recommendations.splice(Number(index), 1);
    await userProfile.save();

    res.status(200).json(createApiResponse(
      200,
      '删除推荐信成功',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
}; 