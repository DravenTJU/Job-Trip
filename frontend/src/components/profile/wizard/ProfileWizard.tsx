import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { createUserProfile } from '../../../redux/slices/profileSlice';
import WizardSteps from './WizardSteps';
import WizardNavigation from './WizardNavigation';
import BasicInfoStep from './steps/BasicInfoStep';
import ContactInfoStep from './steps/ContactInfoStep';
import EducationStep from './steps/EducationStep';
// import WorkExperienceStep from './steps/WorkExperienceStep';
// import SkillsStep from './steps/SkillsStep';
// import CertificationsStep from './steps/CertificationsStep';
// import ProjectsStep from './steps/ProjectsStep';
// import LanguagesStep from './steps/LanguagesStep';
// import HonorsAwardsStep from './steps/HonorsAwardsStep';
import SummaryStep from './steps/SummaryStep';
import { useTranslation } from 'react-i18next';

const ProfileWizard: React.FC = () => {
  const { t } = useTranslation('profile');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    headline: '',
    biography: '',
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      address: '',
      socialMedia: {
        linkedin: '',
        github: '',
        twitter: '',
        other: [] // 添加other字段以满足类型要求
      }
    },
    educations: [],
    workExperiences: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    honorsAwards: []
  });
  
  const steps = [
    { title: t('basic_info', '基本信息'), description: t('add_basic_info_desc', '添加您的职位名称和简介') },
    { title: t('contact_info', '联系方式'), description: t('add_contact_info_desc', '填写您的联系信息') },
    { title: t('education', '教育经历'), description: t('add_education_desc', '添加您的学历信息') },
    // 临时简化步骤，只保留已实现的组件
    /* 
    { title: '工作经验', description: '添加您的工作经验' },
    { title: '专业技能', description: '添加您的专业技能' },
    { title: '证书资质', description: '添加您的专业证书' },
    { title: '项目经历', description: '添加您的项目经验' },
    { title: '语言能力', description: '添加您的语言技能' },
    { title: '荣誉奖项', description: '添加您获得的奖项和荣誉' },
    */
    { title: t('complete_profile', '完成创建'), description: t('submit_profile_desc', '提交并创建您的档案') }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleUpdateData = (stepData: any) => {
    setProfileData({
      ...profileData,
      ...stepData
    });
  };

  const handleFinish = async () => {
    // 创建用户档案
    try {
      await dispatch(createUserProfile(profileData)).unwrap();
      navigate('/profile');
    } catch (error) {
      console.error(t('profile_create_error', '创建用户档案失败:'), error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
        />;
      case 1:
        return <ContactInfoStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
        />;
      case 2:
        return <EducationStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      // 注释掉未实现的步骤组件渲染
      /*
      case 3:
        return <WorkExperienceStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 4:
        return <SkillsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 5:
        return <CertificationsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 6:
        return <ProjectsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 7:
        return <LanguagesStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 8:
        return <HonorsAwardsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      */
      case 3: // 更新为对应step数字
        return <SummaryStep 
          data={profileData}
          onFinish={handleFinish}
          onPrevious={handlePrevious}
        />;
      default:
        return <BasicInfoStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
        />;
    }
  };

  return (
    <div className="container-lg mx-auto px-4 py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{t('create_profile', '创建您的个人档案')}</h1>
        
        <WizardSteps steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {renderStep()}
        </div>
        
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          isLastStep={currentStep === steps.length - 1}
          onFinish={handleFinish}
        />
      </div>
    </div>
  );
};

export default ProfileWizard; 