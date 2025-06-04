import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@repo/schemas';

function loadConfig() {
    const parsed = configSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('Invalid environment variables:', parsed.error.format());
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
}

@Module({
    imports: [
        UserModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [loadConfig],
        }),
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
