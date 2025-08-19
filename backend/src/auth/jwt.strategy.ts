import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id?: number; sub?: number; email?: string }) {
    // tokens are signed with { id, email } in AuthService
    const id = payload.id ?? payload.sub;
    if (!id) throw new UnauthorizedException();
    const user = await this.usersService.findById(id);
    if (!user) throw new UnauthorizedException();
    // return minimal user object so req.user.id is available
    return { id: user.id, email: (user as User).email };
  }
}
