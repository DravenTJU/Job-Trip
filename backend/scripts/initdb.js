#!/usr/bin/env node

// MongoDB初始化数据库脚本
// 用于创建数据库、集合、索引，并填充测试数据
// 用法: node initdb.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/jobtrip';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0];

// 连接到MongoDB
async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🔌 成功连接到MongoDB');
    return client;
  } catch (error) {
    console.error('❌ 连接MongoDB失败:', error);
    process.exit(1);
  }
}

// 创建集合和索引
async function setupCollections(db) {
  try {
    console.log('📦 开始创建集合和索引');

    // 1. 用户集合
    await db.createCollection('users');
    await db.collection('users').createIndexes([
      { key: { email: 1 }, name: 'email_index', unique: true },
      { key: { username: 1 }, name: 'username_index', unique: true }
    ]);
    console.log('✅ 用户集合和索引创建成功');

    // 2. 职位集合
    await db.createCollection('jobs');
    await db.collection('jobs').createIndexes([
      { key: { sourceId: 1, platform: 1 }, name: 'sourceId_platform_index', unique: true },
      { key: { company: 1 }, name: 'company_index' },
      { key: { title: 1 }, name: 'title_index' },
      { key: { createdAt: 1 }, name: 'createdAt_index' },
      { key: { platform: 1 }, name: 'platform_index' }
    ]);
    console.log('✅ 职位集合和索引创建成功');

    // 3. 用户-职位关联集合
    await db.createCollection('user_jobs');
    await db.collection('user_jobs').createIndexes([
      { key: { userId: 1, jobId: 1 }, name: 'userId_jobId_index', unique: true },
      { key: { userId: 1, status: 1 }, name: 'userId_status_index' },
      { key: { userId: 1, isFavorite: 1 }, name: 'userId_isFavorite_index' },
      { key: { jobId: 1 }, name: 'jobId_index' },
      { key: { createdAt: 1 }, name: 'createdAt_index' }
    ]);
    console.log('✅ 用户-职位关联集合和索引创建成功');

    // 4. 申请历史集合
    await db.createCollection('application_history');
    await db.collection('application_history').createIndexes([
      { key: { userJobId: 1 }, name: 'userJobId_index' },
      { key: { createdAt: 1 }, name: 'createdAt_index' }
    ]);
    console.log('✅ 申请历史集合和索引创建成功');

    // 5. 公司集合
    await db.createCollection('companies');
    await db.collection('companies').createIndexes([
      { key: { name: 1 }, name: 'name_index', unique: true },
      { key: { industry: 1 }, name: 'industry_index' }
    ]);
    console.log('✅ 公司集合和索引创建成功');

    // 6. 用户档案集合
    await db.createCollection('user_profiles');
    await db.collection('user_profiles').createIndexes([
      { key: { userId: 1 }, name: 'userId_index', unique: true },
      { key: { 'skills.name': 1 }, name: 'skills_name_index' },
      { key: { 'workExperiences.company': 1 }, name: 'workExperiences_company_index' },
      { key: { 'educations.institution': 1 }, name: 'educations_institution_index' },
      { key: { lastUpdated: 1 }, name: 'lastUpdated_index' },
      { key: { createdAt: 1 }, name: 'createdAt_index' }
    ]);
    console.log('✅ 用户档案集合和索引创建成功');

    // 7. 简历集合
    await db.createCollection('resumes');
    await db.collection('resumes').createIndexes([
      { key: { userId: 1 }, name: 'userId_index' },
      { key: { createdAt: 1 }, name: 'createdAt_index' },
      { key: { name: 1 }, name: 'name_index' }
    ]);
    console.log('✅ 简历集合和索引创建成功');

  } catch (error) {
    console.error('❌ 创建集合和索引失败:', error);
    throw error;
  }
}

