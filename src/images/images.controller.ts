// src/images/images.controller.ts
import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
	Param,
	ParseIntPipe,
	NotFoundException,
	Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { Product } from '../entities/product.entity';

// مسیر ذخیره‌سازی فایل‌ها و نام‌گذاری آن‌ها
const storage = diskStorage({
	// '..' برای خروج از src و رسیدن به ریشه پروژه
	destination: join(process.cwd(), 'uploads/products'),
	filename: (req, file, cb) => {
		// ایجاد یک نام فایل یونیک (timestamp + random)
		const name = file.originalname.split('.')[0];
		const extension = extname(file.originalname);
		const randomName = Array(32)
			.fill(null)
			.map(() => Math.round(Math.random() * 16).toString(16))
			.join('');
		cb(null, `${name}-${randomName}${extension}`);
	},
});

@Controller('images')
export class ImagesController {
	constructor(
		@InjectRepository(Image)
		private readonly imageRepo: Repository<Image>,
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
	) {}

	@Post('upload/:productId')
	@UseInterceptors(FileInterceptor('file', { storage }))
	async uploadImage(
		@Param('productId', ParseIntPipe) productId: number,
		@UploadedFile() file: Express.Multer.File,
		@Body('isMain') isMain: string = 'false',
	) {
		const product = await this.productRepo.findOne({ where: { id: productId } });
		if (!product) {
			// اگر محصول پیدا نشد، عکس را حذف و خطا بده
			// (در محیط واقعی، باید منطق حذف فایل موقت را اینجا نوشت)
			throw new NotFoundException(`Product with ID ${productId} not found`);
		}

		const isMainBoolean = isMain === 'true';

		// اگر isMain=true باشد، عکس‌های اصلی قدیمی را غیرفعال کن
		if (isMainBoolean) {
			await this.imageRepo.update({ product: { id: productId }, isMain: true }, { isMain: false });
		}

		// ذخیره‌ی مرجع عکس در جدول images
		const imageEntity = this.imageRepo.create({
			// URL نسبی برای دسترسی از طریق سرور استاتیک
			url: `/uploads/products/${file.filename}`,
			isMain: isMainBoolean,
			product,
		});

		return this.imageRepo.save(imageEntity);
	}
}
