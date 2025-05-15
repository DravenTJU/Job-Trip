import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, SendIcon } from 'lucide-react';
import DecorationBlocks from '@/components/common/DecorationBlocks';
import SettingsToggle from '@/components/common/SettingsToggle';

/**
 * 忘记密码页面组件
 */
const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证邮箱
    if (!email) {
      setError(t('auth:validation.emailRequired', '请输入邮箱'));
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth:validation.emailInvalid', '请输入有效的邮箱地址'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // 模拟发送请求
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 装饰方块 */}
      <DecorationBlocks count={6} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('auth:forgotPassword.title', '忘记密码')}
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t('auth:forgotPassword.subtitle', '请输入您的邮箱，我们将发送重置密码的链接')}
        </p>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 px-6 py-8 relative">
          {/* 设置切换按钮 */}
          <div className="absolute top-3 right-3">
            <SettingsToggle />
          </div>
          
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('auth:forgotPassword.emailSent', '邮件已发送')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('auth:forgotPassword.checkEmail', '请检查您的邮箱，按照邮件中的指示重置密码')}
              </p>
              <RouterLink
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {t('auth:forgotPassword.backToLogin', '返回登录')}
              </RouterLink>
            </div>
          ) : (
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth:login.email', '电子邮箱')}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleChange}
                      className="w-full h-11 pl-3 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder={t('auth:login.emailPlaceholder', 'name@example.com')}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors disabled:bg-indigo-300"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common:buttons.loading', '加载中...')}
                      </>
                    ) : (
                      <>
                        <SendIcon className="h-4 w-4" />
                        {t('auth:forgotPassword.sendResetLink', '发送重置链接')}
                      </>
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
                  {t('auth:forgotPassword.backToLogin', '返回登录')}
                </RouterLink>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 