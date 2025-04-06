#!/usr/bin/env node

// MongoDB初始化数据库脚本
// 用于创建数据库、集合、索引，并填充测试数据
// 用法: node initdb.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../../.env') });

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
      { key: { status: 1 }, name: 'status_index' },
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
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUsers = [
      {
        username: 'testuser1',
        email: 'test1@example.com',
        password: hashedPassword,
        firstName: '张',
        lastName: '三',
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'zh-CN'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'testuser2',
        email: 'test2@example.com',
        password: hashedPassword,
        firstName: '李',
        lastName: '四',
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'zh-CN'
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
      }
    ];
    
    const companyResult = await db.collection('companies').insertMany(testCompanies);
    console.log(`✅ 已插入 ${companyResult.insertedCount} 个测试公司`);
    
    // 3. 添加测试职位
    const testJobs = [
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
        status: 'new',
        source: 'linkedin',
        sourceId: 'linkedin-job-123',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-123',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: '需要尽快填补这个职位',
        createdAt: new Date(),
        updatedAt: new Date()
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
        status: 'new',
        source: 'seek',
        sourceId: 'seek-job-456',
        sourceUrl: 'https://seek.com/jobs/seek-job-456',
        deadline: new Date(new Date().setDate(new Date().getDate() + 15)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
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
        status: 'new',
        source: 'indeed',
        sourceId: 'indeed-job-789',
        sourceUrl: 'https://indeed.com/jobs/indeed-job-789',
        deadline: new Date(new Date().setDate(new Date().getDate() + 20)),
        notes: '需要有金融行业背景',
        createdAt: new Date(),
        updatedAt: new Date()
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
        status: 'new',
        source: 'seek',
        sourceId: 'seek-job-101',
        sourceUrl: 'https://seek.com/jobs/seek-job-101',
        deadline: new Date(new Date().setDate(new Date().getDate() + 25)),
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
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
        status: 'new',
        source: 'linkedin',
        sourceId: 'linkedin-job-202',
        sourceUrl: 'https://linkedin.com/jobs/view/linkedin-job-202',
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
        notes: '高优先级职位',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const jobResult = await db.collection('jobs').insertMany(testJobs);
    console.log(`✅ 已插入 ${jobResult.insertedCount} 个测试职位`);
    
    // 4. 添加用户-职位关联
    const users = await db.collection('users').find({}).toArray();
    const jobs = await db.collection('jobs').find({}).toArray();
    
    const userJobs = [
      {
        userId: users[0]._id,
        jobId: jobs[0]._id,
        status: 'applied',
        isFavorite: true,
        customTags: ['重点公司', '技术匹配'],
        notes: '已于2023年5月15日提交简历，等待回复',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        updatedAt: new Date()
      },
      {
        userId: users[0]._id,
        jobId: jobs[1]._id,
        status: 'interviewing',
        isFavorite: true,
        customTags: ['前景好'],
        notes: '已安排视频面试',
        reminderDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedAt: new Date()
      },
      {
        userId: users[0]._id,
        jobId: jobs[2]._id,
        status: 'new',
        isFavorite: false,
        customTags: [],
        notes: '需要准备简历',
        reminderDate: null,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        updatedAt: new Date()
      },
      {
        userId: users[1]._id,
        jobId: jobs[3]._id,
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
        jobId: jobs[4]._id,
        status: 'rejected',
        isFavorite: false,
        customTags: [],
        notes: '未通过初筛，需要提升简历',
        reminderDate: null,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedAt: new Date()
      }
    ];
    
    const userJobResult = await db.collection('user_jobs').insertMany(userJobs);
    console.log(`✅ 已插入 ${userJobResult.insertedCount} 个测试用户-职位关联`);
    
    // 5. 添加申请历史
    const userJobsData = await db.collection('user_jobs').find({}).toArray();
    
    const applicationHistory = [
      {
        userJobId: userJobsData[0]._id,
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '提交了简历和求职信',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        updatedBy: users[0]._id
      },
      {
        userJobId: userJobsData[1]._id,
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '通过LinkedIn Easy Apply提交了申请',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedBy: users[0]._id
      },
      {
        userJobId: userJobsData[1]._id,
        previousStatus: 'applied',
        newStatus: 'interviewing',
        notes: '收到面试邀请，安排在下周一',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        updatedBy: users[0]._id
      },
      {
        userJobId: userJobsData[3]._id,
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '提交了申请',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        updatedBy: users[1]._id
      },
      {
        userJobId: userJobsData[4]._id,
        previousStatus: 'new',
        newStatus: 'applied',
        notes: '提交了申请',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedBy: users[1]._id
      },
      {
        userJobId: userJobsData[4]._id,
        previousStatus: 'applied',
        newStatus: 'rejected',
        notes: '收到拒绝邮件，理由是经验不足',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedBy: users[1]._id
      }
    ];
    
    const historyResult = await db.collection('application_history').insertMany(applicationHistory);
    console.log(`✅ 已插入 ${historyResult.insertedCount} 条测试申请历史记录`);

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
      
      // 在这里可以添加交互式确认步骤，但为了自动化脚本，我们默认继续
      console.log('🗑️ 正在删除现有集合...');
      for (const name of collectionNames) {
        await db.collection(name).drop();
        console.log(`  - 已删除集合: ${name}`);
      }
    }

    // 创建集合和索引
    await setupCollections(db);
    
    // 插入测试数据
    await insertTestData(db);

    console.log('✨ 数据库初始化完成!');
    console.log('🔑 测试用户:');
    console.log('  - 用户名: testuser1, 密码: password123');
    console.log('  - 用户名: testuser2, 密码: password123');
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