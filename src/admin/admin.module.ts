import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminAuthService } from './admin-auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forFeature([Admin]),
		JwtModule.register({
			secret: 'mysupersecretkey',
			signOptions: { expiresIn: '48h' },
		}),
	],
	controllers: [AdminController],
	providers: [AdminService, AdminAuthService],
	exports: [AdminService],
})
export class AdminModule {}
