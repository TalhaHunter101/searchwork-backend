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
} from '../utils/constants/constants';
import { Point } from 'geojson';
import { dataSourceOptions } from '../../db/data-source';

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
  const point1: Point = {
    type: 'Point',
    coordinates: [-74.006, 40.7128],
  };
  const point2: Point = {
    type: 'Point',
    coordinates: [-118.2437, 34.0522],
  };
  const point3: Point = {
    type: 'Point',
    coordinates: [-87.6298, 41.8781],
  };

  const locations = [
    {
      city: 'New York',
      state: 'NY',
      address: '123 Main St',
      zipCode: '10001',
      point: point1,
    },
    {
      city: 'Los Angeles',
      state: 'CA',
      address: '456 Elm St',
      zipCode: '90001',
      point: point2,
    },
    {
      city: 'Chicago',
      state: 'IL',
      address: '789 Oak St',
      zipCode: '60601',
      point: point3,
    },
  ];

  console.log('Saving locations...');
  const savedLocations = await locationRepository.save(locations);
  console.log('Locations saved:', savedLocations.length);

  console.log('Creating user data...');
  // Create some users
  const users = [
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phoneNumber: '+1234567890',
      role: Role.Employee,
      gender: Gender.Male,
      location: savedLocations[0],
    },
    {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phoneNumber: '+1234567891',
      role: Role.Employer,
      gender: Gender.Female,
      location: savedLocations[1],
    },
    {
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      phoneNumber: '+1234567892',
      role: Role.Employee,
      gender: Gender.Other,
      location: savedLocations[2],
    },
  ];

  console.log('Saving users...');
  const savedUsers = await userRepository.save(users);
  console.log('Users saved:', savedUsers.length);

  console.log('Creating job seekers...');
  // Create Job Seekers
  const jobSeekers = [
    {
      userId: savedUsers[0].id,
      skills: 'JavaScript, TypeScript, Node.js',
      professionalExperience: '5 years of web development',
      qualification: 'Bachelor in Computer Science',
      majorSubjects: 'Computer Science',
      certificates: '2',
      certificatesData: 'AWS Certified, Google Cloud Certified',
      user: savedUsers[0],
    },
    {
      userId: savedUsers[2].id,
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
  await jobSeekerRepository.save(jobSeekers);
  console.log('Job seekers saved successfully');

  console.log('Creating employers...');
  // Create Employers
  const employers = [
    {
      userId: savedUsers[1].id,
      companyName: 'Tech Corp',
      industry: 'Technology',
      companySize: '50-100',
      registrationNumber: '12345',
      user: savedUsers[1],
    },
  ];

  console.log('Saving employers...');
  await employerRepository.save(employers);
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
      location: savedLocations[0], // New York location
      employer: employers[0], // Tech Corp
    },
    {
      title: 'Data Scientist',
      type: JobType.FullTime,
      description: 'Seeking a data scientist for ML projects',
      requirements: 'Masters in Data Science or related field',
      salary: 130000,
      availability: JobAvailability.Hybrid,
      location: savedLocations[1], // LA location
      employer: employers[0], // Tech Corp
    },
    {
      title: 'Frontend Developer',
      type: JobType.PartTime,
      description: 'Frontend developer needed for UI/UX projects',
      requirements: '3+ years of React experience',
      salary: 80000,
      availability: JobAvailability.OnSite,
      location: savedLocations[2], // Chicago location
      employer: employers[0], // Tech Corp
    },
  ];

  console.log('Saving job posts...');
  const savedJobPosts = await jobPostRepository.save(jobPosts);
  console.log('Job posts saved:', savedJobPosts.length);

  console.log('Creating user jobs (applications)...');
  // Create User Jobs (applications)
  const userJobs = [
    {
      user: savedUsers[0], // John Doe
      jobPost: savedJobPosts[0], // Senior JavaScript Developer position
      status: Status.Applied,
    },
    {
      user: savedUsers[0], // John Doe
      jobPost: savedJobPosts[2], // Frontend Developer position
      status: Status.Accepted,
    },
    {
      user: savedUsers[2], // Alex Johnson
      jobPost: savedJobPosts[1], // Data Scientist position
      status: Status.Applied,
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
