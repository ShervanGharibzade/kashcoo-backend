import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminAuthService } from './admin-auth.service';
import { Product } from 'src/entities/product.entity';
import { Image } from 'src/entities/image.entity';

@Module({
	imports: [
		// ریپازیتوری‌های موردنیاز در این ماژول
		TypeOrmModule.forFeature([Admin, Product, Image]),
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
