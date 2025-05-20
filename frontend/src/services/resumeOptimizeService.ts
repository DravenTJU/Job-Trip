import axios from 'axios';

// AI简历优化服务接口
// interface AIResponse {
//   id: string;
//   object: string;
//   created: number;
//   model: string;
//   choices: {
//     index: number;
//     message: {
//       role: string;
//       content: string;
//     };
//     finish_reason: string;
//   }[];
//   usage: {
//     prompt_tokens: number;
//     completion_tokens: number;
//     total_tokens: number;
//   };
// }

// 简历数据结构接口
// interface ResumeData {
//   personalInfo?: {
//     fullName?: string;
//     email?: string;
//     phone?: string;
//     location?: string;
//   };
//   educations?: Array<{
//     education?: string;
//     school?: string;
//     major?: string;
//     startDate?: string;
//     endDate?: string;
//   }>;
//   workExperiences?: Array<{
//     company?: string;
//     position?: string;
//     startDate?: string;
//     endDate?: string;
//     responsibilities?: string;
//   }>;
//   skills?: string;
//   [key: string]: any; // 允许其他字段
// }

interface ResumeOptimizationResponse {
  success: boolean;
  data: {
    optimizedContent: string;
  };
}

// AI简历优化服务
const resumeOptimizeService = {
  // 使用AI优化简历内容
  optimizeResume: async (
    resumeContent: string,
    jobDescription: string,
    targetPosition: string
  ): Promise<string> => {
    try {
      const response = await axios.post<ResumeOptimizationResponse>(
        '/api/v1/ai/resume/optimize',
        {
          resumeContent,
          jobDescription,
          targetPosition
        }
      );

      if (response.data.success) {
        return response.data.data.optimizedContent;
      } else {
        throw new Error('简历优化失败');
      }
    } catch (error) {
      console.error('简历优化服务错误:', error);
      throw new Error('简历优化失败，请稍后重试');
    }
  }
};

export default resumeOptimizeService;