import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcryptjs';
import { JwtPayload } from '@repo/db';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const JWT_EXPIRE_TIME = '1m';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async registerUser(createUserDto: CreateUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email);
        if (user) {
            throw new ConflictException('User with this email already exists.');
        }

        const newUser = await this.userService.create(createUserDto);
        return {
            id: newUser.id,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
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

    async validateUser(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (user && (await compare(dto.password, user?.password))) {
            return user;
        }
        throw new UnauthorizedException();
    }
}
