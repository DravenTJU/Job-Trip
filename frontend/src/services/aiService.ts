import axios from 'axios';

// 使用相对路径，通过 Vite 代理转发到后端
const API_BASE_URL = '/api';

interface CoverLetterResponse {
  success: boolean;
  data: {
    coverLetter: string;
  };
}

interface ResumeResponse {
  success: boolean;
  data: {
    resume: string;
  };
}

export const generateCoverLetter = async (
  jobDescription: string,
  userInfo: string,
  language: 'zh' | 'en' = 'zh'
): Promise<string> => {
  try {
    const response = await axios.post<CoverLetterResponse>(
      `${API_BASE_URL}/ai/cover-letter`,
      {
        jobDescription,
        userInfo,
        language
      }
    );

    if (response.data.success) {
      return response.data.data.coverLetter;
    } else {
      throw new Error('生成求职信失败');
    }
  } catch (error) {
    console.error('生成求职信服务错误:', error);
    throw new Error('生成求职信失败，请稍后重试');
  }
};

export const generateTailoredResume = async (
  baseContent: string,
  targetPosition: string,
  targetJob: string
): Promise<string> => {
  try {
    const response = await axios.post<ResumeResponse>(
      `${API_BASE_URL}/ai/resume`,
      {
        baseContent,
        targetPosition,
        targetJob
      }
    );

    if (response.data.success) {
      return response.data.data.resume;
    } else {
      throw new Error('生成简历失败');
    }
  } catch (error) {
    console.error('生成简历服务错误:', error);
    throw new Error('生成简历失败，请稍后重试');
  }
};