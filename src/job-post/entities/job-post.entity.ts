import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AppliedJob } from "src/applied-jobs/entities/applied-job.entity";
import { Employer } from "src/employer/entities/employer.entity";
import { User } from "src/user/entities/user.entity";
import { ExperienceLevel, JobAvailability, JobDuration, JobType, Status } from "src/utils/constants/constants";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class JobPost {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({ example: 'Software Engineer', description: 'Please enter your skills' })
  @IsNotEmpty()
  @IsString()
  @Column({ unique: true, nullable: true })
  title: string;

  @ApiProperty({ example: 'Full time', description: 'Job posting type' })
  @Column({ type: 'enum', enum: JobType, default: JobType.FullTime })
  type: JobType;

  @ApiProperty({ example: 'We are looking for a software engineer', description: 'Job posting description' })
  @IsString()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: 'Bachelors degree', description: 'Provide requirements for the job you are posting' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  requirements: string;

  @ApiProperty({ example: 'Houston, USA', description: 'Provide location for the job you are posting' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ example: '10$ per hour', description: 'How much you would pay for the job per hour' })
  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false })
  salary: number;

  @ApiProperty({ example: 'On-site', description: 'Job availability type' })
  @Column({ type: 'enum', enum: JobAvailability, default: JobAvailability.OnSite })
  availability: JobAvailability;

  @ApiProperty({ example: 'Inteermidiate', description: 'Experience required for this job' })
  @Column({ type: 'enum', enum: ExperienceLevel, default: ExperienceLevel.Intermediate })
  experienceLevel: ExperienceLevel;
 
  @ApiProperty({ example: 'Permanent', description: 'Job posting type' })
  @Column({ type: 'enum', enum: JobDuration, default: JobDuration.Permanent })
  duration: JobDuration;

  @ApiProperty({ example: 'Hiring', description: 'Currently hiring on this job' })
  @Column({ type: 'enum', enum: Status, default: Status.Hiring })
  status: Status;

  @ManyToOne(() => Employer, (employer) => employer.jobPosts, { onDelete: 'CASCADE' })
  employer: Employer;

  @OneToMany(() => AppliedJob, (appliedJob) => appliedJob.jobPost)
  appliedJobs: AppliedJob[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
  jobPosts: any;
}

