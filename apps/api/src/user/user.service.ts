import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@repo/db';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const { password, ...user } = createUserDto;
        const id = uuidv4();
        const hashedPassword = await hash(password, 10);

        return await this.prismaService.user.create({
            data: {
                ...user,
                id,
                password: hashedPassword,
                createdById: id,
                updatedById: id,
            },
        });
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return await this.prismaService.user.findUnique({
            where: { id },
        });
    }

    async getUserSecretKey(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            select: { secretKey: true },
        });

        if (!user) {
            return null;
        }

        return user.secretKey;
    }

    async setUserSecretKey(id: string) {
        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: {
                secretKey: uuidv4(),
                updatedById: id,
            },
            select: { secretKey: true },
        });

        return updatedUser.secretKey;
    }

    getPublicUserData(user: User) {
        return {
            id: user.id,
        };
    }
}
