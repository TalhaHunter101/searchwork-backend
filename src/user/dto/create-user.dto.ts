import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/utils/constants/constants';

export class RegisterDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
    format: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password for the account',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    enum: Role,
    example: Role.Employee,
    description: 'Role of the user',
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  // @ApiProperty({
  //   example: '+971123456789',
  //   description: 'Phone number of the user',
  //   format: 'string',
  // })
  // @IsString()
  // @IsNotEmpty()
  // @IsPhoneNumber()
  // phoneNumber: string;

  // @ApiProperty({
  //   enum: ['Male', 'Female', 'Other'],
  //   example: 'Male',
  //   description: 'Gender of the user',
  // })
  // @IsEnum(['Male', 'Female', 'Other'])
  // @IsNotEmpty()
  // gender: 'Male' | 'Female' | 'Other';

  // @ApiProperty({
  //   example: 'Paragon City, Lahore',
  //   description: 'Address of the user',
  //   format: 'string',
  // })
  // @IsString()
  // @IsNotEmpty()
  // address: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
    format: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password for the user account',
    format: 'string',
  })
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user requesting password reset',
    format: 'string',
  })
  @IsEmail()
  email: string;
}

export class VerifyOtp {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
    format: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP sent to the user for verification',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
export class ResetPasswordDto {
  @ApiProperty({
    example: 'talhashabir0@gmail.com',
    description: 'Email address of the user',
    format: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP sent to the user for verification',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'New password for the user account',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
