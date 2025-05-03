import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError, createApiResponse } from '../middleware/errorHandler';
import User from '../models/userModel';
import { sendEmail } from '../utils/emailService';
import crypto from 'crypto';

// 生成JWT令牌
const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// 生成刷新令牌
const generateRefreshToken = (id: string): string => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_here';
  return jwt.sign({ id }, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  });
};

/**
 * 用户注册
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('该邮箱已被注册', 400));
    }

    // 创建新用户
    const user = await User.create({
      email,
      password,
      name,
      status: 'active'
    });

    // 生成令牌
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json(createApiResponse(201, '注册成功', {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token,
      refreshToken
    }));
  } catch (error) {
    next(error);
  }
};

/**
 * 用户登录
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('邮箱或密码错误', 401));
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError('邮箱或密码错误', 401));
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return next(new AppError('此账户已被禁用', 403));
    }

    // 生成令牌
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json(createApiResponse(200, '登录成功', {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token,
      refreshToken
    }));
  } catch (error) {
    next(error);
  }
};

/**
 * 用户登出
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 在这里可以添加令牌黑名单逻辑
    res.status(200).json(createApiResponse(200, '登出成功'));
  } catch (error) {
    next(error);
  }
};

/**
 * 刷新访问令牌
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('未提供刷新令牌', 400));
    }

    // 验证刷新令牌
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_here';
    const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string };

    // 检查用户是否存在
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('用户不存在', 401));
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return next(new AppError('此账户已被禁用', 403));
    }

    // 生成新的访问令牌
    const newToken = generateToken(user._id);

    res.status(200).json(createApiResponse(200, '令牌刷新成功', {
      token: newToken
    }));
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('刷新令牌无效或已过期', 401));
    }
    next(error);
  }
};

/**
 * 忘记密码
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('该邮箱未注册', 404));
    }

    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1小时后过期

    // 保存重置令牌到用户文档
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // 发送重置链接到用户邮箱
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      您收到这封邮件是因为您（或其他人）请求重置密码。
      请点击以下链接重置密码：
      ${resetUrl}
      如果您没有请求重置密码，请忽略此邮件。
    `;

    await sendEmail({
      email: user.email,
      subject: '密码重置请求',
      message
    });

    res.status(200).json(createApiResponse(200, '重置链接已发送到您的邮箱'));
  } catch (error) {
    next(error);
  }
};

/**
 * 重置密码
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 查找具有有效重置令牌的用户
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('重置令牌无效或已过期', 400));
    }

    // 更新密码
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // 生成新的访问令牌
    const newToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json(createApiResponse(200, '密码重置成功', {
      token: newToken,
      refreshToken
    }));
  } catch (error) {
    next(error);
  }
}; 