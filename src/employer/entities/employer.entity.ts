import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
export class Employer extends BaseEntity {
  @ApiProperty({
    example: 'Hegemonic Inc.',
    description: 'Company Name of the employer',
  })
  @Column({ nullable: true, unique: true })
  companyName: string;

  @ApiProperty({ example: 'IT', description: 'Industry sector of the company' })
  @Column({ nullable: true })
  industry: string;

  @ApiProperty({
    example: '50-100',
    description: 'Number of employees in the company',
  })
  @Column({ nullable: true })
  companySize: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Company registration number',
  })
  @Column({ nullable: true, unique: true })
  registrationNumber: string;

  @ApiProperty({
    example: "Write something about your company",
    description: 'Indicates whether the employer wants to hide their profile data in job posts',
  })
  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => JobPost, (jobPost) => jobPost.employer, {
    onDelete: 'CASCADE',
  })
  jobPosts: JobPost[];

  @OneToOne(() => User, (user) => user.employerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
