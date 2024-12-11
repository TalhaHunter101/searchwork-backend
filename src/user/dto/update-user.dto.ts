import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserProfile {
  @ApiProperty({
    example: '+971123456789',
    description: 'The phone number of the account',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
    format: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Talha Shabbir',
    description: 'Name of user',
    format: 'string',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'Paragon City, Lahore',
    description: 'Address of user',
    format: 'string',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: 'Profile image',
    description: 'Profile image of user',
    format: 'string',
  })
  @IsString()
  profilePicture: string;
}
