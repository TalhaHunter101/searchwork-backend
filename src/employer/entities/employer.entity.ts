import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { JobPost } from 'src/job-post/entities/job-post.entity';

@Entity()
export class Employer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.employerProfile, { cascade: true })
  user: User;

  @ApiProperty({ example: 'Hegemonic Inc.', description: 'Company Name of the employer' })
  @Column({ nullable: false, unique: true })
  companyName: string;

  @ApiProperty({ example: 'IT', description: 'Industry sector of the company' })
  @Column({ nullable: false })
  industry: string;

  @ApiProperty({ example: '50-100', description: 'Number of employees in the company' })
  @Column({ nullable: true })
  companySize: string;

  @ApiProperty({ example: '1234567890', description: 'Company registration number' })
  @Column({ nullable: true })
  registrationNumber: string;

  @OneToMany(() => JobPost, (jobPost) => jobPost.employer, { onDelete: 'CASCADE' })
  jobPosts: JobPost[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
