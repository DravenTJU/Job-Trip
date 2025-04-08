import mongoose, { Document } from 'mongoose';
import dotenv from 'dotenv';
import Job, { IJob, JobStatus, JobType } from '../src/models/jobModel';
import UserJob, { IUserJob } from '../src/models/userJobModel';
import { faker } from '@faker-js/faker';

// 加载环境变量
dotenv.config();

const jobTypes = Object.values(JobType);
const platforms = ['seek', 'indeed', 'linkedin', 'manual'];
const statuses = Object.values(JobStatus);
const locations = ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin'];

type JobDocument = Document<unknown, {}, IJob> & IJob & { _id: mongoose.Types.ObjectId };
type UserJobDocument = Document<unknown, {}, IUserJob> & IUserJob & { _id: mongoose.Types.ObjectId };

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobtrip');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Job.deleteMany({});
    await UserJob.deleteMany({});
    console.log('Cleared existing data');

    const jobs: JobDocument[] = [];
    const userJobs: UserJobDocument[] = [];
    const testUserId = '65f2c5d4b5d0b1f9c0f0f0f0'; // Replace with your test user ID

    // Create 48 jobs
    for (let i = 0; i < 48; i++) {
      const salary = `${faker.number.int({ min: 40, max: 200 })}k-${faker.number.int({ min: 40, max: 200 })}k NZD`;
      const postedDate = faker.date.recent({ days: 30 });
      const platform = faker.helpers.arrayElement(platforms);
      const jobType = faker.helpers.arrayElement(jobTypes);
      const status = faker.helpers.arrayElement(statuses);
      
      const job = {
        title: faker.person.jobTitle(),
        company: faker.company.name(),
        location: faker.helpers.arrayElement(locations),
        description: faker.lorem.paragraphs(3),
        jobType: jobType,
        salary: salary,
        applicationUrl: faker.internet.url(),
        platform: platform,
        source: platform,
        sourceId: faker.string.uuid(),
        sourceUrl: faker.internet.url(),
        status: status,
        postedDate: postedDate,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const createdJob = await Job.create(job);
      jobs.push(createdJob);

      // Create corresponding userJob
      const userJob = {
        userId: testUserId,
        jobId: createdJob._id,
        status: status,
        notes: faker.lorem.paragraph(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const createdUserJob = await UserJob.create(userJob);
      userJobs.push(createdUserJob);
    }

    console.log(`Created ${jobs.length} jobs`);
    console.log(`Created ${userJobs.length} user-job associations`);
    console.log('Sample job:', jobs[0]);
    console.log('Sample user-job:', userJobs[0]);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData(); 