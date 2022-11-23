import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yui',
    });
  }

  async validate(payload: { id: number; email: string }) {
    const data = { id: payload.id, email: payload.email };

    const { password, ...user } = await this.userService.getUserByCond(data);

    if (!user) {
      throw new UnauthorizedException('Нет доступа к этой странице');
    }

    return user;
  }
}
