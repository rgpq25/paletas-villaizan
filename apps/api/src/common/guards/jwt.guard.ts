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
export class JwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService<AppConfig>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const accessToken = this.extractAccessTokenFromHeader(request);

        if (!accessToken) throw new UnauthorizedException();

        const incomingPayload = this.jwtService.decode<JwtPayload>(accessToken);
        const userSecretKey = await this.userService.getUserSecretKey(
            incomingPayload.sub,
        );

        if (!userSecretKey) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(
                accessToken,
                {
                    secret: `${this.configService.get<string>('JWT_SECRET_KEY')}${userSecretKey}`,
                },
            );

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractAccessTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
