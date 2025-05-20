import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { login, clearError } from '@/redux/slices/authSlice';
import Loader from '@/components/common/Loader';
import DecorationBlocks from '@/components/common/DecorationBlocks';
import SettingsToggle from '@/components/common/SettingsToggle';

/**
 * 登录页面组件
 */
const LoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // 获取重定向路径
  const from = (location.state as { from?: string })?.from || '/welcome';
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    identifier: '',
    password: '',
  });

  // 如果已经登录，重定向到之前尝试访问的页面或仪表盘
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // 清除全局错误状态
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除字段错误
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // 处理密码可见性切换
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors = {
      identifier: '',
      password: ''
    };
    let isValid = true;

    // 验证用户名/邮箱
    if (!formData.identifier) {
      errors.identifier = t('auth:validation.identifierRequired', '请输入用户名或邮箱');
      isValid = false;
    }

    // 验证密码
    if (!formData.password) {
      errors.password = t('auth:validation.passwordRequired', '请输入密码');
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    // 调用登录Action
    dispatch(login(formData));
  };

  if (isLoading) {
    return <Loader fullScreen message={t('common:buttons.loading', '加载中...')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 装饰方块 */}
      <DecorationBlocks count={15} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('auth:login.title', '登录')}
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t('auth:login.subtitle', '欢迎回来！请输入您的信息')}
        </p>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 px-6 py-8 relative">
          {/* 设置切换按钮 */}
          <div className="absolute top-3 right-3">
            <SettingsToggle />
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth:login.identifier', '用户名或邮箱')}
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username email"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full h-11 pl-3 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
                {fieldErrors.identifier && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.identifier}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth:login.password', '密码')}
                </label>
                <div className="text-sm">
                  <RouterLink to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                    {t('auth:login.forgotPassword', '忘记密码？')}
                  </RouterLink>
                </div>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-11 pl-3 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {t('auth:login.signIn', '登录')}
              </button>
            </div>
            
            <div>
              <RouterLink 
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('common:buttons.backToHome', '返回首页')}
              </RouterLink>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  {t('auth:login.or', '或者')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="#"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                {t('auth:login.continueWithGoogle', '使用Google账号登录')}
              </a>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {t('auth:login.dontHaveAccount', '没有账号？')}
            </span>
            <RouterLink
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
            >
              {t('auth:login.signUp', '注册')}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 