import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import User, { IUser } from '../models/userModel';

// 扩展Express请求类型以包含用户
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * 保护路由中间件 - 验证用户是否已登录
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // 检查请求头中的Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // 提取令牌
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    } else {
      console.log('No Authorization header found');
    }

    // 检查是否有令牌
    if (!token) {
      console.log('No token found');
      return next(new AppError('您未登录，请先登录', 401));
    }

    // 验证令牌
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    console.log('Token decoded:', decoded);

    // 检查用户是否存在
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for token');
      return next(new AppError('拥有此令牌的用户不存在', 401));
    }

    // 检查用户是否处于活动状态
    if (user.status !== 'active') {
      console.log('User is not active');
      return next(new AppError('此用户已被禁用，请联系管理员', 403));
    }

    // 将用户信息添加到请求对象
    req.user = user;
    console.log('User authenticated:', user.id);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('无效的令牌，请重新登录', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('令牌已过期，请重新登录', 401));
    }
    next(error);
  }
}; 