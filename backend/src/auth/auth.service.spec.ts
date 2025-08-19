import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ ...dto, password: hash });
    const token = this.jwt.sign({ id: user.id, email: user.email });
    return { token };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ id: user.id, email: user.email });
    return { token };
  }
}
