import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtPayload } from '@repo/db';
import {
    LoginUserInput,
    loginUserSchema,
    RegisterUserInput,
    registerUserSchema,
} from '@repo/schemas';
import { ZodValidatorPipe } from 'src/common/pipes/zod-validator.pipe';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from 'src/common/guards/refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body(new ZodValidatorPipe(registerUserSchema))
        body: RegisterUserInput,
    ) {
        return await this.authService.registerUser(body);
    }

    @Post('login')
    async login(
        @Body(new ZodValidatorPipe(loginUserSchema)) body: LoginUserInput,
    ) {
        return await this.authService.login(body);
    }

    @UseGuards(RefreshJwtGuard)
    @Get('refresh')
    async refresh(@Request() req: { user: JwtPayload }) {
        return await this.authService.refreshToken(req.user);
    }
}
