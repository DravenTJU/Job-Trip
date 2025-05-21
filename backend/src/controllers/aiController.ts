import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../utils/apiResponse';
import Resume from '../models/resumeModel';
import Job from '../models/jobModel';

const OPENAI_API_URL = 'https://openrouter.ai/api/v1';
// 设置更长的超时时间（30秒）
const TIMEOUT = 30000;

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

// 定义公司类型接口
interface CompanyObject {
  name: string;
  [key: string]: any;
}

/**
 * 生成求职信
 * @route POST /api/v1/ai/cover-letter
 */
export const generateCoverLetter = async (req: Request, res: Response) => {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new AppError('OpenAI API key is not configured', 500);
    }

    const { 
      jobDescription, 
      tone = 'professional', 
      language = 'chinese', 
      user, 
      resumeId,
      jobId
    } = req.body;

    console.log('Received request body:', req.body);

    // 如果提供了职位ID，获取职位详情
    let jobInfo = jobDescription;
    let job = null;
    
    if (jobId) {
      job = await Job.findById(jobId);
      
      if (job) {
        const jobTitle = job.title;
        let jobCompany = '';
        if (typeof job.company === 'string') {
          jobCompany = job.company;
        } else if (job.company && typeof job.company === 'object') {
          // 使用类型断言处理company对象
          const companyObj = job.company as CompanyObject;
          jobCompany = companyObj.name || '';
        }
        
        const jobLocation = job.location;
        const jobType = job.jobType;
        const jobDesc = job.description || jobDescription;
        
        jobInfo = language === 'chinese' 
          ? `职位标题：${jobTitle}\n公司：${jobCompany}\n${jobLocation ? `地点：${jobLocation}\n` : ''}${jobType ? `工作类型：${jobType}\n` : ''}\n职位描述：${jobDesc}`
          : `Job Title: ${jobTitle}\nCompany: ${jobCompany}\n${jobLocation ? `Location: ${jobLocation}\n` : ''}${jobType ? `Job Type: ${jobType}\n` : ''}\nJob Description: ${jobDesc}`;
      }
    } else if (!jobDescription) {
      throw new AppError('职位描述不能为空', 400);
    }

    // 如果提供了简历ID，获取简历内容
    let resumeContent = '';
    if (resumeId) {
      const resume = await Resume.findOne({
        _id: resumeId,
        user: req.user?._id
      });

      if (resume) {
        resumeContent = resume.content;
      }
    }

    // 更新提示，使用增强的职位信息
    const prompt = language === 'chinese' 
      ? `请根据以下职位信息、用户信息和简历内容，生成一封${tone}风格的${language}求职信：
职位信息：
${jobInfo}

${resumeContent ? `简历内容：${resumeContent}` : ''}

要求：
1. 求职信要突出用户与职位要求的匹配度
2. 使用${tone}的语气
3. 结构清晰，包含开头、主体和结尾
4. 长度适中，约300-500字
5. 如果提供了简历内容，请确保求职信与简历内容保持一致，并突出简历中的关键成就和技能`
      : `Please generate a ${tone} ${language} cover letter based on the following job information, user details, and resume content:
Job Information:
${jobInfo}

${resumeContent ? `Resume Content: ${resumeContent}` : ''}

Requirements:
1. The cover letter should highlight the match between the user and job requirements
2. Use a ${tone} tone
3. Clear structure with introduction, body, and conclusion
4. Moderate length, about 300-500 words
5. If resume content is provided, ensure consistency with the resume and highlight key achievements and skills`;

    console.log('Generated prompt:', prompt);

    try {
      // 创建AbortController用于控制超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
      
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
        }),
        signal: controller.signal,
      });
      
      // 清除超时计时器
      clearTimeout(timeoutId);

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
      if (apiError.name === 'AbortError') {
        throw new AppError('生成求职信超时，请稍后重试', 504);
      }
      throw new AppError(`OpenAI API 调用失败: ${apiError.message}`, 500);
    }
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json(createApiResponse(error.statusCode, error.message));
    } else {
      res.status(500).json(createApiResponse(500, '生成求职信时发生错误'));
    }
  }
}; 