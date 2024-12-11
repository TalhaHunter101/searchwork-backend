import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from 'src/utils/constants/constants';
import { JobSeeker } from 'src/job-seeker/entities/job-seeker.entity';
import { Employer } from 'src/employer/entities/employer.entity';
import { JobPost } from 'src/job-post/entities/job-post.entity';
import { AppliedJob } from 'src/applied-jobs/entities/applied-job.entity';

@Entity()
@Index(['email', 'phoneNumber'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '+971123456789' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber(null)
  @Column({ nullable: false })
  phoneNumber: string;

  @ApiProperty({ example: 'Talha Shabbir' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ example: 'Employee' })
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.Employee })
  role: Role;

  @ApiProperty({ example: 'Male' })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isEmailVerified: boolean;

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.user, { cascade: true })
  @JoinColumn()
  jobSeekerProfile: JobSeeker;

  @OneToOne(() => Employer, (employer) => employer.user, { cascade: true })
  @JoinColumn()
  employerProfile: Employer;

  @OneToMany(() => AppliedJob, (appliedJob) => appliedJob.user)
  appliedJobs: AppliedJob[];


  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
