import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { Employer } from './entities/employer.entity';
import { User } from '../user/entities/user.entity';
import { UpdateEmployerDto } from './dto/update-employer.dto';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, createEmployerDto: CreateEmployerDto): Promise<Employer> {
    // Find the user by userId
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create a new Employer instance
    const newEmployer = this.employerRepository.create({
      ...createEmployerDto,  // Spread the DTO properties
      user,  // Link the Employer to the User
    });

    // Save the Employer and return the created record
    return await this.employerRepository.save(newEmployer);
  }

  findAll() {
    return this.employerRepository.find();
  }

  findOne(id: number) {
    return this.employerRepository.findOne({ where: { id } });
  }

  async update(id: number, updateEmployerDto: UpdateEmployerDto) {
    const employer = await this.employerRepository.findOne({ where: { id } });
    
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    // Update the Employer with the new values
    Object.assign(employer, updateEmployerDto);

    return this.employerRepository.save(employer);
  }

  async remove(id: number) {
    const employer = await this.employerRepository.findOne({ where: { id } });

    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    await this.employerRepository.remove(employer);
    return { message: 'Employer removed successfully' };
  }
}
