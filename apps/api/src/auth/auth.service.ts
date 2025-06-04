import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@repo/db';
import { AppConfig, LoginUserInput, RegisterUserInput } from '@repo/schemas';
import { compare } from 'bcryptjs';
import { UserService } from 'src/user/user.service';

const JWT_EXPIRE_TIME = '1m';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService<AppConfig>,
    ) {}

    async registerUser(registerUserInput: RegisterUserInput) {
        const user = await this.userService.findByEmail(
            registerUserInput.email,
        );
        if (user) {
            throw new ConflictException('User with this email already exists.');
        }

        const newUser = await this.userService.create(registerUserInput);
        return {
            id: newUser.id,
        };
    }

    async login(loginInput: LoginUserInput) {
        const user = await this.validateUser(loginInput);
        const payload: JwtPayload = {
            sub: user.id,
        };

        let userSecretKey = user.secretKey;
        if (userSecretKey === null) {
            userSecretKey = await this.userService.setUserSecretKey(user.id);
        }

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: JWT_EXPIRE_TIME,
            secret: `${this.configService.get<string>('JWT_SECRET_KEY')}${userSecretKey}`,
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: `${this.configService.get<string>('JWT_REFRESH_TOKEN_KEY')}${userSecretKey}`,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(payload: JwtPayload) {
        const userSecretKey = await this.userService.getUserSecretKey(
            payload.sub,
        );

        const refreshedPayload: JwtPayload = {
            sub: payload.sub,
        };

        const accessToken = await this.jwtService.signAsync(refreshedPayload, {
            expiresIn: JWT_EXPIRE_TIME,
            secret: `${this.configService.get<string>('JWT_SECRET_KEY')}${userSecretKey}`,
        });

        return {
            accessToken,
        };
    }

    async validateUser(loginInput: LoginUserInput) {
        const user = await this.userService.findByEmail(loginInput.email);
        if (user && (await compare(loginInput.password, user?.password))) {
            return user;
        }
        throw new UnauthorizedException();
    }
}
