import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchUserProfile } from '../../redux/slices/profileSlice';
import ProfilePage from '../../components/profile/ProfilePage';
import { RootState } from '../../redux/store';

const ProfilePageContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoading, error } = useAppSelector((state: RootState) => state.profile);
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-lg mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return <ProfilePage profile={profile} />;
};

export default ProfilePageContainer; 