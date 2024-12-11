import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JobPost } from 'src/job-post/entities/job-post.entity';
import { Status } from 'src/utils/constants/constants';

@Entity()
export class AppliedJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference to the job post being applied for
  @ManyToOne(() => JobPost, (jobPost) => jobPost.appliedJobs, { onDelete: 'CASCADE', nullable: false })
  jobPost: JobPost;

  // Reference to the user (candidate) who applied for the job
  @ManyToOne(() => User, (user) => user.appliedJobs, { onDelete: 'CASCADE', nullable: false })
  user: User;

  // Status of the job application
  @Column({ type: 'enum', enum: Status, default: Status.Applied })
  status: Status;

  // The date the application was made
  @CreateDateColumn()
  appliedAt: Date;

  // The last update date for this application
  @UpdateDateColumn()
  updatedAt: Date;
}
