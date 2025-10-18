import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteList } from '../entities/favorite-list.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FavoriteListService {
	constructor(
		@InjectRepository(FavoriteList)
		private readonly favoriteRepo: Repository<FavoriteList>,
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
	) {}

	async toggleFavorite(user: User, productId: number) {
		const product = await this.productRepo.findOne({ where: { id: productId } });
		if (!product) throw new NotFoundException('محصول یافت نشد.');

		const exists = await this.favoriteRepo.findOne({
			where: { user: { id: user.id }, product: { id: productId } },
		});

		if (exists) {
			await this.favoriteRepo.remove(exists);
			return { favorited: false };
		}

		const newFav = this.favoriteRepo.create({ user, product });
		await this.favoriteRepo.save(newFav);
		return { favorited: true };
	}

	async getUserFavorites(user: User) {
		return this.favoriteRepo.find({
			where: { user: { id: user.id } },
			relations: ['product'],
			order: { createdAt: 'DESC' },
		});
	}

	async countFavoritesForProduct(productId: number): Promise<number> {
		return this.favoriteRepo.count({ where: { product: { id: productId } } });
	}
}
