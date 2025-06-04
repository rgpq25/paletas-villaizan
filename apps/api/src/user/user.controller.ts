import {
    Controller,
    ForbiddenException,
    Get,
    Param,
    Request,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { ZodValidatorPipe } from 'src/common/pipes/zod-validator.pipe';
import { UserIdInput, userIdSchema } from '@repo/schemas';
import { JwtPayload } from '@repo/db';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get(':id')
    async getUser(
        @Param('id', new ZodValidatorPipe(userIdSchema)) id: UserIdInput,
        @Request() req: { user: JwtPayload },
    ) {
        if (req.user.sub !== id) {
            throw new ForbiddenException();
        }
        return await this.userService.findById(id);
    }
}
