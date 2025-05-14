import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/redux/store';
import { updateProfile, updatePassword, clearError } from '@/redux/slices/authSlice';
import { User, UpdatePasswordData } from '@/types';
import { AlertCircle, Check, Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react';
import LanguageSelector from '@/components/common/LanguageSelector';

/**
 * 账号设置页面组件
 * 允许用户修改账号信息和密码
 */
const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 清除成功消息
  useEffect(() => {
    if (emailSuccess) {
      const timer = setTimeout(() => setEmailSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [emailSuccess]);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  // 清除错误消息
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className="container-lg">
      <div className="section space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t('settings.title', '账号设置')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('settings.subtitle', '管理您的账号信息和安全设置')}
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 语言设置 */}
        <LanguageSettingsForm />

        {/* 邮箱设置 */}
        <EmailSettingsForm 
          user={user}
          isLoading={isLoading}
          onSuccess={() => setEmailSuccess(true)}
        />

        {/* 密码设置 */}
        <PasswordChangeForm
          isLoading={isLoading}
          onSuccess={() => setPasswordSuccess(true)}
        />
      </div>
    </div>
  );
};

/**
 * 语言设置表单组件
 */
const LanguageSettingsForm: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">
          {t('settings.language', '语言设置')}
        </h2>
        
        <div className="mb-4">
          <label 
            htmlFor="language" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('settings.chooseLanguage', '选择您偏好的语言')}
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <div className="pl-10">
              <LanguageSelector variant="dropdown" size="md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 邮箱设置表单组件
 */
const EmailSettingsForm: React.FC<{
  user: User | null;
  isLoading: boolean;
  onSuccess: () => void;
}> = ({ user, isLoading, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  // 初始化邮箱
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !user) return;
    
    const result = await dispatch(updateProfile({ email }));
    
    if (updateProfile.fulfilled.match(result)) {
      setSuccess(true);
      onSuccess();
    }
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">邮箱设置</h2>
        
        {success && (
          <div className="mb-4 rounded-xl bg-green-50 dark:bg-green-500/10 p-4 text-green-600 dark:text-green-400 flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5" />
            <span>邮箱更新成功</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              电子邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || email === user?.email}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors ${
              (isLoading || email === user?.email) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                更新中...
              </>
            ) : '更新邮箱'}
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * 密码修改表单组件
 */
const PasswordChangeForm: React.FC<{
  isLoading: boolean;
  onSuccess: () => void;
}> = ({ isLoading, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // 验证密码
    if (newPassword.length < 8) {
      setValidationError('新密码长度至少8个字符');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setValidationError('两次输入的密码不一致');
      return;
    }
    
    const passwordData: UpdatePasswordData = {
      currentPassword,
      newPassword
    };
    
    const result = await dispatch(updatePassword(passwordData));
    
    if (updatePassword.fulfilled.match(result)) {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess();
    }
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">密码设置</h2>
        
        {success && (
          <div className="mb-4 rounded-xl bg-green-50 dark:bg-green-500/10 p-4 text-green-600 dark:text-green-400 flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5" />
            <span>密码修改成功</span>
          </div>
        )}
        
        {validationError && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="currentPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              当前密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="输入当前密码"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="newPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              新密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="设置新密码"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              确认新密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="再次输入新密码"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors ${
              (isLoading || !currentPassword || !newPassword || !confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                更新中...
              </>
            ) : '更新密码'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage; 