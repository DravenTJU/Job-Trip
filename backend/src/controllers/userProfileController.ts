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
    
    // 创建新用户档案 - 不需要显式设置初始完整度为0，模型默认值已设置
    // profileCompleteness将在模型的pre-save钩子中自动计算
    const newUserProfile = await UserProfile.create({
      userId: req.user?._id,
      ...profileData
    });

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

    // 使用模型内置的验证，通过runValidators确保数据符合Schema定义
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      userProfile._id,
      updateData,
      { new: true, runValidators: true }
    );

    // 不需要手动计算profileCompleteness，模型的pre-save钩子已经处理了

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
const calculateProfileCompleteness = (profile: any) => {
  if (!profile) return 0;
  
  let completedSections = 0;
  let totalSections = 8; // 基本信息、联系方式、教育、工作、技能、证书、项目、语言
  
  // 基本信息（标题、简介）
  if (profile.headline || profile.biography) completedSections++;
  
  // 联系信息
  if (profile.contactInfo && (profile.contactInfo.email || profile.contactInfo.phone)) completedSections++;
  
  // 其他部分
  if (profile.educations && profile.educations.length > 0) completedSections++;
  if (profile.workExperiences && profile.workExperiences.length > 0) completedSections++;
  if (profile.skills && profile.skills.length > 0) completedSections++;
  if (profile.certifications && profile.certifications.length > 0) completedSections++;
  if (profile.projects && profile.projects.length > 0) completedSections++;
  if (profile.languages && profile.languages.length > 0) completedSections++;
  
  // 确保最终值不超过100
  const calculatedValue = Math.round((completedSections / totalSections) * 100);
  return Math.min(calculatedValue, 100);
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
 * @route   PUT /api/v1/user-profiles/me/educations/:educationId
 * @access  私有
 */
export const updateEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { educationId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const education = userProfile.educations?.id(educationId);

    if (!education) {
      return next(new AppError('教育经历不存在', 404));
    }

    // 更新教育经历的字段
    Object.assign(education, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/educations/:educationId
 * @access  私有
 */
export const deleteEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { educationId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const education = userProfile.educations?.id(educationId);

    if (!education) {
      return next(new AppError('教育经历不存在', 404));
    }

    // @ts-ignore TODO: Mongoose 子文档的 remove() 方法类型可能需要更精确的处理或确认
    education.remove(); // Mongoose < 6 
    // For Mongoose 5+ alternative: userProfile.educations.pull({ _id: educationId });

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
 * @route   PUT /api/v1/user-profiles/me/work-experiences/:workExperienceId
 * @access  私有
 */
export const updateWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workExperienceId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const workExperience = userProfile.workExperiences?.id(workExperienceId);

    if (!workExperience) {
      return next(new AppError('工作经历不存在', 404));
    }

    Object.assign(workExperience, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/work-experiences/:workExperienceId
 * @access  私有
 */
export const deleteWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workExperienceId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const workExperience = userProfile.workExperiences?.id(workExperienceId);

    if (!workExperience) {
      return next(new AppError('工作经历不存在', 404));
    }

    // @ts-ignore
    workExperience.remove();
    // Alternative for Mongoose 5+: userProfile.workExperiences.pull({ _id: workExperienceId });

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
 * @route   PUT /api/v1/user-profiles/me/skills/:skillId
 * @access  私有
 */
export const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { skillId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const skill = userProfile.skills?.id(skillId);

    if (!skill) {
      return next(new AppError('技能不存在', 404));
    }

    Object.assign(skill, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/skills/:skillId
 * @access  私有
 */
export const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { skillId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const skill = userProfile.skills?.id(skillId);

    if (!skill) {
      return next(new AppError('技能不存在', 404));
    }

    // @ts-ignore
    skill.remove();
    // Alternative for Mongoose 5+: userProfile.skills.pull({ _id: skillId });

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
 * @route   PUT /api/v1/user-profiles/me/certifications/:certificationId
 * @access  私有
 */
export const updateCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { certificationId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const certification = userProfile.certifications?.id(certificationId);

    if (!certification) {
      return next(new AppError('证书不存在', 404));
    }

    Object.assign(certification, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/certifications/:certificationId
 * @access  私有
 */
export const deleteCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { certificationId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const certification = userProfile.certifications?.id(certificationId);

    if (!certification) {
      return next(new AppError('证书不存在', 404));
    }

    // @ts-ignore
    certification.remove();
    // Alternative for Mongoose 5+: userProfile.certifications.pull({ _id: certificationId });

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
 * @route   PUT /api/v1/user-profiles/me/projects/:projectId
 * @access  私有
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const project = userProfile.projects?.id(projectId);

    if (!project) {
      return next(new AppError('项目经历不存在', 404));
    }

    Object.assign(project, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/projects/:projectId
 * @access  私有
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const project = userProfile.projects?.id(projectId);

    if (!project) {
      return next(new AppError('项目经历不存在', 404));
    }

    // @ts-ignore
    project.remove();
    // Alternative for Mongoose 5+: userProfile.projects.pull({ _id: projectId });

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
 * @route   PUT /api/v1/user-profiles/me/languages/:languageId
 * @access  私有
 */
export const updateLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { languageId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const language = userProfile.languages?.id(languageId);

    if (!language) {
      return next(new AppError('语言能力不存在', 404));
    }

    Object.assign(language, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/languages/:languageId
 * @access  私有
 */
export const deleteLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { languageId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const language = userProfile.languages?.id(languageId);

    if (!language) {
      return next(new AppError('语言能力不存在', 404));
    }

    // @ts-ignore
    language.remove();
    // Alternative for Mongoose 5+: userProfile.languages.pull({ _id: languageId });

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
 * @route   PUT /api/v1/user-profiles/me/volunteer-experiences/:volunteerExperienceId
 * @access  私有
 */
export const updateVolunteerExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { volunteerExperienceId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const volunteerExperience = userProfile.volunteerExperiences?.id(volunteerExperienceId);

    if (!volunteerExperience) {
      return next(new AppError('志愿者经历不存在', 404));
    }

    Object.assign(volunteerExperience, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/volunteer-experiences/:volunteerExperienceId
 * @access  私有
 */
export const deleteVolunteerExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { volunteerExperienceId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const volunteerExperience = userProfile.volunteerExperiences?.id(volunteerExperienceId);

    if (!volunteerExperience) {
      return next(new AppError('志愿者经历不存在', 404));
    }

    // @ts-ignore
    volunteerExperience.remove();
    // Alternative for Mongoose 5+: userProfile.volunteerExperiences.pull({ _id: volunteerExperienceId });

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
 * @route   PUT /api/v1/user-profiles/me/honors-awards/:honorAwardId
 * @access  私有
 */
export const updateHonorAward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { honorAwardId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const honorAward = userProfile.honorsAwards?.id(honorAwardId);

    if (!honorAward) {
      return next(new AppError('荣誉奖项不存在', 404));
    }

    Object.assign(honorAward, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/honors-awards/:honorAwardId
 * @access  私有
 */
export const deleteHonorAward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { honorAwardId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const honorAward = userProfile.honorsAwards?.id(honorAwardId);

    if (!honorAward) {
      return next(new AppError('荣誉奖项不存在', 404));
    }

    // @ts-ignore
    honorAward.remove();
    // Alternative for Mongoose 5+: userProfile.honorsAwards.pull({ _id: honorAwardId });

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
 * @route   PUT /api/v1/user-profiles/me/recommendations/:recommendationId
 * @access  私有
 */
export const updateRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { recommendationId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const recommendation = userProfile.recommendations?.id(recommendationId);

    if (!recommendation) {
      return next(new AppError('推荐信不存在', 404));
    }

    Object.assign(recommendation, req.body);

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
 * @route   DELETE /api/v1/user-profiles/me/recommendations/:recommendationId
 * @access  私有
 */
export const deleteRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { recommendationId } = req.params;
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return next(new AppError('用户档案不存在', 404));
    }

    const recommendation = userProfile.recommendations?.id(recommendationId);

    if (!recommendation) {
      return next(new AppError('推荐信不存在', 404));
    }

    // @ts-ignore
    recommendation.remove();
    // Alternative for Mongoose 5+: userProfile.recommendations.pull({ _id: recommendationId });

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