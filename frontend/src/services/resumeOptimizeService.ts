import axios from 'axios';

// AI简历优化服务接口
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

// 简历数据结构接口
interface ResumeData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  educations?: Array<{
    education?: string;
    school?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
  }>;
  workExperiences?: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    responsibilities?: string;
  }>;
  skills?: string;
  [key: string]: any; // 允许其他字段
}

// AI简历优化服务
const resumeOptimizeService = {
  // 使用AI优化简历内容
  optimizeResume: async (resumeContent: string): Promise<string> => {
    try {
      // 解析原始简历内容为结构化数据
      let resumeData: ResumeData;
      try {
        resumeData = JSON.parse(resumeContent);
      } catch (e) {
        // 如果不是JSON格式，则使用原始内容
        console.warn('简历内容不是有效的JSON格式，将使用原始文本');
        return resumeContent;
      }

      // 构建提示词，包含结构化数据和要求返回相同结构
      const prompt = `
请优化以下简历，使其更专业、更有针对性。

简历数据如下（JSON格式）：
${JSON.stringify(resumeData, null, 2)}

要求：
1. 保持相同的JSON数据结构
2. 优化个人信息、教育背景、工作经历和技能描述
3. 使表述更专业，突出关键成就和技能
4. 返回完整的JSON格式数据，确保可以被解析
5. 不要添加任何额外的解释，只返回优化后的JSON数据
`;

      // 从环境变量获取API密钥，如果不存在则使用备用密钥
      // 在Vite项目中使用import.meta.env而不是process.env
      // const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
      const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
      console.log('正在发送AI优化请求...');
      const response = await axios.post<AIResponse>(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-chat:free',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      console.log('AI优化请求成功返回');

      // 获取AI生成的内容
      const aiResponse = response.data.choices[0].message.content;
      
      // 尝试解析AI返回的内容为JSON
      try {
        // 提取JSON部分（防止AI返回了额外的解释文本）
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
        
        // 验证是否为有效的JSON
        JSON.parse(jsonStr);
        return jsonStr;
      } catch (e) {
        console.error('AI返回的内容不是有效的JSON格式:', e);
        // 如果解析失败，返回原始AI响应
        return aiResponse;
      }
    } catch (error) {
      console.error('AI优化简历内容失败:', error);
      // 提供更详细的错误信息以便调试
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 服务器返回了错误响应
          console.error('API错误响应:', error.response.status, error.response.data);
          throw new Error(`API请求失败: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          // 请求已发送但没有收到响应
          console.error('未收到API响应:', error.request);
          throw new Error('未收到API响应，请检查网络连接');
        } else {
          // 请求配置出错
          throw new Error(`请求配置错误: ${error.message}`);
        }
      }
      throw new Error('AI优化简历内容失败，请稍后重试');
    }
  }
};

export default resumeOptimizeService;