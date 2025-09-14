import { Request, Response, NextFunction } from 'express';
import Resume, { ResumeType } from '../models/resumeModel';
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * @desc    获取用户的所有简历
 * @route   GET /api/v1/resumes
 * @access  私有
 */
export const getResumes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 构建查询条件 - 只返回当前用户的简历
    const queryObj = { ...req.query, user: req.user?._id };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete (queryObj as any)[el]);

    // 高级筛选
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // 查询数据
    let query = Resume.find(JSON.parse(queryStr));

    // 排序
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 字段限制
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 分页
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // 执行查询
    const resumes = await query;
    
    // 获取总数
    const total = await Resume.countDocuments(JSON.parse(queryStr));

    // 返回结果
    res.status(200).json(createApiResponse(
      200,
      '获取简历列表成功',
      {
        total,
        page,
        size: limit,
        data: resumes,
        totalPages: Math.ceil(total / limit)
      }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    获取单个简历
 * @route   GET /api/v1/resumes/:id
 * @access  私有
 */
export const getResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '获取简历详情成功',
      resume
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    创建简历
 * @route   POST /api/v1/resumes
 * @access  私有
 */
export const createResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 确保设置当前用户为简历所有者
    const resumeData = {
      ...req.body,
      user: req.user?._id
    };

    // 根据type设置tailored字段
    if (resumeData.type === ResumeType.TAILORED) {
      resumeData.tailored = true;
    }

    const resume = await Resume.create(resumeData);

    res.status(201).json(createApiResponse(
      200,
      '创建简历成功',
      resume
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    更新简历
 * @route   PUT /api/v1/resumes/:id
 * @access  私有
 */
export const updateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 确保只能更新自己的简历
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '更新简历成功',
      resume
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    删除简历
 * @route   DELETE /api/v1/resumes/:id
 * @access  私有
 */
export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 确保只能删除自己的简历
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    res.status(200).json(createApiResponse(
      200,
      '删除简历成功',
      null
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    复制简历
 * @route   POST /api/v1/resumes/:id/duplicate
 * @access  私有
 */
export const duplicateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 查找原始简历
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!originalResume) {
      return next(new AppError('未找到该简历', 404));
    }

    // 创建新简历数据
    const newResumeData = {
      name: `${originalResume.name} (副本)`,
      user: req.user?._id,
      content: originalResume.content,
      type: originalResume.type,
      targetPosition: originalResume.targetPosition,
      targetJob: originalResume.targetJob,
      tailored: originalResume.tailored,
      thumbnail: originalResume.thumbnail
    };

    // 创建新简历
    const newResume = await Resume.create(newResumeData);

    res.status(201).json(createApiResponse(
      200,
      '复制简历成功',
      newResume
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    下载简历
 * @route   GET /api/v1/resumes/:id/download
 * @access  私有
 */
export const downloadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('开始下载简历');
    // 查找简历 - 使用req.user（由protect中间件提供）
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    }).populate('user', 'firstName lastName email');
    console.log(resume);
    if (!resume) {
      return next(new AppError('未找到该简历', 404));
    }

    console.log(`开始生成简历Word文档: ${resume.name}, ID: ${resume._id}`);

    // 获取简历内容
    const contentStr = resume.content || '';
    console.log(`简历内容长度: ${contentStr.length} 字符`);
    console.log(`简历原始内容: ${contentStr.substring(0, 200)}...`);
    
    // 尝试解析JSON内容
    let parsedContent;
    let formattedContent = '';
    try {
      // 确保contentStr是有效的字符串
      if (!contentStr || typeof contentStr !== 'string') {
        console.log('简历内容为空或不是字符串类型');
        throw new Error('简历内容为空或无效');
      }
      
      // 尝试清理内容字符串，移除可能导致JSON解析失败的字符
      let cleanedContent = contentStr.trim();
      if (cleanedContent === '') {
        console.log('简历内容为空字符串');
        throw new Error('简历内容为空');
      }
      
      // 尝试解析JSON，处理各种可能的格式问题
      try {
        // 首先尝试直接解析
        parsedContent = JSON.parse(cleanedContent);
        console.log('简历内容JSON直接解析成功');
      } catch (jsonError) {
        console.log('直接JSON解析失败，尝试修复格式:', (jsonError as Error).message);
        
        // 尝试修复常见的JSON格式问题
        let fixedContent = cleanedContent;
        
        // 1. 检查是否被单引号包裹
        if (fixedContent.startsWith("'") && fixedContent.endsWith("'")) {
          fixedContent = fixedContent.substring(1, fixedContent.length - 1);
          console.log('移除外层单引号');
        }
        
        // 2. 检查是否被反引号包裹
        if (fixedContent.startsWith("`") && fixedContent.endsWith("`")) {
          fixedContent = fixedContent.substring(1, fixedContent.length - 1);
          console.log('移除外层反引号');
        }
        
        // 3. 检查是否被双引号包裹且内容本身是JSON字符串
        if (fixedContent.startsWith('"') && fixedContent.endsWith('"')) {
          try {
            // 先解析外层引号，得到内部字符串
            const innerContent = JSON.parse(fixedContent);
            if (typeof innerContent === 'string') {
              // 再解析内部字符串
              fixedContent = innerContent;
              console.log('解析双层JSON字符串');
            }
          } catch (e) {
            console.log('尝试解析双层JSON失败，继续其他修复方法');
          }
        }
        
        // 4. 尝试替换可能导致问题的转义字符
        if (fixedContent.includes('\\"')) {
          fixedContent = fixedContent.replace(/\\\\?"/g, '"');
          console.log('修复过度转义的引号');
        }
        
        // 5. 尝试解析修复后的内容
        try {
          parsedContent = JSON.parse(fixedContent);
          console.log('修复后JSON解析成功');
        } catch (fixError) {
          console.error('修复后仍然无法解析JSON:', (fixError as Error).message);
          
          // 6. 最后尝试，如果内容看起来像对象但不是有效JSON
          if (fixedContent.includes(':') && (fixedContent.includes('{') || fixedContent.includes('['))) {
            try {
              // 使用Function构造函数尝试解析（注意：这在某些环境中可能不安全）
              // 仅作为最后手段使用
              parsedContent = Function('return ' + fixedContent)();
              console.log('使用Function解析成功');
            } catch (funcError) {
              console.error('所有解析方法都失败:', (funcError as Error).message);
              throw new Error('无法解析简历内容，格式不正确');
            }
          } else {
            throw new Error('简历内容不是有效的JSON格式');
          }
        }
      }
      
      // 验证解析结果
      if (!parsedContent) {
        console.log('解析后的JSON为null或undefined');
        throw new Error('解析后的JSON无效');
      }
      
      console.log('解析后的JSON结构:', JSON.stringify(parsedContent, null, 2).substring(0, 200) + '...');
      
      // 初始化格式化内容标志，用于跟踪是否成功格式化了任何内容
      let hasFormattedContent = false;
      
      // 格式化个人信息
      if (parsedContent && parsedContent.personalInfo) {
        formattedContent += '个人信息:\n';
        const personalInfo = parsedContent.personalInfo || {};
        const { fullName, email, phone, location } = personalInfo;
        if (fullName) formattedContent += `姓名: ${fullName}\n`;
        if (email) formattedContent += `邮箱: ${email}\n`;
        if (phone) formattedContent += `电话: ${phone}\n`;
        if (location) formattedContent += `所在地: ${location}\n`;
        formattedContent += '\n';
        hasFormattedContent = true;
      }
      
      // 格式化教育背景
      if (parsedContent && parsedContent.educations && Array.isArray(parsedContent.educations)) {
        formattedContent += '教育背景:\n';
        let hasEducationContent = false;
        parsedContent.educations.forEach((edu: any) => {
          if (!edu) return; // 跳过无效的教育记录
          
          if (edu.school) formattedContent += `学校: ${edu.school}\n`;
          if (edu.education) formattedContent += `学历: ${edu.education}\n`;
          if (edu.major) formattedContent += `专业: ${edu.major}\n`;
          if (edu.startDate && edu.endDate) {
            formattedContent += `时间: ${edu.startDate} - ${edu.endDate}\n`;
          }
          formattedContent += '\n';
          hasEducationContent = true;
        });
        hasFormattedContent = hasFormattedContent || hasEducationContent;
      }
      
      // 格式化工作经历
      if (parsedContent && parsedContent.workExperiences && Array.isArray(parsedContent.workExperiences)) {
        formattedContent += '工作经历:\n';
        let hasWorkContent = false;
        parsedContent.workExperiences.forEach((exp: any) => {
          if (!exp) return; // 跳过无效的工作经历记录
          
          if (exp.company) formattedContent += `公司: ${exp.company}\n`;
          if (exp.position) formattedContent += `职位: ${exp.position}\n`;
          if (exp.startDate && exp.endDate) {
            formattedContent += `时间: ${exp.startDate} - ${exp.endDate}\n`;
          }
          if (exp.responsibilities) {
            formattedContent += `职责描述:\n${exp.responsibilities}\n`;
          }
          formattedContent += '\n';
          hasWorkContent = true;
        });
        hasFormattedContent = hasFormattedContent || hasWorkContent;
      }
      
      // 格式化技能
      if (parsedContent && parsedContent.skills) {
        formattedContent += '技能:\n';
        formattedContent += `${parsedContent.skills}\n\n`;
        hasFormattedContent = true;
      }
      
      // 尝试处理其他可能的格式
      if (!hasFormattedContent) {
        console.log('标准格式化失败，尝试处理其他可能的格式');
        
        // 尝试处理简单的键值对格式
        let hasProcessedAnyField = false;
        for (const [key, value] of Object.entries(parsedContent)) {
          // 跳过空值、函数和复杂对象
          if (value === null || value === undefined || typeof value === 'function') continue;
          if (typeof value === 'object' && !Array.isArray(value)) {
            // 处理嵌套对象
            formattedContent += `${key}:\n`;
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              if (nestedValue !== null && nestedValue !== undefined && typeof nestedValue !== 'function') {
                formattedContent += `${nestedKey}: ${nestedValue}\n`;
                hasProcessedAnyField = true;
              }
            }
            formattedContent += '\n';
          } else {
            // 处理简单值或数组
            formattedContent += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
            hasProcessedAnyField = true;
          }
        }
        
        hasFormattedContent = hasProcessedAnyField;
      }
      
      // 检查格式化后的内容是否为空
      if (!hasFormattedContent || formattedContent.trim() === '') {
        console.log('格式化后的内容为空，可能是JSON结构不符合预期');
        formattedContent = '简历内容格式不符合预期，无法正确显示。\n\n';
        formattedContent += '请确保您的简历内容包含以下结构:\n';
        formattedContent += '- personalInfo: 包含个人基本信息\n';
        formattedContent += '- educations: 教育背景数组\n';
        formattedContent += '- workExperiences: 工作经历数组\n';
        formattedContent += '- skills: 技能描述\n\n';
        formattedContent += '原始内容预览:\n' + 
          (contentStr.length > 300 ? contentStr.substring(0, 300) + '...' : contentStr);
      }
    } catch (e) {
      // 如果解析失败，提供更明确的错误信息并尝试从原始内容中提取有用信息
      console.error('简历内容处理失败:', e);
      formattedContent = '简历内容解析失败，可能是格式不正确。\n\n';
      
      // 尝试从原始内容中提取有用信息
      if (contentStr && typeof contentStr === 'string') {
        // 尝试使用正则表达式提取可能的键值对
        try {
          console.log('尝试从原始内容中提取信息');
          const extractedInfo: any = {};
          let hasExtractedInfo = false;
          
          // 提取可能的姓名
          const nameMatch = contentStr.match(/["']?(?:姓名|name|fullName)["']?\s*[:]\s*["']([^"']+)["']/i);
          if (nameMatch && nameMatch[1]) {
            extractedInfo['姓名'] = nameMatch[1];
            hasExtractedInfo = true;
          }
          
          // 提取可能的邮箱
          const emailMatch = contentStr.match(/["']?(?:邮箱|email)["']?\s*[:]\s*["']([^"']+)["']/i);
          if (emailMatch && emailMatch[1]) {
            extractedInfo['邮箱'] = emailMatch[1];
            hasExtractedInfo = true;
          }
          
          // 提取可能的电话
          const phoneMatch = contentStr.match(/["']?(?:电话|phone)["']?\s*[:]\s*["']([^"']+)["']/i);
          if (phoneMatch && phoneMatch[1]) {
            extractedInfo['电话'] = phoneMatch[1];
            hasExtractedInfo = true;
          }
          
          // 提取可能的位置
          const locationMatch = contentStr.match(/["']?(?:位置|地址|所在地|location)["']?\s*[:]\s*["']([^"']+)["']/i);
          if (locationMatch && locationMatch[1]) {
            extractedInfo['所在地'] = locationMatch[1];
            hasExtractedInfo = true;
          }
          
          // 如果成功提取了信息，添加到格式化内容中
          if (hasExtractedInfo) {
            formattedContent += '从内容中提取的信息:\n';
            for (const [key, value] of Object.entries(extractedInfo)) {
              formattedContent += `${key}: ${value}\n`;
            }
            formattedContent += '\n';
          }
          
          console.log('提取的信息:', JSON.stringify(extractedInfo));
        } catch (extractError) {
          console.error('从原始内容提取信息失败:', extractError);
        }
        
        // 添加原始内容预览
        if ((contentStr.startsWith('{') && contentStr.endsWith('}')) || 
            (contentStr.startsWith('[') && contentStr.endsWith(']'))) {
          formattedContent += '原始内容(JSON格式不正确):\n';
        } else {
          formattedContent += '原始内容预览:\n';
        }
        
        // 限制显示的内容长度，避免过长
        formattedContent += contentStr.length > 500 ? 
          contentStr.substring(0, 500) + '\n[内容过长已截断]' : contentStr;
        
        // 添加帮助信息
        formattedContent += '\n\n请确保您的简历内容是有效的JSON格式，并包含以下结构:\n';
        formattedContent += '- personalInfo: 包含姓名、邮箱、电话等个人信息\n';
        formattedContent += '- educations: 教育背景信息数组\n';
        formattedContent += '- workExperiences: 工作经历信息数组\n';
        formattedContent += '- skills: 技能描述\n';
      } else {
        formattedContent += '无法显示原始内容(内容为空或格式不支持)';
      }
    }

    console.log(`格式化后的内容长度: ${formattedContent.length} 字符`);
    console.log(`格式化后的内容示例: ${formattedContent.substring(0, 200)}...`);
    
    // 先声明doc变量，稍后创建
    let doc: Document;
    
    // 创建段落数组
    const paragraphs = [];
    
    // 添加标题
    paragraphs.push(
      new Paragraph({
        text: resume.name,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );
    
    // 如果有目标职位，添加到Word文档
    if (resume.targetPosition) {
      try {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: '目标职位: ', bold: true }),
              new TextRun(resume.targetPosition || '')
            ]
          })
        );
      } catch (e) {
        console.error('添加目标职位段落时出错:', e);
      }
    }
    
    // 如果有目标工作，添加到Word文档
    if (resume.targetJob) {
      try {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: '目标工作: ', bold: true }),
              new TextRun(resume.targetJob || '')
            ]
          })
        );
      } catch (e) {
        console.error('添加目标工作段落时出错:', e);
      }
    }
    
    // 添加空行
    paragraphs.push(new Paragraph(''));
    
    console.log('开始添加简历内容到Word文档');
    console.log(`段落数组初始长度: ${paragraphs.length}`);
    
    // 添加格式化后的简历内容
    const contentLines = formattedContent.split('\n');
    console.log(`内容行数: ${contentLines.length}`);
    
    for (let i = 0; i < contentLines.length; i++) {
      try {
        const line = contentLines[i] || '';
        console.log(`处理第${i}行: "${line}"`); // 详细记录每行内容
        
        // 检查是否为标题行（以冒号结尾且不包含其他冒号）
        if (line.endsWith(':') && line.indexOf(':') === line.length - 1) {
          console.log(`第${i}行被识别为标题行`); 
          paragraphs.push(new Paragraph({
            text: line,
            heading: HeadingLevel.HEADING_2
          }));
        } else if (line.includes(': ')) {
          // 处理键值对行
          const [key, value] = line.split(': ', 2);
          console.log(`第${i}行被识别为键值对: 键="${key || ''}", 值="${value || ''}"`); 
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({ text: (key || '') + ': ', bold: true }),
              new TextRun({ text: value || '' }) // 确保value不为undefined
            ]
          }));
        } else if (line.trim() !== '') {
          // 处理普通文本行
          console.log(`第${i}行被识别为普通文本行`); 
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: line })]
          }));
        } else {
          // 空行
          console.log(`第${i}行被识别为空行`); 
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: '' })]
          }));
        }
      } catch (e) {
        console.error(`处理第${i}行时出错:`, e);
        // 添加一个错误提示段落
        try {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: '处理内容时出错', color: 'FF0000' })]
          }));
        } catch (innerError) {
          console.error('添加错误提示段落失败:', innerError);
        }
      }
    }
    
    // 添加页脚
    paragraphs.push(
      new Paragraph({
        text: '由JobTrip生成',
        alignment: AlignmentType.CENTER,
      })
    );
    
    // 过滤掉null值并添加段落到文档
    const filteredParagraphs = paragraphs.filter(p => p !== null && p !== undefined);
    console.log(`过滤后的段落数: ${filteredParagraphs.length}`);
    
    // 检查段落内容
    if (filteredParagraphs && filteredParagraphs.length > 0) {
      filteredParagraphs.forEach((para, index) => {
        if (para) {
          try {
            console.log(`段落 ${index}: 类型=${para.constructor ? para.constructor.name : 'unknown'}, 内容=${JSON.stringify(para).substring(0, 100)}...`);
          } catch (e) {
            console.error(`无法记录段落 ${index} 的内容:`, e);
          }
        } else {
          console.log(`段落 ${index}: 无效段落(null或undefined)`);
        }
      });
    } else {
      console.log('没有有效的段落可以检查');
    }
    
    // 创建包含所有段落的文档
    try {
      // 确保有有效的段落可以添加
      if (filteredParagraphs && filteredParagraphs.length > 0) {
        doc = new Document({
          title: resume.name,
          description: '由JobTrip生成的简历',
          creator: req.user?.firstName || 'JobTrip用户',
          sections: [{
            children: filteredParagraphs,
          }],
        });
        console.log('成功创建包含段落的文档');
      } else {
        throw new Error('没有有效的段落可以添加');
      }
    } catch (error) {
      console.error('创建文档时出错:', error);
      
      // 尝试逐个添加段落，跳过有问题的段落
      console.log('尝试逐个添加段落...');
      const validParagraphs = [];
      
      if (filteredParagraphs && filteredParagraphs.length > 0) {
        for (let i = 0; i < filteredParagraphs.length; i++) {
          try {
            // 验证段落是否为有效的Paragraph对象
            if (filteredParagraphs[i] && filteredParagraphs[i] instanceof Paragraph) {
              validParagraphs.push(filteredParagraphs[i]);
            } else {
              console.log(`跳过无效段落 ${i}`);
            }
          } catch (e) {
            console.error(`段落 ${i} 验证失败:`, e);
          }
        }
      }
      
      console.log(`有效段落数: ${validParagraphs.length}`);

      // 如果有有效段落，创建文档
      if (validParagraphs.length > 0) {
        doc = new Document({
          title: resume.name,
          description: '由JobTrip生成的简历',
          creator: req.user?.firstName || 'JobTrip用户',
          sections: [{
            children: validParagraphs,
          }],
        });
      } else {
        // 如果没有有效段落，创建默认文档
        doc = new Document({
          title: resume.name,
          description: '由JobTrip生成的简历',
          creator: req.user?.firstName || 'JobTrip用户',
          sections: [{
            children: [new Paragraph({ text: '简历内容解析失败，请检查格式。' })],
          }],
        });
      }
    }
    
    console.log('文档段落添加完成');
    
    console.log(`Word文档创建完成，段落数: ${paragraphs.length}`);
    
    // 生成Word文档
    let buffer;
    try {
      buffer = await Packer.toBuffer(doc);
      console.log(`Word文档打包完成，大小: ${buffer.length} 字节`);
    } catch (packError) {
      console.error('生成Word文档缓冲区时出错:', packError);
      return next(new AppError(`生成Word文档失败: ${(packError as Error).message}`, 500));
    }
    
    // 确保buffer有效
    if (!buffer || buffer.length === 0) {
      console.error('生成的Word文档缓冲区无效或为空');
      return next(new AppError('生成的Word文档无效，请重试', 500));
    }
    
    // 设置响应头
    try {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      // 确保文件名使用双引号包裹，避免某些浏览器解析问题
      const safeFileName = resume.name ? encodeURIComponent(resume.name) : '简历';
      res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}.docx"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      console.log(`设置文件名: ${safeFileName}.docx`);
    } catch (headerError) {
      console.error('设置响应头时出错:', headerError);
      return next(new AppError(`设置下载头信息失败: ${(headerError as Error).message}`, 500));
    }
    
    console.log('响应头设置完成，准备发送Word文档');
    console.log(`文档大小: ${buffer.length} 字节`);
    
    // 发送Word文档
    try {
      res.send(buffer);
      console.log('Word文档发送成功');
    } catch (sendError) {
      console.error('发送Word文档时出错:', sendError);
      return next(new AppError(`发送Word文档失败: ${(sendError as Error).message}`, 500));
    }
  } catch (error) {
    console.error('Word文档生成错误:', error);
    next(new AppError(`简历下载失败: ${(error as Error).message}`, 500));
  }
};