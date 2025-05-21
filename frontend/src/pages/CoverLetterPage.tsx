import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { fetchResumes } from '@/redux/slices/resumesSlice';
import { fetchUserRelatedJobs } from '@/redux/slices/jobsSlice';
import { Resume, Job } from '@/types';
import { useTranslation } from 'react-i18next';
import GenericListbox, { SelectOption } from '@/components/common/GenericListbox';
import api from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

const CoverLetterPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState(() => {
    return currentLanguage.startsWith('zh') ? 'chinese' : 'english';
  });
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const { user } = useAppSelector((state) => state.auth);
  const { resumes } = useAppSelector((state) => state.resumes);
  const { jobs } = useAppSelector((state) => state.jobs);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('coverLetter');

  useEffect(() => {
    if (!language) {
      setLanguage(currentLanguage.startsWith('zh') ? 'chinese' : 'english');
    }
  }, [currentLanguage, language]);

  useEffect(() => {
    dispatch(fetchResumes({}));
    dispatch(fetchUserRelatedJobs({}));
  }, [dispatch]);

  // 处理职位选择变更
  const handleJobChange = (option: SelectOption | null) => {
    if (option) {
      const jobId = option.id.toString();
      setSelectedJobId(jobId);
      
      // 查找完整的职位信息以自动填充描述
      const job = jobs.find(job => job._id === jobId);
      if (job) {
        // 自动填充职位描述
        setJobDescription(job.description || '');
      }
    } else {
      setSelectedJobId('');
    }
  };

  const handleGenerate = async () => {
    if (!selectedJobId && !jobDescription.trim()) {
      setError(t('enter_job_description', '请输入职位描述'));
      return;
    }

    if (!user) {
      setError(t('login_required', '请先登录'));
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        experience: t('not_provided', '未提供'),
        education: t('not_provided', '未提供'),
        skills: [],
      };

      // 准备请求数据
      const requestData: any = {
        user: userData,
        tone,
        language,
        resumeId: selectedResumeId || undefined,
      };

      // 如果选择了职位，只发送jobId
      if (selectedJobId) {
        requestData.jobId = selectedJobId;
      }
      
      // 如果没有选择职位但有描述，发送描述
      if (!selectedJobId && jobDescription) {
        requestData.jobDescription = jobDescription;
      }

      console.log(t('sending_request_data', '发送请求数据:'), requestData);

      try {
        // 定义接口来描述预期的响应数据结构
        interface CoverLetterResponse {
          coverLetter: string;
        }
        
        const data = await api.post<CoverLetterResponse>('/ai/cover-letter', requestData);
        
        console.log(t('response_data', '响应数据:'), data);
        
        // data直接是data字段的内容，api服务已经处理了响应格式
        setCoverLetter(data.coverLetter);
      } catch (apiError: any) {
        console.error('API错误:', apiError);
        
        // 处理超时错误
        if (apiError.status === 504 || (apiError.message && apiError.message.includes('timeout'))) {
          setError(t('timeout_error', '生成求职信超时，请稍后重试。AI生成可能需要较长时间，特别是在高峰期。'));
        } else {
          setError(apiError.message || t('generate_cover_letter_failed', '生成求职信失败'));
        }
      }
    } catch (error) {
      console.error(t('generate_cover_letter_error', '生成求职信时出错:'), error);
      setError(t('generate_cover_letter_error_retry', '生成求职信时发生错误，请稍后重试'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = t('cover_letter_filename', '求职信.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 定义语气风格选项
  const toneOptions: SelectOption[] = [
    { id: 'professional', label: t('professional_formal', '专业正式') },
    { id: 'friendly', label: t('friendly_warm', '友好亲切') },
    { id: 'confident', label: t('confident_positive', '自信积极') },
    { id: 'creative', label: t('creative_unique', '创新独特') }
  ];

  // 定义语言选项
  const languageOptions: SelectOption[] = [
    { id: 'chinese', label: t('chinese', '中文') },
    { id: 'english', label: 'English' }
  ];

  // 构建简历选项
  const resumeOptions: SelectOption[] = [
    { id: '', label: t('dont_use_resume', '不使用简历') },
    ...resumes.map((resume: Resume) => ({
      id: resume._id,
      label: resume.name
    }))
  ];

  // 构建职位选项
  const jobOptions: SelectOption[] = [
    { id: '', label: t('dont_use_saved_job', '不使用已保存职位') },
    ...jobs.map((job: Job) => ({
      id: job._id,
      label: `${job.title} - ${typeof job.company === 'string' ? job.company : job.company.name}`
    }))
  ];

  // 处理语气风格变更
  const handleToneChange = (option: SelectOption | null) => {
    if (option) {
      setTone(option.id.toString());
    }
  };

  // 处理语言变更
  const handleLanguageChange = (option: SelectOption | null) => {
    if (option) {
      setLanguage(option.id.toString());
    }
  };

  // 处理简历选择变更
  const handleResumeChange = (option: SelectOption | null) => {
    setSelectedResumeId(option ? option.id.toString() : '');
  };

  // 获取当前选中的语气选项
  const selectedTone = toneOptions.find(option => option.id === tone) || null;
  
  // 获取当前选中的语言选项
  const selectedLanguage = languageOptions.find(option => option.id === language) || null;
  
  // 获取当前选中的简历选项
  const selectedResume = resumeOptions.find(option => option.id === selectedResumeId) || null;

  // 获取当前选中的职位选项
  const selectedJobOption = jobOptions.find(option => option.id === selectedJobId) || null;

  return (
    <div className="container-lg">
      <div className="section">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('ai_cover_letter_generator', 'AI求职信生成器')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('ai_cover_letter_generator_description', '使用AI创建个性化求职信')}</p>
      </div>
      <div className="flex-1">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <GenericListbox
              options={jobOptions}
              value={selectedJobOption}
              onChange={handleJobChange}
              label={t('select_job_optional', '选择已保存职位（可选）')}
              name="job"
            />
            <p className="text-sm text-gray-500 mt-2">
              {t('job_helps_ai', '选择已保存的职位可以帮助AI生成更匹配的求职信')}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('job_description', '职位描述')}
            </label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t('paste_job_description', '请粘贴职位描述...')}
            />
          </div>

          <div className="mb-6">
            <GenericListbox
              options={resumeOptions}
              value={selectedResume}
              onChange={handleResumeChange}
              label={t('select_resume_optional', '选择简历（可选）')}
              name="resume"
            />
            <p className="text-sm text-gray-500 mt-2">
              {t('resume_helps_ai', '选择简历可以帮助AI生成更符合您背景的求职信')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <GenericListbox
                options={toneOptions}
                value={selectedTone}
                onChange={handleToneChange}
                label={t('tone_style', '语气风格')}
                name="tone"
              />
            </div>

            <div>
              <GenericListbox
                options={languageOptions}
                value={selectedLanguage}
                onChange={handleLanguageChange}
                label={t('language', '语言')}
                name="language"
              />
            </div>
          </div>

          <button
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center"
            onClick={handleGenerate}
            disabled={isGenerating || (!selectedJobId && !jobDescription.trim())}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                {t('generating', '正在生成...')}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {t('generate_cover_letter', '生成求职信')}
              </>
            )}
          </button>
        </div>

        {coverLetter && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('generated_cover_letter', '生成的求职信')}</h2>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={handleCopy}
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{coverLetter}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterPage; 