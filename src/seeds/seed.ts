import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Location } from '../location/entities/location.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';
import { Employer } from '../employer/entities/employer.entity';
import { UserJob } from '../user-jobs/entities/user-job.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import {
  Gender,
  Role,
  JobType,
  JobAvailability,
  Status,
  ExperienceLevel,
  JobDuration,
} from '../utils/constants/constants';
import { dataSourceOptions } from '../../db/data-source';
import * as bcrypt from 'bcryptjs';

console.log('Starting seed process...');

const seedData = async (dataSource: DataSource) => {
  console.log('Initializing repositories...');

  const userRepository = dataSource.getRepository(User);
  const locationRepository = dataSource.getRepository(Location);
  const jobSeekerRepository = dataSource.getRepository(JobSeeker);
  const employerRepository = dataSource.getRepository(Employer);
  const jobPostRepository = dataSource.getRepository(JobPost);
  const userJobRepository = dataSource.getRepository(UserJob);

  console.log('Creating location data...');
  // Create some locations
  const locations = [
    {
      city: 'New York',
      state: 'NY',
      address: '123 Main St',
      zipCode: '10001',
    },
    {
      city: 'Los Angeles',
      state: 'CA',
      address: '456 Elm St',
      zipCode: '90001',
    },
    {
      city: 'Chicago',
      state: 'IL',
      address: '789 Oak St',
      zipCode: '60601',
    },
  ];

  console.log('Saving locations...');
  const savedLocations = await locationRepository.save(locations);
  console.log('Locations saved:', savedLocations.length);

  console.log('Creating user data...');
  // Hash passwords before creating users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      fullName: 'John Doe',
      email: 'talhashabir0@gmail.com',
      password: hashedPassword,
      phoneNumber: '+1234567890',
      role: Role.Employee,
      gender: Gender.Male,
      location: savedLocations[0],
      isEmailVerified: true,
    },
    {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      phoneNumber: '+1234567891',
      role: Role.Employer,
      gender: Gender.Female,
      location: savedLocations[1],
      isEmailVerified: true,
    },
    {
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      password: hashedPassword,
      phoneNumber: '+1234567892',
      role: Role.Employee,
      gender: Gender.Other,
      location: savedLocations[2],
      isEmailVerified: true,
    },
  ];

  console.log('Saving users...');
  const savedUsers = await userRepository.save(users);
  console.log('Users saved:', savedUsers.length);

  console.log('Creating job seekers...');
  // Create Job Seekers
  const jobSeekers = [
    {
      skills: 'JavaScript, TypeScript, Node.js',
      professionalExperience: '5 years of web development',
      qualification: 'Bachelor in Computer Science',
      majorSubjects: 'Computer Science',
      certificates: '2',
      certificatesData: 'AWS Certified, Google Cloud Certified',
      user: savedUsers[0],
    },
    {
      skills: 'Python, Data Science, Machine Learning',
      professionalExperience: '3 years of data science',
      qualification: 'Master in Data Science',
      majorSubjects: 'Data Science',
      certificates: '1',
      certificatesData: 'TensorFlow Developer Certificate',
      user: savedUsers[2],
    },
  ];

  console.log('Saving job seekers...');
  const savedJobSeekers = await jobSeekerRepository.save(jobSeekers);
  console.log('Job seekers saved successfully');

  console.log('Creating employers...');
  // Create Employers
  const employers = [
    {
      companyName: 'Tech Corp',
      industry: 'Technology',
      companySize: '50-100',
      registrationNumber: '12345',
      user: savedUsers[1],
    },
  ];

  console.log('Saving employers...');
  const savedEmployers = await employerRepository.save(employers);
  console.log('Employers saved successfully');

  console.log('Creating job posts...');
  // Create Job Posts
  const jobPosts = [
    {
      title: 'Senior JavaScript Developer',
      type: JobType.FullTime,
      description: 'Looking for an experienced JavaScript developer',
      requirements: 'Min 5 years experience with modern JavaScript',
      salary: 120000,
      availability: JobAvailability.Remote,
      experienceLevel: ExperienceLevel.Expert,
      duration: JobDuration.Permanent,
      status: Status.Hiring,
      location: savedLocations[0],
      employer: savedEmployers[0],
    },
    {
      title: 'Data Scientist',
      type: JobType.FullTime,
      description: 'Seeking a data scientist for ML projects',
      requirements: 'Masters in Data Science or related field',
      salary: 130000,
      availability: JobAvailability.Hybrid,
      experienceLevel: ExperienceLevel.Intermediate,
      duration: JobDuration.Permanent,
      status: Status.Hiring,
      location: savedLocations[1],
      employer: savedEmployers[0],
    },
    {
      title: 'Frontend Developer',
      type: JobType.PartTime,
      description: 'Frontend developer needed for UI/UX projects',
      requirements: '3+ years of React experience',
      salary: 80000,
      availability: JobAvailability.OnSite,
      experienceLevel: ExperienceLevel.Entry,
      duration: JobDuration.Temporary,
      status: Status.Hiring,
      location: savedLocations[2],
      employer: savedEmployers[0],
    },
  ];

  console.log('Saving job posts...');
  const savedJobPosts = await jobPostRepository.save(jobPosts);
  console.log('Job posts saved:', savedJobPosts.length);

  console.log('Creating user jobs (applications)...');
  // Create User Jobs (applications)
  const userJobs = [
    {
      user: savedUsers[0],
      jobPost: savedJobPosts[0],
      status: Status.Applied,
      jobSeeker: savedJobSeekers[0],
      appliedAt: new Date(),
    },
    {
      user: savedUsers[0],
      jobPost: savedJobPosts[2],
      status: Status.Accepted,
      jobSeeker: savedJobSeekers[0],
      appliedAt: new Date(),
    },
    {
      user: savedUsers[2],
      jobPost: savedJobPosts[1],
      status: Status.Applied,
      jobSeeker: savedJobSeekers[1],
      appliedAt: new Date(),
    },
  ];

  console.log('Saving user jobs...');
  await userJobRepository.save(userJobs);
  console.log('User jobs saved successfully');

  console.log('Seeding completed successfully!');
};

// Create a self-executing async function to run the seed
(async () => {
  console.log('Connecting to database...');
  try {
    // Use the existing data source configuration
    const dataSource = new DataSource({
      ...dataSourceOptions,
      entities: [User, Location, JobSeeker, Employer, UserJob, JobPost], // Added JobPost entity
    });

    console.log('Initializing connection...');
    await dataSource.initialize();
    console.log('Database connected successfully');

    await seedData(dataSource);

    console.log('Closing database connection...');
    await dataSource.destroy();
    console.log('Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
})();

export default seedData;
