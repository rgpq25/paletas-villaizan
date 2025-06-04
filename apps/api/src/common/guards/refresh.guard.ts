import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '@repo/db';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@repo/schemas';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService<AppConfig>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const refreshToken = this.extractRefreshTokenFromHeader(request);

        if (!refreshToken) throw new UnauthorizedException();

        const incomingPayload =
            this.jwtService.decode<JwtPayload>(refreshToken);
        const userSecretKey = await this.userService.getUserSecretKey(
            incomingPayload.sub,
        );

        if (!userSecretKey) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(
                refreshToken,
                {
                    secret: `${this.configService.get<string>('JWT_REFRESH_TOKEN_KEY')}${userSecretKey}`,
                },
            );

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractRefreshTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Refresh' ? token : undefined;
    }
}
