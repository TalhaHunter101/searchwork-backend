import { PartialType } from '@nestjs/swagger';
import { CreateAppliedJobDto } from './create-applied-job.dto';

export class UpdateAppliedJobDto extends PartialType(CreateAppliedJobDto) {}
