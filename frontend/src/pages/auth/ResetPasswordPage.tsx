import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import DecorationBlocks from '@/components/common/DecorationBlocks';

/**
 * 重置密码页面组件
 */
const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { t } = useTranslation(['auth', 'common']);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // 验证令牌
  useEffect(() => {
    if (!token) {
      setError(t('auth:resetPassword.invalidLink', '无效的密码重置链接'));
    } else {
      // 这里可以验证令牌的有效性
      // const validateToken = async () => {
      //   try {
      //     // await api.validateResetToken(token);
      //   } catch (err) {
      //     setError(t('auth:resetPassword.expiredLink', '密码重置链接已过期或无效'));
      //   }
      // };
      // validateToken();
    }
  }, [token, t]);

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
  const handleTogglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors = {
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // 验证密码
    if (!formData.password) {
      errors.password = t('auth:validation.passwordRequired', '请输入密码');
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = t('auth:validation.passwordLength', '密码长度至少为8个字符');
      isValid = false;
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('auth:validation.confirmPasswordRequired', '请确认密码');
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth:validation.passwordMatch', '两次输入的密码不一致');
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
    
    // 设置加载状态
    setIsLoading(true);
    setError('');
    
    try {
      // 这里会调用重置密码的API
      // const response = await api.resetPassword({
      //   token,
      //   password: formData.password
      // });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 重置成功
      setIsSuccess(true);
    } catch (err) {
      // 设置错误信息
      setError(t('auth:resetPassword.failed', '密码重置失败，请重试'));
    } finally {
      // 结束加载状态
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 装饰方块 */}
      <DecorationBlocks count={6} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {!isSuccess ? (
          <>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth:resetPassword.title', '重置密码')}
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t('auth:resetPassword.subtitle', '请设置您的新密码')}
            </p>
          </>
        ) : null}
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 px-6 py-8">
          {!isSuccess ? (
            <>
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth:resetPassword.newPassword', '新密码')}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-11 pl-3 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder={t('auth:resetPassword.passwordPlaceholder', '输入新密码')}
                      disabled={isLoading || !!error}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                      onClick={() => handleTogglePasswordVisibility('password')}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('auth:resetPassword.passwordHint', '* 至少8个字符，包含1个数字，1个大写和1个小写字母')}
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth:resetPassword.confirmPassword', '确认新密码')}
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full h-11 pl-3 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder={t('auth:resetPassword.confirmPasswordPlaceholder', '再次输入新密码')}
                      disabled={isLoading || !!error}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                      onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !!error}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors disabled:bg-indigo-300"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common:buttons.loading', '加载中...')}
                      </>
                    ) : (
                      t('auth:resetPassword.button', '重置密码')
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <RouterLink
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  {t('auth:resetPassword.backToLogin', '返回登录')}
                </RouterLink>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('auth:resetPassword.success', '密码重置成功')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('auth:resetPassword.successMessage', '您的密码已成功重置。您现在可以使用新密码登录您的账户。')}
              </p>
              <button
                onClick={handleGoToLogin}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {t('auth:resetPassword.loginNow', '立即登录')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 