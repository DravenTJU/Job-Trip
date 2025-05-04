import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../utils/apiResponse';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://openrouter.ai/api/v1';

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

interface OpenAIError {
  error?: {
    message: string;
  };
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * 生成求职信
 * @route POST /api/v1/ai/cover-letter
 */
export const generateCoverLetter = async (req: Request, res: Response) => {
  try {
    const { jobDescription, tone = 'professional', language = 'chinese', user } = req.body;

    console.log('Received request body:', req.body);

    if (!jobDescription) {
      throw new AppError('职位描述不能为空', 400);
    }

    const prompt = language === 'chinese' 
      ? `请根据以下职位描述和用户信息，生成一封${tone}风格的求职信：
职位描述：${jobDescription}
用户信息：
姓名：${user.firstName} ${user.lastName}
经验：${user.experience}
教育背景：${user.education}
技能：${user.skills.join(', ')}

要求：
1. 求职信要突出用户与职位要求的匹配度
2. 使用${tone}的语气
3. 结构清晰，包含开头、主体和结尾
4. 长度适中，约300-500字`
      : `Please generate a ${tone} cover letter based on the following job description and user information:
Job Description: ${jobDescription}
User Information:
Name: ${user.firstName} ${user.lastName}
Experience: ${user.experience}
Education: ${user.education}
Skills: ${user.skills.join(', ')}

Requirements:
1. The cover letter should highlight the match between the user and job requirements
2. Use a ${tone} tone
3. Clear structure with introduction, body, and conclusion
4. Moderate length, about 300-500 words`;

    console.log('Generated prompt:', prompt);

    try {
      const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'JobTrip AI Cover Letter Generator'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat:free',
          messages: [
            {
              role: 'system',
              content: language === 'chinese' 
                ? '你是一位专业的求职顾问，擅长撰写求职信。'
                : 'You are a professional career advisor, skilled at writing cover letters.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json() as OpenAIError;
        throw new AppError(`OpenAI API 调用失败: ${errorData.error?.message || response.statusText}`, response.status);
      }

      const completion = await response.json() as OpenAIResponse;
      console.log('OpenAI API response:', completion);

      const coverLetter = completion.choices[0]?.message?.content;

      if (!coverLetter) {
        throw new AppError('生成求职信失败：API 返回空内容', 500);
      }

      console.log('Cover letter generated successfully');

      res.status(200).json(createApiResponse(200, '求职信生成成功', { coverLetter }));
    } catch (apiError: any) {
      console.error('OpenAI API error:', apiError);
      throw new AppError(`OpenAI API 调用失败: ${apiError.message}`, 500);
    }
  } catch (error) {
    console.error('Error generating cover letter:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json(createApiResponse(error.statusCode, error.message));
    } else {
      res.status(500).json(createApiResponse(500, '生成求职信时发生错误'));
    }
  }
}; 