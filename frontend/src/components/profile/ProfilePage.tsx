import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { setActiveSection } from '../../redux/slices/profileSlice';
import { UserProfile } from '../../types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileCompleteness from './ProfileCompleteness';
import ProfileSidebar from './ProfileSidebar';
import EducationSection from './EducationSection';
import WorkExperienceSection from './WorkExperienceSection';
import SkillsSection from './SkillsSection';
import CertificationsSection from './CertificationsSection';
import ProjectsSection from './ProjectsSection';
import LanguagesSection from './LanguagesSection';
import VolunteerSection from './VolunteerSection';
import AwardsSection from './AwardsSection';
// import RecommendationsSection from './RecommendationsSection';
import { RootState } from '../../redux/store';
import { useTranslation } from 'react-i18next';

interface ProfilePageProps {
  profile: UserProfile | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
  const dispatch = useAppDispatch();
  const { activeSection } = useAppSelector((state: RootState) => state.profile);
  const { t } = useTranslation('profile');

  if (!profile) {
    return (
      <div className="container-lg mx-auto px-4 py-8">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('profile_not_created', '档案未创建')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('complete_profile_prompt', '请完善您的个人档案以提高求职匹配度')}</p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic':
        return <ProfileHeader profile={profile} />;
      case 'education':
        return <EducationSection educations={profile.educations || []} />;
      case 'work':
        return <WorkExperienceSection workExperiences={profile.workExperiences || []} />;
      case 'skills':
        return <SkillsSection skills={profile.skills || []} />;
      case 'certifications':
        return <CertificationsSection certifications={profile.certifications || []} />;
      case 'projects':
        return <ProjectsSection projects={profile.projects || []} />;
      case 'languages':
        return <LanguagesSection languages={profile.languages || []} />;
      case 'volunteer':
        return <VolunteerSection volunteerExperiences={profile.volunteerExperiences || []} />;
      case 'awards':
        return <AwardsSection honorsAwards={profile.honorsAwards || []} />;
      case 'recommendations':
        // 暂时返回一个提示信息，等待RecommendationsSection组件实现
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <h3 className="text-lg font-medium mb-2">{t('recommendations_coming_soon', '推荐功能即将上线')}</h3>
            <p>{t('recommendations_development_message', '我们正在开发用户推荐功能，敬请期待！')}</p>
          </div>
        );
      default:
        return <ProfileHeader profile={profile} />;
    }
  };

  return (
    <div className="container-lg">
      <div className="section">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('profile:title', '个人档案')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('profile:subtitle', '查看和管理您的所有个人档案')}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* 侧边栏 */}
        <div className="md:w-1/4">
          <ProfileCompleteness completeness={profile.profileCompleteness || 0} />
          <ProfileSidebar activeSection={activeSection} onSectionChange={(section) => dispatch(setActiveSection(section))} />
        </div>
        
        {/* 主内容 */}
        <div className="md:w-3/4">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 