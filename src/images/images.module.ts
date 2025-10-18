// src/images/images.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { Image } from '../entities/image.entity';
import { Product } from '../entities/product.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Image, Product])],
	controllers: [ImagesController],
	providers: [],
})
export class ImagesModule {}
