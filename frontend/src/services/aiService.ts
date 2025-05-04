import axios from 'axios';

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
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-chat:free',
          messages: [
            {
              role: 'user',
              content: `我有一份基础简历，需要针对特定职位进行优化。请帮我根据目标职位和工作要求，重新编写简历内容，突出与该职位相关的技能和经验。

基础简历内容：
${baseContent}

目标职位：${targetPosition}
目标工作：${targetJob}

请提供优化后的简历内容，保持专业性和针对性。`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          }
        }
      );

      // 返回AI生成的内容
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI生成简历内容失败:', error);
      throw new Error('AI生成简历内容失败，请稍后重试');
    }
  }
};

export default aiService;