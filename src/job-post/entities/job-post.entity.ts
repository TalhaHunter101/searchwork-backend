import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserJob } from '../../user-jobs/entities/user-job.entity';
import { Employer } from '../../employer/entities/employer.entity';
import {
  ExperienceLevel,
  JobAvailability,
  JobDuration,
  JobType,
  Status,
} from '../../utils/constants/constants';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base/base.entity';
import { Location } from '../../location/entities/location.entity';

@Entity()
export class JobPost extends BaseEntity {
  @ApiProperty({
    example: 'Software Engineer',
    description: 'Please enter your skills',
  })
  @IsNotEmpty()
  @IsString()
  @Column({ unique: true, nullable: true })
  title: string;

  @ApiProperty({ example: 'Full time', description: 'Job posting type' })
  @Column({ type: 'enum', enum: JobType, default: JobType.FullTime })
  type: JobType;

  @ApiProperty({
    example: 'We are looking for a software engineer',
    description: 'Job posting description',
  })
  @IsString()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    example: 'Bachelors degree',
    description: 'Provide requirements for the job you are posting',
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  requirements: string;

  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  locationId: number;

  @ApiProperty({
    example: '10$ per hour',
    description: 'How much you would pay for the job per hour',
  })
  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false })
  salary: number;

  @ApiProperty({ example: 'On-site', description: 'Job availability type' })
  @Column({
    type: 'enum',
    enum: JobAvailability,
    default: JobAvailability.OnSite,
  })
  availability: JobAvailability;

  @ApiProperty({
    example: 'Inteermidiate',
    description: 'Experience required for this job',
  })
  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    default: ExperienceLevel.Intermediate,
  })
  experienceLevel: ExperienceLevel;
  @
  IsNotEmpty()
  @Column({nullable: true})
  employerId: number;

  @ApiProperty({ example: 'Permanent', description: 'Job posting type' })
  @Column({ type: 'enum', enum: JobDuration, default: JobDuration.Permanent })
  duration: JobDuration;

  @ApiProperty({
    example: 'Hiring',
    description: 'Currently hiring on this job',
  })
  @Column({ type: 'enum', enum: Status, default: Status.Hiring })
  status: Status;

  // Table relations

  @ManyToOne(() => Employer, (employer) => employer.jobPosts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employer_id' })
  employer: Employer;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @OneToMany(() => UserJob, (userJob) => userJob.jobPost, {
    onDelete: 'CASCADE',
  })
  userJobs: UserJob[];
}
