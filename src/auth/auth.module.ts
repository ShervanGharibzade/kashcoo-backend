import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Token } from '../entities/token.entity';
import { TokenCleanupService } from './token-cleanup.service';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		TypeOrmModule.forFeature([Token]),
		JwtModule.register({
			secret: 'SECRET_KEY_123',
			signOptions: { expiresIn: '48h' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, TokenCleanupService],
})
export class AuthModule {}
