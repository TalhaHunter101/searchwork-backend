import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId, isEmailVerified } = payload;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['employerProfile'], // Include this for employer checks
    });

    if (!isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