// 生成测试数据
async function insertTestData(db) {
  try {
    console.log('📝 开始生成测试数据');
    
    // 1. 添加测试用户
    const hashedPassword = await bcrypt.hash('404notfound', 10);
    const testUsers = [
      {
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en-US'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'zh-CN'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'wangminghui',
        email: 'wang.minghui@example.com',
        password: hashedPassword,
        preferences: {
          theme: 'auto',
          notifications: true,
          language: 'zh-TW'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const userResult = await db.collection('users').insertMany(testUsers);
    console.log(`✅ 已插入 ${userResult.insertedCount} 个测试用户`);
    
    // 2. 添加测试公司
    const testCompanies = [
      {
        name: '科技云创有限公司',
        website: 'https://techcloud.example.com',
        industry: '信息技术',
        size: 'medium',
        location: '奥克兰, 新西兰',
        description: '领先的云计算服务提供商，专注于为企业提供高效、安全的云解决方案。',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '新创数字科技',
        website: 'https://newdigital.example.com',
        industry: '软件开发',
        size: 'small',
        location: '惠灵顿, 新西兰',
        description: '创新的软件开发公司，专注于移动应用和网络应用开发。',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '全球金融集团',
        website: 'https://globalfinance.example.com',
        industry: '金融服务',
        size: 'large',
        location: '奥克兰, 新西兰',
        description: '国际金融服务企业，提供全面的金融解决方案。',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TechCloud Solutions',
        website: 'https://techcloudsolutions.example.com',
        industry: 'Information Technology',
        size: 'medium',
        location: 'Auckland, New Zealand',
        description: 'Leading cloud computing service provider focused on delivering efficient and secure cloud solutions for enterprises.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Digital Innovations Ltd.',
        website: 'https://digitalinnovations.example.com',
        industry: 'Software Development',
        size: 'small',
        location: 'Wellington, New Zealand',
        description: 'Innovative software development company specializing in mobile and web application development.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Global Finance Group',
        website: 'https://globalfinancegroup.example.com',
        industry: 'Financial Services',
        size: 'large',
        location: 'Auckland, New Zealand',
        description: 'International financial services enterprise providing comprehensive financial solutions.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '雲端數位科技股份有限公司',
        website: 'https://cloudtech.example.com',
        industry: '資訊科技',
        size: 'medium',
        location: '奧克蘭, 紐西蘭',
        description: '領先的雲端運算服務供應商，專注於為企業提供高效、安全的雲端解決方案。',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '創新數位科技有限公司',
        website: 'https://innovativetech.example.com',
        industry: '軟體開發',
        size: 'small',
        location: '惠靈頓, 紐西蘭',
        description: '創新的軟體開發公司，專注於移動應用和網路應用開發。',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '環球金融集團',
        website: 'https://globalfinancegroup.example.com',
        industry: '金融服務',
        size: 'large',
        location: '奧克蘭, 紐西蘭',
        description: '國際金融服務企業，提供全面的金融解決方案。',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const companyResult = await db.collection('companies').insertMany(testCompanies);
    console.log(`✅ 已插入 ${companyResult.insertedCount} 个测试公司`);
    
    // 3. 添加测试职位
    const testJobs = [
      // 简体中文职位 (zh-CN)
      {
        platform: 'linkedin',
        title: '资深前端开发工程师',
        company: '科技云创有限公司',
        location: '奥克兰, 新西兰',
        description: '我们正在寻找一位资深前端开发工程师加入我们的团队。该职位需要精通React、Vue等前端框架，具有良好的团队协作能力。',
        requirements: [
          '5年以上前端开发经验',
          '精通React、Vue等前端框架',
          '熟悉HTML5、CSS3、JavaScript(ES6+)',
          '有响应式设计和移动端开发经验',
          '良好的英语沟通能力'
        ],
        salary: '100k-130k NZD',
        jobType: 'full-time',
        source: 'linkedin',
        sourceId: 'linkedin-job-123',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-123',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: '需要尽快填补这个职位',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-CN'
      },
      {
        platform: 'seek',
        title: '后端开发工程师',
        company: '新创数字科技',
        location: '惠灵顿, 新西兰',
        description: '我们需要一位有经验的后端开发工程师，负责开发和维护我们的API服务。该职位需要精通Node.js和MongoDB。',
        requirements: [
          '3年以上后端开发经验',
          '精通Node.js和Express.js',
          '熟悉MongoDB、Redis等数据库',
          '了解微服务架构',
          '有良好的代码质量意识'
        ],
        salary: '90k-120k NZD',
        jobType: 'full-time',
        source: 'seek',
        sourceId: 'seek-job-456',
        sourceUrl: 'https://seek.com/jobs/seek-job-456',
        deadline: new Date(new Date().setDate(new Date().getDate() + 15)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-CN'
      },
      {
        platform: 'indeed',
        title: '数据分析师',
        company: '全球金融集团',
        location: '奥克兰, 新西兰',
        description: '我们正在寻找一位数据分析师加入我们的团队，负责分析金融数据和生成报告。要求具有良好的统计学知识和数据可视化能力。',
        requirements: [
          '统计学或相关专业学士以上学位',
          '2年以上数据分析经验',
          '熟悉SQL、Python或R',
          '熟悉Tableau、Power BI等数据可视化工具',
          '金融行业经验优先'
        ],
        salary: '85k-105k NZD',
        jobType: 'full-time',
        source: 'indeed',
        sourceId: 'indeed-job-789',
        sourceUrl: 'https://indeed.com/jobs/indeed-job-789',
        deadline: new Date(new Date().setDate(new Date().getDate() + 20)),
        notes: '需要有金融行业背景',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-CN'
      },
      {
        platform: 'seek',
        title: 'UI/UX设计师',
        company: '新创数字科技',
        location: '惠灵顿, 新西兰',
        description: '我们需要一位有创意的UI/UX设计师加入我们的团队，负责设计用户界面和优化用户体验。',
        requirements: [
          '3年以上UI/UX设计经验',
          '精通Figma、Sketch等设计工具',
          '有良好的设计感和创意思维',
          '能够理解用户需求并转化为设计',
          '有移动应用设计经验'
        ],
        salary: '80k-100k NZD',
        jobType: 'full-time',
        source: 'seek',
        sourceId: 'seek-job-101',
        sourceUrl: 'https://seek.com/jobs/seek-job-101',
        deadline: new Date(new Date().setDate(new Date().getDate() + 25)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-CN'
      },
      {
        platform: 'linkedin',
        title: '项目经理',
        company: '科技云创有限公司',
        location: '奥克兰, 新西兰',
        description: '我们需要一位经验丰富的项目经理来领导我们的软件开发项目，确保项目按时、按质、按预算完成。',
        requirements: [
          '5年以上软件项目管理经验',
          'PMP认证优先',
          '精通敏捷开发方法',
          '具有出色的沟通和领导能力',
          '有良好的风险管理和问题解决能力'
        ],
        salary: '120k-150k NZD',
        jobType: 'full-time',
        source: 'linkedin',
        sourceId: 'linkedin-job-202',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-202',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: '高优先级职位',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-CN'
      },
      
      // 英文职位 (en-US)
      {
        platform: 'linkedin',
        title: 'Senior Frontend Developer',
        company: 'TechCloud Solutions',
        location: 'Auckland, New Zealand',
        description: 'We are looking for a Senior Frontend Developer to join our team. This position requires expertise in React, Vue and other frontend frameworks, with excellent teamwork skills.',
        requirements: [
          'More than 5 years of frontend development experience',
          'Proficiency in React, Vue and other frontend frameworks',
          'Experience with HTML5, CSS3, JavaScript(ES6+)',
          'Experience with responsive design and mobile development',
          'Excellent communication skills'
        ],
        salary: '100k-130k NZD',
        jobType: 'full-time',
        source: 'linkedin',
        sourceId: 'linkedin-job-en-123',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-en-123',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: 'Need to fill this position quickly',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'en-US'
      },
      {
        platform: 'seek',
        title: 'Backend Developer',
        company: 'Digital Innovations Ltd.',
        location: 'Wellington, New Zealand',
        description: 'We need an experienced Backend Developer to develop and maintain our API services. This position requires expertise in Node.js and MongoDB.',
        requirements: [
          'More than 3 years of backend development experience',
          'Proficiency in Node.js and Express.js',
          'Experience with MongoDB, Redis and other databases',
          'Understanding of microservice architecture',
          'Strong code quality awareness'
        ],
        salary: '90k-120k NZD',
        jobType: 'full-time',
        source: 'seek',
        sourceId: 'seek-job-en-456',
        sourceUrl: 'https://seek.com/jobs/seek-job-en-456',
        deadline: new Date(new Date().setDate(new Date().getDate() + 15)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'en-US'
      },
      {
        platform: 'indeed',
        title: 'Data Analyst',
        company: 'Global Finance Group',
        location: 'Auckland, New Zealand',
        description: 'We are looking for a Data Analyst to join our team, responsible for analyzing financial data and generating reports. Requires strong statistical knowledge and data visualization skills.',
        requirements: [
          'Bachelor degree or above in Statistics or related fields',
          'More than 2 years of data analysis experience',
          'Familiarity with SQL, Python or R',
          'Experience with Tableau, Power BI and other data visualization tools',
          'Financial industry experience preferred'
        ],
        salary: '85k-105k NZD',
        jobType: 'full-time',
        source: 'indeed',
        sourceId: 'indeed-job-en-789',
        sourceUrl: 'https://indeed.com/jobs/indeed-job-en-789',
        deadline: new Date(new Date().setDate(new Date().getDate() + 20)),
        notes: 'Financial industry background required',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'en-US'
      },
      {
        platform: 'seek',
        title: 'UI/UX Designer',
        company: 'Digital Innovations Ltd.',
        location: 'Wellington, New Zealand',
        description: 'We need a creative UI/UX Designer to join our team, responsible for designing user interfaces and optimizing user experience.',
        requirements: [
          'More than 3 years of UI/UX design experience',
          'Proficiency in Figma, Sketch and other design tools',
          'Good design sense and creative thinking',
          'Ability to understand user needs and translate them into designs',
          'Experience with mobile app design'
        ],
        salary: '80k-100k NZD',
        jobType: 'full-time',
        source: 'seek',
        sourceId: 'seek-job-en-101',
        sourceUrl: 'https://seek.com/jobs/seek-job-en-101',
        deadline: new Date(new Date().setDate(new Date().getDate() + 25)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'en-US'
      },
      {
        platform: 'linkedin',
        title: 'Project Manager',
        company: 'TechCloud Solutions',
        location: 'Auckland, New Zealand',
        description: 'We need an experienced Project Manager to lead our software development projects, ensuring they are completed on time, on quality and on budget.',
        requirements: [
          'More than 5 years of software project management experience',
          'PMP certification preferred',
          'Proficiency in agile development methodologies',
          'Excellent communication and leadership skills',
          'Strong risk management and problem-solving abilities'
        ],
        salary: '120k-150k NZD',
        jobType: 'full-time',
        source: 'linkedin',
        sourceId: 'linkedin-job-en-202',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-en-202',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: 'High priority position',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'en-US'
      },
      
      // 繁体中文职位 (zh-TW)
      {
        platform: 'linkedin',
        title: '資深前端開發工程師',
        company: '雲端數位科技股份有限公司',
        location: '奧克蘭, 紐西蘭',
        description: '我們正在尋找一位資深前端開發工程師加入我們的團隊。該職位需要精通React、Vue等前端框架，具有良好的團隊協作能力。',
        requirements: [
          '5年以上前端開發經驗',
          '精通React、Vue等前端框架',
          '熟悉HTML5、CSS3、JavaScript(ES6+)',
          '有響應式設計和移動端開發經驗',
          '良好的英語溝通能力'
        ],
        salary: '100k-130k NZD',
        jobType: 'full-time',
        source: 'linkedin',
        sourceId: 'linkedin-job-tw-123',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-tw-123',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: '需要盡快填補這個職位',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-TW'
      },
      {
        platform: 'seek',
        title: '後端開發工程師',
        company: '創新數位科技有限公司',
        location: '惠靈頓, 紐西蘭',
        description: '我們需要一位有經驗的後端開發工程師，負責開發和維護我們的API服務。該職位需要精通Node.js和MongoDB。',
        requirements: [
          '3年以上後端開發經驗',
          '精通Node.js和Express.js',
          '熟悉MongoDB、Redis等數據庫',
          '了解微服務架構',
          '有良好的代碼質量意識'
        ],
        salary: '90k-120k NZD',
        jobType: 'full-time',
        source: 'seek',
        sourceId: 'seek-job-tw-456',
        sourceUrl: 'https://seek.com/jobs/seek-job-tw-456',
        deadline: new Date(new Date().setDate(new Date().getDate() + 15)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-TW'
      },
      {
        platform: 'indeed',
        title: '數據分析師',
        company: '環球金融集團',
        location: '奧克蘭, 紐西蘭',
        description: '我們正在尋找一位數據分析師加入我們的團隊，負責分析金融數據和生成報告。要求具有良好的統計學知識和數據可視化能力。',
        requirements: [
          '統計學或相關專業學士以上學位',
          '2年以上數據分析經驗',
          '熟悉SQL、Python或R',
          '熟悉Tableau、Power BI等數據可視化工具',
          '金融行業經驗優先'
        ],
        salary: '85k-105k NZD',
        jobType: 'full-time',
        source: 'indeed',
        sourceId: 'indeed-job-tw-789',
        sourceUrl: 'https://indeed.com/jobs/indeed-job-tw-789',
        deadline: new Date(new Date().setDate(new Date().getDate() + 20)),
        notes: '需要有金融行業背景',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-TW'
      },
      {
        platform: 'seek',
        title: 'UI/UX設計師',
        company: '創新數位科技有限公司',
        location: '惠靈頓, 紐西蘭',
        description: '我們需要一位有創意的UI/UX設計師加入我們的團隊，負責設計用戶界面和優化用戶體驗。',
        requirements: [
          '3年以上UI/UX設計經驗',
          '精通Figma、Sketch等設計工具',
          '有良好的設計感和創意思維',
          '能夠理解用戶需求並轉化為設計',
          '有移動應用設計經驗'
        ],
        salary: '80k-100k NZD',
        jobType: 'full-time',
        source: 'seek',
        sourceId: 'seek-job-tw-101',
        sourceUrl: 'https://seek.com/jobs/seek-job-tw-101',
        deadline: new Date(new Date().setDate(new Date().getDate() + 25)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-TW'
      },
      {
        platform: 'linkedin',
        title: '專案經理',
        company: '雲端數位科技股份有限公司',
        location: '奧克蘭, 紐西蘭',
        description: '我們需要一位經驗豐富的專案經理來領導我們的軟體開發專案，確保專案按時、按質、按預算完成。',
        requirements: [
          '5年以上軟體專案管理經驗',
          'PMP認證優先',
          '精通敏捷開發方法',
          '具有出色的溝通和領導能力',
          '有良好的風險管理和問題解決能力'
        ],
        salary: '120k-150k NZD',
        jobType: 'full-time',
        source: 'linkedin',
        sourceId: 'linkedin-job-tw-202',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-tw-202',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: '高優先級職位',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: 'zh-TW'
      }
    ];
    
    const jobResult = await db.collection('jobs').insertMany(testJobs);
    console.log(`✅ 已插入 ${jobResult.insertedCount} 个测试职位`);
    
    // 4. 添加用户-职位关联
    const users = await db.collection('users').find({}).toArray();
    const jobs = await db.collection('jobs').find({}).toArray();
    
    // 获取各种语言的职位
    const enJobs = jobs.filter(job => job.language === 'en-US');
    const zhCNJobs = jobs.filter(job => job.language === 'zh-CN');
    const zhTWJobs = jobs.filter(job => job.language === 'zh-TW');
    
    const userJobs = [
      // 英语用户 (John Doe) 与英文职位的关联
      {
        userId: users[0]._id,
        jobId: enJobs[0]._id,  // Senior Frontend Developer
        status: 'applied',
        isFavorite: true,
        customTags: ['Key Company', 'Tech Match'],
        notes: 'Submitted resume on May 15, 2023, waiting for response',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        updatedAt: new Date()
      },
      {
        userId: users[0]._id,
        jobId: enJobs[1]._id,  // Backend Developer
        status: 'interviewing',
        isFavorite: true,
        customTags: ['Good Prospect'],
        notes: 'Video interview scheduled',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedAt: new Date()
      },
      {
        userId: users[0]._id,
        jobId: enJobs[2]._id,  // Data Analyst
        status: 'new',
        isFavorite: false,
        customTags: [],
        notes: 'Need to prepare resume',
        reminderDate: null,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        updatedAt: new Date()
      },
      
      // 简体中文用户 (testuser) 与中文职位的关联
      {
        userId: users[1]._id,
        jobId: zhCNJobs[3]._id,  // UI/UX设计师
        status: 'applied',
        isFavorite: true,
        customTags: ['梦想公司'],
        notes: '已申请，希望能得到面试机会',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        updatedAt: new Date()
      },
      {
        userId: users[1]._id,
        jobId: zhCNJobs[4]._id,  // 项目经理
        status: 'rejected',
        isFavorite: false,
        customTags: [],
        notes: '未通过初筛，需要提升简历',
        reminderDate: null,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedAt: new Date()
      },
      {
        userId: users[1]._id,
        jobId: zhCNJobs[0]._id,  // 资深前端开发工程师
        status: 'new',
        isFavorite: true,
        customTags: ['技能匹配'],
        notes: '需要准备针对性简历',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        updatedAt: new Date()
      },
      
      // 繁体中文用户 (wangminghui) 与繁体中文职位的关联
      {
        userId: users[2]._id,
        jobId: zhTWJobs[0]._id,  // 資深前端開發工程師
        status: 'interviewing',
        isFavorite: true,
        customTags: ['理想職位', '技術匹配'],
        notes: '已完成第一輪面試，等待二輪技術面試',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 8)),
        updatedAt: new Date()
      },
      {
        userId: users[2]._id,
        jobId: zhTWJobs[4]._id,  // 專案經理
        status: 'applied',
        isFavorite: true,
        customTags: ['管理崗位'],
        notes: '已提交申請，附帶專案經驗說明',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 6)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
        updatedAt: new Date()
      },
      {
        userId: users[2]._id,
        jobId: zhTWJobs[2]._id,  // 數據分析師
        status: 'new',
        isFavorite: false,
        customTags: ['次要選擇'],
        notes: '考慮是否提交申請',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 10)),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const userJobResult = await db.collection('user_jobs').insertMany(userJobs);
    console.log(`✅ 已插入 ${userJobResult.insertedCount} 个测试用户-职位关联`);
    
    // 5. 添加申请历史
    const userJobsData = await db.collection('user_jobs').find({}).toArray();
    
    const applicationHistory = [
      // 英文用户的申请历史
      {
        userJobId: userJobsData[0]._id, // John Doe - Senior Frontend Developer
        previousStatus: 'new',
        newStatus: 'applied',
        notes: 'Submitted resume and cover letter',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        updatedBy: users[0]._id
      },
      {
        userJobId: userJobsData[1]._id, // John Doe - Backend Developer
        previousStatus: 'new',
        newStatus: 'applied',
        notes: 'Applied through LinkedIn Easy Apply',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedBy: users[0]._id
      },
      {
        userJobId: userJobsData[1]._id, // John Doe - Backend Developer
        previousStatus: 'applied',
        newStatus: 'interviewing',
        notes: 'Received interview invitation, scheduled for next Monday',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        updatedBy: users[0]._id
      },
      
      // 简体中文用户的申请历史
      {
        userJobId: userJobsData[3]._id, // testuser - UI/UX设计师
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '提交了申请',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        updatedBy: users[1]._id
      },
      {
        userJobId: userJobsData[4]._id, // testuser - 项目经理
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '提交了申请',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedBy: users[1]._id
      },
      {
        userJobId: userJobsData[4]._id, // testuser - 项目经理
        previousStatus: 'applied',
        newStatus: 'rejected',
        notes: '收到拒绝邮件，理由是经验不足',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedBy: users[1]._id
      },
      
      // 繁体中文用户的申请历史
      {
        userJobId: userJobsData[6]._id, // wangminghui - 資深前端開發工程師
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '提交了量身定制的履歷和求職信',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 8)),
        updatedBy: users[2]._id
      },
      {
        userJobId: userJobsData[6]._id, // wangminghui - 資深前端開發工程師
        previousStatus: 'applied',
        newStatus: 'interviewing',
        notes: '通過初步篩選，獲邀參加第一輪視訊面試',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        updatedBy: users[2]._id
      },
      {
        userJobId: userJobsData[7]._id, // wangminghui - 專案經理
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '提交申請並附上專案管理經驗摘要',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
        updatedBy: users[2]._id
      }
    ];
    
    const historyResult = await db.collection('application_history').insertMany(applicationHistory);
    console.log(`✅ 已插入 ${historyResult.insertedCount} 条测试申请历史记录`);

    // 6. 添加用户档案测试数据
    const userProfiles = [
      {
        userId: users[0]._id,
        firstName: "John",
        lastName: "Doe",
        headline: "Senior Frontend Developer",
        biography: "Experienced frontend developer with 5 years of experience building user-friendly web applications.",
        contactInfo: {
          email: "john.doe@example.com",
          phone: "+64 21 123 4567",
          website: "https://johndoe.example.com",
          address: "Auckland, New Zealand",
          socialMedia: {
            linkedin: "https://linkedin.com/in/johndoe",
            github: "https://github.com/johndoe",
            twitter: "https://twitter.com/johndoe"
          }
        },
        educations: [
          {
            _id: new ObjectId(),
            institution: "University of Auckland",
            degree: "Master's",
            field: "Computer Science",
            startDate: new Date("2015-09-01"),
            endDate: new Date("2017-06-30"),
            description: "Focused on Web Development and UI Design",
            location: "Auckland, New Zealand"
          },
          {
            _id: new ObjectId(),
            institution: "Stanford University",
            degree: "Bachelor's",
            field: "Software Engineering",
            startDate: new Date("2011-09-01"),
            endDate: new Date("2015-06-30"),
            description: "Software Engineering, GPA 3.8/4.0",
            location: "California, USA"
          }
        ],
        workExperiences: [
          {
            _id: new ObjectId(),
            company: "TechCloud Solutions",
            position: "Senior Frontend Developer",
            startDate: new Date("2020-03-01"),
            endDate: null,
            current: true,
            description: "Responsible for frontend architecture design and development of company's main products, optimizing user experience and performance.",
            location: "Auckland, New Zealand",
            achievements: [
              "Reduced website loading time by 50%",
              "Implemented responsive design supporting all device types",
              "Introduced component library and automated testing processes"
            ]
          },
          {
            _id: new ObjectId(),
            company: "Digital Tech Ltd.",
            position: "Frontend Developer",
            startDate: new Date("2017-07-01"),
            endDate: new Date("2020-02-28"),
            current: false,
            description: "Responsible for frontend development of the company's e-commerce platform using React and Redux.",
            location: "Auckland, New Zealand",
            achievements: [
              "Developed 5 major feature modules",
              "Participated in refactoring the frontend code architecture, improving code quality",
              "Implemented A/B testing system, improving conversion rate by 15%"
            ]
          }
        ],
        skills: [
          {
            _id: new ObjectId(),
            name: "React",
            level: "expert",
            endorsements: 12,
            category: "Frontend Framework"
          },
          {
            _id: new ObjectId(),
            name: "Vue.js",
            level: "advanced",
            endorsements: 8,
            category: "Frontend Framework"
          },
          {
            _id: new ObjectId(),
            name: "JavaScript",
            level: "expert",
            endorsements: 15,
            category: "Programming Language"
          },
          {
            _id: new ObjectId(),
            name: "TypeScript",
            level: "advanced",
            endorsements: 10,
            category: "Programming Language"
          }
        ],
        certifications: [
          {
            _id: new ObjectId(),
            name: "AWS Certified Developer - Associate",
            issuer: "Amazon Web Services",
            issueDate: new Date("2019-05-15"),
            expirationDate: new Date("2022-05-15"),
            credentialId: "AWS-DEV-123456",
            credentialUrl: "https://aws.amazon.com/verification"
          }
        ],
        projects: [
          {
            _id: new ObjectId(),
            name: "E-commerce Platform Refactoring",
            description: "Refactored the company's e-commerce platform using React and Node.js to improve user experience and performance.",
            startDate: new Date("2019-03-01"),
            endDate: new Date("2019-09-30"),
            url: "https://example-ecommerce.com",
            technologies: ["React", "Node.js", "MongoDB", "Redis"]
          }
        ],
        languages: [
          {
            _id: new ObjectId(),
            language: "English",
            proficiency: "native"
          },
          {
            _id: new ObjectId(),
            language: "Spanish",
            proficiency: "intermediate"
          }
        ],
        volunteerExperiences: [
          {
            _id: new ObjectId(),
            organization: "Code Education Association",
            role: "Volunteer Instructor",
            startDate: new Date("2018-01-01"),
            endDate: new Date("2019-12-31"),
            description: "Taught programming basics to youth, organized 10 workshops."
          }
        ],
        honorsAwards: [
          {
            _id: new ObjectId(),
            title: "Employee of the Year",
            issuer: "Digital Tech Ltd.",
            date: new Date("2019-12-15"),
            description: "Awarded for outstanding performance and team contribution"
          }
        ],
        recommendations: [
          {
            _id: new ObjectId(),
            recommenderName: "Michael Smith",
            recommenderTitle: "Technical Director",
            relationship: "Direct Manager",
            content: "John is an exceptional developer with outstanding technical skills and problem-solving approach. He played a crucial role in our team, and I highly recommend him.",
            date: new Date("2020-02-20")
          }
        ],
        profileCompleteness: 85,
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[1]._id,
        firstName: "四",
        lastName: "李",
        headline: "UI/UX设计师",
        biography: "创意型UI/UX设计师，热衷于创造美观且用户友好的界面。",
        contactInfo: {
          email: "test2@example.com",
          phone: "+64 21 987 6543",
          website: "https://janesmith.example.com",
          address: "惠灵顿, 新西兰"
        },
        educations: [
          {
            _id: new ObjectId(),
            institution: "维多利亚大学惠灵顿分校",
            degree: "学士",
            field: "设计学",
            startDate: new Date("2014-09-01"),
            endDate: new Date("2018-06-30"),
            description: "专注于用户界面设计和用户体验研究",
            location: "惠灵顿, 新西兰"
          }
        ],
        workExperiences: [
          {
            _id: new ObjectId(),
            company: "新创数字科技",
            position: "UI/UX设计师",
            startDate: new Date("2018-07-01"),
            endDate: null,
            current: true,
            description: "负责公司产品的用户界面设计和用户体验优化。",
            location: "惠灵顿, 新西兰",
            achievements: [
              "重新设计了公司主要产品界面，提高用户满意度25%",
              "建立了公司设计系统，提高了开发效率",
              "领导了3个主要产品的设计过程"
            ]
          }
        ],
        skills: [
          {
            _id: new ObjectId(),
            name: "Figma",
            level: "expert",
            endorsements: 10,
            category: "设计工具"
          },
          {
            _id: new ObjectId(),
            name: "Adobe Photoshop",
            level: "advanced",
            endorsements: 8,
            category: "设计工具"
          },
          {
            _id: new ObjectId(),
            name: "用户研究",
            level: "intermediate",
            endorsements: 5,
            category: "软技能"
          }
        ],
        profileCompleteness: 65,
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[2]._id,
        firstName: "明輝",
        lastName: "王",
        headline: "資深全端開發工程師",
        biography: "擁有8年全端開發經驗，專注於構建高效能、可擴展的企業級應用程式。",
        contactInfo: {
          email: "wang.minghui@example.com",
          phone: "+64 22 567 8901",
          website: "https://wangminghui.example.com",
          address: "奧克蘭, 紐西蘭",
          socialMedia: {
            linkedin: "https://linkedin.com/in/wangminghui",
            github: "https://github.com/wangminghui",
            twitter: "https://twitter.com/wangminghui"
          }
        },
        educations: [
          {
            _id: new ObjectId(),
            institution: "國立臺灣大學",
            degree: "碩士",
            field: "資訊工程",
            startDate: new Date("2012-09-01"),
            endDate: new Date("2014-06-30"),
            description: "專注於分佈式系統和雲計算研究",
            location: "臺北, 臺灣"
          },
          {
            _id: new ObjectId(),
            institution: "國立清華大學",
            degree: "學士",
            field: "資訊工程",
            startDate: new Date("2008-09-01"),
            endDate: new Date("2012-06-30"),
            description: "主修軟體工程，副修人工智能，GPA 3.9/4.0",
            location: "新竹, 臺灣"
          }
        ],
        workExperiences: [
          {
            _id: new ObjectId(),
            company: "雲端數位科技",
            position: "技術主管",
            startDate: new Date("2019-04-01"),
            endDate: null,
            current: true,
            description: "領導開發團隊構建企業級雲平台，制定技術策略和架構決策。",
            location: "奧克蘭, 紐西蘭",
            achievements: [
              "建立了微服務架構，提高了系統可擴展性和彈性",
              "實施了DevOps流程，將部署時間縮短90%",
              "優化數據處理管道，提高處理效率60%"
            ]
          },
          {
            _id: new ObjectId(),
            company: "創新網路科技公司",
            position: "高級全端開發工程師",
            startDate: new Date("2014-07-01"),
            endDate: new Date("2019-03-31"),
            current: false,
            description: "負責企業資源管理系統的全端開發，設計和實現核心功能模塊。",
            location: "臺北, 臺灣",
            achievements: [
              "開發了7個關鍵業務模塊",
              "設計了高效的數據庫結構，提升查詢速度40%",
              "構建了可重用的前端元件庫，提高開發效率25%"
            ]
          }
        ],
        skills: [
          {
            _id: new ObjectId(),
            name: "Java",
            level: "expert",
            endorsements: 18,
            category: "程式語言"
          },
          {
            _id: new ObjectId(),
            name: "Spring Boot",
            level: "expert",
            endorsements: 15,
            category: "後端框架"
          },
          {
            _id: new ObjectId(),
            name: "React",
            level: "advanced",
            endorsements: 12,
            category: "前端框架"
          },
          {
            _id: new ObjectId(),
            name: "AWS",
            level: "expert",
            endorsements: 14,
            category: "雲服務"
          },
          {
            _id: new ObjectId(),
            name: "Kubernetes",
            level: "advanced",
            endorsements: 10,
            category: "容器調度"
          }
        ],
        certifications: [
          {
            _id: new ObjectId(),
            name: "AWS 解決方案架構師 - 專業級",
            issuer: "Amazon Web Services",
            issueDate: new Date("2020-03-15"),
            expirationDate: new Date("2023-03-15"),
            credentialId: "AWS-SAP-789012",
            credentialUrl: "https://aws.amazon.com/verification"
          },
          {
            _id: new ObjectId(),
            name: "Google 專業數據工程師",
            issuer: "Google Cloud",
            issueDate: new Date("2019-08-10"),
            expirationDate: new Date("2022-08-10"),
            credentialId: "GCP-DE-345678",
            credentialUrl: "https://cloud.google.com/certification/data-engineer"
          }
        ],
        projects: [
          {
            _id: new ObjectId(),
            name: "企業級雲平台",
            description: "設計並實現基於微服務架構的企業雲平台，支持多租戶、彈性擴展和高可用性。",
            startDate: new Date("2020-01-01"),
            endDate: new Date("2021-06-30"),
            url: "https://cloud-platform.example.com",
            technologies: ["Java", "Spring Cloud", "Kubernetes", "React", "PostgreSQL", "Kafka"]
          },
          {
            _id: new ObjectId(),
            name: "數據分析平台",
            description: "構建實時數據處理和分析平台，支持大規模數據集的處理和可視化展示。",
            startDate: new Date("2018-05-01"),
            endDate: new Date("2019-02-28"),
            url: "https://data-analytics.example.com",
            technologies: ["Python", "Apache Spark", "Hadoop", "Elasticsearch", "Grafana"]
          }
        ],
        languages: [
          {
            _id: new ObjectId(),
            language: "繁體中文",
            proficiency: "native"
          },
          {
            _id: new ObjectId(),
            language: "英語",
            proficiency: "advanced"
          },
          {
            _id: new ObjectId(),
            language: "日語",
            proficiency: "intermediate"
          }
        ],
        volunteerExperiences: [
          {
            _id: new ObjectId(),
            organization: "臺灣開源社區",
            role: "技術顧問",
            startDate: new Date("2016-03-01"),
            endDate: new Date("2018-12-31"),
            description: "為開源專案提供技術指導，組織技術講座和工作坊。"
          }
        ],
        honorsAwards: [
          {
            _id: new ObjectId(),
            title: "最佳技術創新獎",
            issuer: "亞太技術創新論壇",
            date: new Date("2018-11-10"),
            description: "因在企業資源管理系統中應用機器學習技術而獲獎"
          }
        ],
        recommendations: [
          {
            _id: new ObjectId(),
            recommenderName: "陳博士",
            recommenderTitle: "技術總監",
            relationship: "前主管",
            content: "王明輝是一位非常出色的技術領導者，他不僅具備深厚的技術功底，還有很強的團隊協作和項目管理能力。他在我們公司期間，成功帶領團隊完成了多個重要項目，為公司業務增長做出了巨大貢獻。",
            date: new Date("2019-03-15")
          }
        ],
        profileCompleteness: 90,
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const profileResult = await db.collection('user_profiles').insertMany(userProfiles);
    console.log(`✅ 已插入 ${profileResult.insertedCount} 个测试用户档案`);

    // 7. 添加简历测试数据
    const resumes = [
      {
        name: "Senior Frontend Developer Resume",
        userId: users[0]._id,
        targetPosition: "Senior Frontend Developer",
        targetJob: "Frontend Development",
        content: JSON.stringify({
          personalInfo: {
            fullName: "John Doe",
            email: "john.doe@example.com",
            phone: "+64 21 123 4567",
            location: "Auckland, New Zealand"
          },
          educations: [
            {
              education: "Master's",
              school: "University of Auckland",
              major: "Computer Science",
              startDate: "2015-09",
              endDate: "2017-06"
            },
            {
              education: "Bachelor's",
              school: "Stanford University",
              major: "Software Engineering",
              startDate: "2011-09",
              endDate: "2015-06"
            }
          ],
          workExperiences: [
            {
              company: "TechCloud Solutions",
              position: "Senior Frontend Developer",
              startDate: "2020-03",
              endDate: "Present",
              responsibilities: "Responsible for frontend architecture design and development of company's main products, optimizing user experience and performance."
            },
            {
              company: "Digital Tech Ltd.",
              position: "Frontend Developer",
              startDate: "2017-07",
              endDate: "2020-02",
              responsibilities: "Responsible for frontend development of the company's e-commerce platform using React and Redux."
            }
          ],
          skills: "React, Vue.js, JavaScript, TypeScript, HTML5, CSS3, Webpack, Git, Jest"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "UI/UX设计师简历",
        userId: users[1]._id,
        targetPosition: "资深UI/UX设计师",
        targetJob: "UI/UX设计",
        content: JSON.stringify({
          personalInfo: {
            fullName: "李四",
            email: "test2@example.com",
            phone: "+64 21 987 6543",
            location: "惠灵顿, 新西兰"
          },
          educations: [
            {
              education: "学士",
              school: "维多利亚大学惠灵顿分校",
              major: "设计学",
              startDate: "2014-09",
              endDate: "2018-06"
            }
          ],
          workExperiences: [
            {
              company: "新创数字科技",
              position: "UI/UX设计师",
              startDate: "2018-07",
              endDate: "至今",
              responsibilities: "负责公司产品的用户界面设计和用户体验优化。"
            }
          ],
          skills: "Figma, Sketch, Adobe Photoshop, Adobe Illustrator, 原型设计, 用户研究, 可用性测试"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "資深全端開發工程師履歷",
        userId: users[2]._id,
        targetPosition: "技術主管",
        targetJob: "全端開發",
        content: JSON.stringify({
          personalInfo: {
            fullName: "王明輝",
            email: "wang.minghui@example.com",
            phone: "+64 22 567 8901",
            location: "奧克蘭, 紐西蘭"
          },
          educations: [
            {
              education: "碩士",
              school: "國立臺灣大學",
              major: "資訊工程",
              startDate: "2012-09",
              endDate: "2014-06"
            },
            {
              education: "學士",
              school: "國立清華大學",
              major: "資訊工程",
              startDate: "2008-09",
              endDate: "2012-06"
            }
          ],
          workExperiences: [
            {
              company: "雲端數位科技",
              position: "技術主管",
              startDate: "2019-04",
              endDate: "至今",
              responsibilities: "領導開發團隊構建企業級雲平台，制定技術策略和架構決策。"
            },
            {
              company: "創新網路科技公司",
              position: "高級全端開發工程師",
              startDate: "2014-07",
              endDate: "2019-03",
              responsibilities: "負責企業資源管理系統的全端開發，設計和實現核心功能模塊。"
            }
          ],
          skills: "Java, Spring Boot, Spring Cloud, React, AWS, Kubernetes, Docker, PostgreSQL, MongoDB, Redis, Kafka"
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const resumeResult = await db.collection('resumes').insertMany(resumes);
    console.log(`✅ 已插入 ${resumeResult.insertedCount} 份测试简历`);

  } catch (error) {
    console.error('❌ 插入测试数据失败:', error);
    throw error;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始初始化MongoDB数据库...');
  console.log(`🔧 开发环境: MongoDB 4.4`);
  console.log(`🌐 连接URI: ${MONGODB_URI}`);
  console.log(`📊 数据库名: ${DB_NAME}`);
  
  let client;

  try {
    client = await connectToMongoDB();
    const db = client.db(DB_NAME);

    // 检查数据库是否已经初始化
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // 如果数据库已有collections，询问是否要重置
    if (collectionNames.length > 0) {
      console.log('⚠️ 数据库已存在以下集合:', collectionNames.join(', '));
      console.log('⚠️ 继续操作将删除这些集合并重新创建。');
      
      // 添加交互式确认步骤
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const confirmation = await new Promise((resolve) => {
        readline.question('是否继续? (y/n): ', (answer) => {
          readline.close();
          resolve(answer.toLowerCase());
        });
      });

      if (confirmation === 'y' || confirmation === 'yes') {
        console.log('🗑️ 正在删除现有集合...');
        for (const name of collectionNames) {
          await db.collection(name).drop();
          console.log(`  - 已删除集合: ${name}`);
        }
      } else {
        console.log('❌ 操作已取消');
        if (client) {
          await client.close();
          console.log('🔌 已关闭数据库连接');
        }
        process.exit(0);
      }
    }

    // 创建集合和索引
    await setupCollections(db);
    
    // 插入测试数据
    await insertTestData(db);

    console.log('✨ 数据库初始化完成!');
    console.log('🔑 测试用户:');
    console.log('  - 用户名: johndoe, 密码: 404notfound');
    console.log('  - 用户名: testuser, 密码: 404notfound');
    console.log('  - 用户名: wangminghui, 密码: 404notfound');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 已关闭数据库连接');
    }
  }
}

// 执行主函数
main(); 