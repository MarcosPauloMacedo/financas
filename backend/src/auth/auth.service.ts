import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.userService.setCurrentRefreshToken(
      tokens.refresh_token,
      user.id,
    );

    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'defaultRefreshJwtSecret',
      });

      const user = await this.userService.findByIdWithRefreshToken(payload.sub);

      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Acesso negado');
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new ForbiddenException('Acesso negado');
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.userService.setCurrentRefreshToken(
        tokens.refresh_token,
        user.id,
      );

      return tokens;
    } catch (error) {
      throw new ForbiddenException('Refresh token inválido');
    }
  }

  async getTokens(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_SECRET ?? 'defaultJwtSecret',
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'defaultRefreshJwtSecret',
        expiresIn: '7d',
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
