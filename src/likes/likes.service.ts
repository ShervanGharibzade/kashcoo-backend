import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class LikesService {
	constructor(
		@InjectRepository(Like) private likeRepo: Repository<Like>,
		@InjectRepository(Product) private productRepo: Repository<Product>,
	) {}

	async toggleLike(user: User, productId: number) {
		const product = await this.productRepo.findOne({ where: { id: productId } });
		if (!product) throw new NotFoundException('محصول یافت نشد.');

		const existing = await this.likeRepo.findOne({ where: { user: { id: user.id }, product: { id: productId } } });

		if (existing) {
			await this.likeRepo.remove(existing);
			return { liked: false };
		}

		const like = this.likeRepo.create({ user, product });
		await this.likeRepo.save(like);
		return { liked: true };
	}

	async countProductLikes(productId: number) {
		return this.likeRepo.count({ where: { product: { id: productId } } });
	}

	async getUserLikes(user: User) {
		return this.likeRepo.find({
			where: { user: { id: user.id } },
			relations: ['product'],
			order: { createdAt: 'DESC' },
		});
	}
}
