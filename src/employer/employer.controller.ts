import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create an employer profile for the given userId' })
  @ApiBody({ type: CreateEmployerDto })
  async create(
    @Param('userId') userId: number,  // Get userId from the URL params
    @Body() createEmployerDto: CreateEmployerDto,
  ) {
    try{
      return this.employerService.create(userId, createEmployerDto);
    }catch(error){
      return {error: error.message}
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all employers' })
  async findAll() {
    try{
      return this.employerService.findAll();
    }catch(error){
      return {error: error.message}
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try{
      const employer = this.employerService.findOne(+id);
      if(!employer){
        return {error: "Employer not found"}
      }
      return employer;
    }catch(error){
      return {error: error.message}
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployerDto: UpdateEmployerDto,
  ) {
    try{
      const employer = this.employerService.findOne(+id);
      if(!employer){
        return {error: "Employer not found"}
      }return this.employerService.update(+id, updateEmployerDto);
    }catch(error){
      return {error: error.message}
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try{
      const employer = this.employerService.findOne(+id);
      if(!employer){
        return {error: "Employer not found"}
      }return this.employerService.remove(+id);
  }catch(error){
    return {error: error.message}
  }
  }
}

