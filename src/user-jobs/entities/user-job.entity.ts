import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { JobSeeker } from '../../job-seeker/entities/job-seeker.entity';
import { Status } from '../../utils/constants/constants';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
export class UserJob extends BaseEntity {
  // Relationship with JobPost
  @ManyToOne(() => JobPost, (jobPost) => jobPost.userJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPost;

  // Relationship with User (applicant)
  @ManyToOne(() => User, (user) => user.userJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relationship with JobSeeker (optional, but recommended)
  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.userJobs, {
    onDelete: 'CASCADE',
    nullable: true, // Some users might not have a job seeker profile
  })
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker?: JobSeeker;

  // Application status
  @Column({ 
    type: 'enum', 
    enum: Status, 
    default: Status.Applied 
  })
  status: Status;

  // Additional fields to track application details
  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  appliedAt: Date;
}