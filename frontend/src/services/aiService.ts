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

// AI服务接口
interface AIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// AI服务
const aiService = {
  // 使用AI生成定制简历内容
  generateTailoredResume: async (baseContent: string, targetPosition: string, targetJob: string): Promise<string> => {
    try {
      const response = await axios.post<AIResponse>(
        '/api/v1/ai/resume',
        {
          baseContent,
          targetPosition,
          targetJob
        }
      );

      // 返回AI生成的内容
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI生成简历内容失败:', error);
      throw new Error('AI生成简历内容失败，请稍后重试');
    }
  },

  generateCoverLetter: async (data: {
    jobDescription: string;
    tone?: string;
    language?: string;
    user: any;
  }) => {
    try {
      const response = await axios.post('/api/v1/ai/cover-letter', data);
      return response.data;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }
};

export default aiService;