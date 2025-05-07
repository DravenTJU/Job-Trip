import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { fetchResumes } from '@/redux/slices/resumesSlice';
import { Resume } from '@/types';

const CoverLetterPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('chinese');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const { user } = useAppSelector((state) => state.auth);
  const { resumes } = useAppSelector((state) => state.resumes);
  const dispatch = useAppDispatch();

  // 加载用户的简历列表
  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError('请输入职位描述');
      return;
    }

    if (!user) {
      setError('请先登录');
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        experience: '未提供',
        education: '未提供',
        skills: [],
      };

      console.log('Sending request with data:', {
        jobDescription,
        tone,
        language,
        user: userData,
        resumeId: selectedResumeId || undefined,
      });

      const response = await fetch('http://localhost:3000/api/v1/ai/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          jobDescription,
          tone,
          language,
          user: userData,
          resumeId: selectedResumeId || undefined,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.code === 200) {
        setCoverLetter(data.data.coverLetter);
      } else {
        setError(data.message || '生成求职信失败');
      }
    } catch (error) {
      console.error('生成求职信时出错:', error);
      setError('生成求职信时发生错误，请稍后重试');
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
    element.download = '求职信.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI 求职信生成器</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              职位描述
            </label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="请粘贴职位描述..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                语气风格
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">专业正式</option>
                <option value="friendly">友好亲切</option>
                <option value="confident">自信积极</option>
                <option value="creative">创新独特</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                语言
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="chinese">中文</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择简历（可选）
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
            >
              <option value="">不使用简历</option>
              {resumes.map((resume: Resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              选择简历可以帮助AI生成更符合您背景的求职信
            </p>
          </div>

          <button
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center"
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                正在生成...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                生成求职信
              </>
            )}
          </button>
        </div>

        {coverLetter && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">生成的求职信</h2>
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