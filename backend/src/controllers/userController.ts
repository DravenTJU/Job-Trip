import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';

/**
 * @desc    注册新用户
 * @route   POST /api/v1/users/register
 * @access  公开
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, firstName, lastName, preferences } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('用户已存在', 400));
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      preferences,
    });

    // 生成JWT令牌
    const token = user.generateAuthToken();

    // 返回用户数据和令牌（不包含密码）
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      preferences: user.preferences,
      status: user.status,
    };

    res.status(201).json(createApiResponse(
      200,
      '用户注册成功',
      {
        token,
        user: userData
      }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    用户登录
 * @route   POST /api/v1/users/login
 * @access  公开
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return next(new AppError('请提供邮箱和密码', 400));
    }

    // 查找用户并选择密码字段
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('无效的凭据', 401));
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return next(new AppError('此用户已被禁用，请联系管理员', 403));
    }

    // 检查密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('无效的凭据', 401));
    }

    // 生成JWT令牌
    const token = user.generateAuthToken();

    // 返回用户数据和令牌（不包含密码）
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      preferences: user.preferences,
      status: user.status,
    };

    res.status(200).json(createApiResponse(
      200,
      '登录成功',
      {
        token,
        user: userData
      }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取当前用户信息
 * @route   GET /api/v1/users/me
 * @access  私有
 */
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new AppError('未找到用户', 404));
    }

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      preferences: user.preferences,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(createApiResponse(
      200,
      '获取用户信息成功',
      userData
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新用户信息
 * @route   PUT /api/v1/users/me
 * @access  私有
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    
    if (!user) {
      return next(new AppError('未找到用户', 404));
    }

    // 不允许直接更新密码和状态
    const { password, status, ...updateData } = req.body;

    // 更新用户信息
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(createApiResponse(
      200,
      '用户信息更新成功',
      updatedUser
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新用户密码
 * @route   PUT /api/v1/users/password
 * @access  私有
 */
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    
    if (!user) {
      return next(new AppError('未找到用户', 404));
    }

    const { currentPassword, newPassword } = req.body;

    // 验证当前密码
    const userWithPassword = await User.findById(user._id).select('+password');
    if (!userWithPassword) {
      return next(new AppError('未找到用户', 404));
    }

    const isMatch = await userWithPassword.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new AppError('当前密码不正确', 401));
    }

    // 更新密码
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    // 生成新的JWT令牌
    const token = userWithPassword.generateAuthToken();

    res.status(200).json(createApiResponse(
      200,
      '密码更新成功',
      { token }
    ));
  } catch (error) {
    next(error);
  }
}; 