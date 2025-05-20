import React from 'react';
import { useTranslation } from 'react-i18next';

interface SummaryStepProps {
  data: any;
  onFinish: () => void;
  onPrevious: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  const { t } = useTranslation('profile');
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{t('confirm_information', '确认信息')}</h2>
      
      <div className="space-y-8">
        {/* 基本信息 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('basic_info', '基本信息')}</h3>
          <div className="mt-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('full_name', '姓名')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {(data.lastName && data.firstName) ? `${data.lastName}${data.firstName}` : t('not_provided', '未填写')}
                  </dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('job_title', '职位名称')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.headline || t('not_provided', '未填写')}</dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('personal_bio', '个人简介')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.biography || t('not_provided', '未填写')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        {/* 联系信息 */}
        {data.contactInfo && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('contact_info', '联系信息')}</h3>
            <div className="mt-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('email', '邮箱')}</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.contactInfo.email || t('not_provided', '未填写')}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('phone', '电话')}</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.contactInfo.phone || t('not_provided', '未填写')}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('personal_website', '网站')}</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.contactInfo.website || t('not_provided', '未填写')}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('location', '地址')}</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.contactInfo.address || t('not_provided', '未填写')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
        
        {/* 其他部分摘要 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('education', '教育经历')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.educations && data.educations.length > 0 
                  ? t('education_count', `已添加 ${data.educations.length} 条教育经历`) 
                  : t('no_education_added', '未添加教育经历')}
              </p>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('work_experience', '工作经验')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.workExperiences && data.workExperiences.length > 0 
                  ? t('work_count', `已添加 ${data.workExperiences.length} 条工作经验`) 
                  : t('no_work_added', '未添加工作经验')}
              </p>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('skills', '技能')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.skills && data.skills.length > 0 
                  ? t('skills_count', `已添加 ${data.skills.length} 项技能`) 
                  : t('no_skills_added', '未添加技能')}
              </p>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('certifications', '证书资质')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.certifications && data.certifications.length > 0 
                  ? t('certifications_count', `已添加 ${data.certifications.length} 个证书`) 
                  : t('no_certifications_added', '未添加证书')}
              </p>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('projects', '项目经历')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.projects && data.projects.length > 0 
                  ? t('projects_count', `已添加 ${data.projects.length} 个项目`) 
                  : t('no_projects_added', '未添加项目')}
              </p>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('languages', '语言能力')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.languages && data.languages.length > 0 
                  ? t('languages_count', `已添加 ${data.languages.length} 种语言`) 
                  : t('no_languages_added', '未添加语言')}
              </p>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('honors_awards', '荣誉奖项')}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.honorsAwards && data.honorsAwards.length > 0 
                  ? t('awards_count', `已添加 ${data.honorsAwards.length} 项荣誉奖项`) 
                  : t('no_awards_added', '未添加荣誉奖项')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50/80 dark:bg-yellow-900/30 p-5 rounded-xl ring-2 ring-yellow-200 dark:ring-yellow-800/50 backdrop-blur-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{t('please_confirm', '请确认信息')}</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  {t('confirm_message', '请确认以上信息准确无误，点击"完成创建"按钮创建您的个人档案。创建后您仍可随时修改和完善档案信息。')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep; 