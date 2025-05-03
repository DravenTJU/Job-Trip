import { Request, Response, NextFunction } from 'express';
import { Profile, IProfile, IEducation, IWorkExperience, ISkill } from '../models/profileModel';
import { AppError, createApiResponse } from '../middleware/errorHandler';

// 获取用户档案
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      // 如果用户没有档案，创建一个新的
      const newProfile = await Profile.create({
        userId: req.user.id,
        introduction: '',
        educations: [],
        workExperiences: [],
        skills: [],
        resumeTemplate: '',
      });
      return res.json(createApiResponse(200, '获取档案成功', newProfile));
    }
    res.json(createApiResponse(200, '获取档案成功', profile));
  } catch (error) {
    next(error);
  }
};

// 更新用户档案
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { introduction, resumeTemplate } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { introduction, resumeTemplate },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    res.json(createApiResponse(200, '更新档案成功', profile));
  } catch (error) {
    next(error);
  }
};

// 添加教育经历
export const addEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const education = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { educations: education } },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    res.json(createApiResponse(200, '添加教育经历成功', profile));
  } catch (error) {
    next(error);
  }
};

// 更新教育经历
export const updateEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const education = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id, 'educations._id': id },
      { $set: { 'educations.$': education } },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return next(new AppError('教育经历不存在', 404));
    }
    res.json(createApiResponse(200, '更新教育经历成功', profile));
  } catch (error) {
    next(error);
  }
};

// 删除教育经历
export const deleteEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { educations: { _id: id } } },
      { new: true }
    );
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    res.json(createApiResponse(200, '删除教育经历成功', profile));
  } catch (error) {
    next(error);
  }
};

// 添加工作经历
export const addWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workExperience = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { workExperiences: workExperience } },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    res.json(createApiResponse(200, '添加工作经历成功', profile));
  } catch (error) {
    next(error);
  }
};

// 更新工作经历
export const updateWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const workExperience = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id, 'workExperiences._id': id },
      { $set: { 'workExperiences.$': workExperience } },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return next(new AppError('工作经历不存在', 404));
    }
    res.json(createApiResponse(200, '更新工作经历成功', profile));
  } catch (error) {
    next(error);
  }
};

// 删除工作经历
export const deleteWorkExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { workExperiences: { _id: id } } },
      { new: true }
    );
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    res.json(createApiResponse(200, '删除工作经历成功', profile));
  } catch (error) {
    next(error);
  }
};

// 添加技能
export const addSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { skills: skill } },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    res.json(createApiResponse(200, '添加技能成功', profile));
  } catch (error) {
    next(error);
  }
};

// 更新技能
export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const skill = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id, 'skills._id': id },
      { $set: { 'skills.$': skill } },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return next(new AppError('技能不存在', 404));
    }
    res.json(createApiResponse(200, '更新技能成功', profile));
  } catch (error) {
    next(error);
  }
};

// 删除技能
export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { skills: { _id: id } } },
      { new: true }
    );
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    res.json(createApiResponse(200, '删除技能成功', profile));
  } catch (error) {
    next(error);
  }
};

// 生成简历
export const generateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { template } = req.body;
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return next(new AppError('档案不存在', 404));
    }
    // TODO: 实现简历生成逻辑
    res.json(createApiResponse(200, '生成简历成功', { url: 'resume.pdf' }));
  } catch (error) {
    next(error);
  }
}; 