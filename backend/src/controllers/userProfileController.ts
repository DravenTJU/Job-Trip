import { Request, Response, NextFunction } from 'express';
import UserProfile from '../models/userProfileModel';
import { AppError, createApiResponse } from '../middleware/errorHandler';

/**
 * @desc    获取当前用户的档案
 * @route   GET /api/v1/user-profiles/me
 * @access  私有
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 查找或创建用户档案
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // 如果用户档案不存在，创建一个新的
      profile = await UserProfile.create({ userId });
    }

    res.status(200).json(createApiResponse(
      200,
      '获取用户档案成功',
      profile
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
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '更新用户档案成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加教育经历
 * @route   POST /api/v1/user-profiles/me/education
 * @access  私有
 */
export const addEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，添加教育经历
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { education: req.body } },
      { new: true, upsert: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '添加教育经历成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新教育经历
 * @route   PUT /api/v1/user-profiles/me/education/:id
 * @access  私有
 */
export const updateEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const educationId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案中的教育经历
    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'education._id': educationId },
      { $set: { 'education.$': req.body } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到教育经历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新教育经历成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除教育经历
 * @route   DELETE /api/v1/user-profiles/me/education/:id
 * @access  私有
 */
export const deleteEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const educationId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，删除教育经历
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { education: { _id: educationId } } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到教育经历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除教育经历成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加工作经验
 * @route   POST /api/v1/user-profiles/me/work-experience
 * @access  私有
 */
export const addWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，添加工作经验
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { workExperience: req.body } },
      { new: true, upsert: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '添加工作经验成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新工作经验
 * @route   PUT /api/v1/user-profiles/me/work-experience/:id
 * @access  私有
 */
export const updateWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const workExperienceId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案中的工作经验
    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'workExperience._id': workExperienceId },
      { $set: { 'workExperience.$': req.body } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到工作经验', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新工作经验成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除工作经验
 * @route   DELETE /api/v1/user-profiles/me/work-experience/:id
 * @access  私有
 */
export const deleteWorkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const workExperienceId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，删除工作经验
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { workExperience: { _id: workExperienceId } } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到工作经验', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除工作经验成功',
      profile
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
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，添加技能
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { skills: req.body } },
      { new: true, upsert: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '添加技能成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新技能
 * @route   PUT /api/v1/user-profiles/me/skills/:id
 * @access  私有
 */
export const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const skillId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案中的技能
    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'skills._id': skillId },
      { $set: { 'skills.$': req.body } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到技能', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新技能成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除技能
 * @route   DELETE /api/v1/user-profiles/me/skills/:id
 * @access  私有
 */
export const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const skillId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，删除技能
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到技能', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除技能成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    添加项目经验
 * @route   POST /api/v1/user-profiles/me/projects
 * @access  私有
 */
export const addProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，添加项目经验
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { projects: req.body } },
      { new: true, upsert: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '添加项目经验成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新项目经验
 * @route   PUT /api/v1/user-profiles/me/projects/:id
 * @access  私有
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const projectId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案中的项目经验
    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'projects._id': projectId },
      { $set: { 'projects.$': req.body } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到项目经验', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新项目经验成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除项目经验
 * @route   DELETE /api/v1/user-profiles/me/projects/:id
 * @access  私有
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const projectId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，删除项目经验
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到项目经验', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除项目经验成功',
      profile
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
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，添加语言能力
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { languages: req.body } },
      { new: true, upsert: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '添加语言能力成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新语言能力
 * @route   PUT /api/v1/user-profiles/me/languages/:id
 * @access  私有
 */
export const updateLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const languageId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案中的语言能力
    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'languages._id': languageId },
      { $set: { 'languages.$': req.body } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到语言能力', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新语言能力成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除语言能力
 * @route   DELETE /api/v1/user-profiles/me/languages/:id
 * @access  私有
 */
export const deleteLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const languageId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，删除语言能力
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { languages: { _id: languageId } } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到语言能力', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除语言能力成功',
      profile
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
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，添加证书
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { certifications: req.body } },
      { new: true, upsert: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '添加证书成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新证书
 * @route   PUT /api/v1/user-profiles/me/certifications/:id
 * @access  私有
 */
export const updateCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const certificationId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案中的证书
    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'certifications._id': certificationId },
      { $set: { 'certifications.$': req.body } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到证书', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新证书成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除证书
 * @route   DELETE /api/v1/user-profiles/me/certifications/:id
 * @access  私有
 */
export const deleteCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const certificationId = req.params.id;

    if (!userId) {
      return next(new AppError('未认证，无法访问', 401));
    }

    // 更新用户档案，删除证书
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { certifications: { _id: certificationId } } },
      { new: true }
    );

    if (!profile) {
      return next(new AppError('未找到证书', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除证书成功',
      profile
    ));
  } catch (error) {
    next(error);
  }
}; 