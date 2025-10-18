// src/images/images.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
// Import DTOs here (مثلا CreateImageDto)

@Injectable()
export class ImagesService {
	constructor(
		@InjectRepository(Image)
		private readonly imageRepository: Repository<Image>,
	) {}

	/**
	 * Finds all images for a specific product.
	 */
	async findByProduct(productId: number): Promise<Image[]> {
		return this.imageRepository.find({
			where: { product: { id: productId } },
		});
	}

	/**
	 * Creates new image records.
	 * @param urls Array of image URLs/paths.
	 * @param productId The ID of the parent product.
	 */
	async createImages(urls: string[], productId: number): Promise<Image[]> {
		if (urls.length === 0) return [];

		const imageEntities = urls.map((url, index) => {
			return this.imageRepository.create({
				url: url,
				isMain: index === 0, // اولین تصویر به عنوان تصویر اصلی
				product: { id: productId }, // اتصال به محصول
			});
		});

		return this.imageRepository.save(imageEntities);
	}

	// متد delete/update را می‌توان در آینده اضافه کرد.
}
