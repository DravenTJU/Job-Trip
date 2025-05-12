import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchUserProfile } from '../../redux/slices/profileSlice';
import ProfilePage from '../../components/profile/ProfilePage';
import ProfileWizard from '../../components/profile/wizard/ProfileWizard';
import { RootState } from '../../redux/store';

const ProfilePageContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoading, error, profileNotFound } = useAppSelector((state: RootState) => state.profile);
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      console.log('ProfilePageContainer: 获取用户档案');
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  // 添加日志显示当前状态
  console.log('ProfilePageContainer 渲染状态:', {
    isLoading,
    error,
    profileNotFound,
    hasProfile: !!profile
  });

  if (isLoading) {
    console.log('ProfilePageContainer: 显示加载中');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && !profileNotFound) {
    console.log('ProfilePageContainer: 显示错误信息，但不是档案不存在错误');
    return (
      <div className="container-lg mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (profileNotFound) {
    console.log('ProfilePageContainer: 档案不存在，显示引导向导');
    try {
      return <ProfileWizard />;
    } catch (e) {
      console.error('ProfileWizard渲染错误:', e);
      return (
        <div className="container-lg mx-auto px-4 py-8">
          <div className="rounded-xl bg-yellow-50 dark:bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-400">
            <h3 className="text-lg font-medium mb-2">正在加载用户引导向导</h3>
            <p className="mb-4">我们无法加载引导向导组件，可能原因：</p>
            <pre className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-xs overflow-auto max-h-32">
              {e instanceof Error ? e.message : String(e)}
            </pre>
            <button 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
  }

  console.log('ProfilePageContainer: 显示用户档案');
  return <ProfilePage profile={profile} />;
};

export default ProfilePageContainer; 