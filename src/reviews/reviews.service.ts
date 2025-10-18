import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
@Injectable()
export class ReviewsService {
	constructor(
		@InjectRepository(Review) private reviewRepo: Repository<Review>,
		@InjectRepository(Product) private productRepo: Repository<Product>,
		@InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
	) {}

	async create(user: User, dto: CreateReviewDto) {
		const { productId, rating, comment } = dto;

		// بررسی اینکه کاربر واقعاً خریدش رو انجام داده
		const boughtItem = await this.orderItemRepo.findOne({
			where: {
				order: { user: { id: user.id } },
				product: { id: productId },
			},
			relations: ['order', 'product'],
		});

		if (!boughtItem) throw new ForbiddenException('فقط خریداران مجاز به ثبت نظر هستند.');

		const existing = await this.reviewRepo.findOne({ where: { user: { id: user.id }, product: { id: productId } } });
		if (existing) throw new ForbiddenException('شما برای این محصول قبلاً نظر ثبت کرده‌اید.');

		const product = await this.productRepo.findOne({ where: { id: productId } });
		if (!product) throw new NotFoundException('محصول یافت نشد.');

		const review = this.reviewRepo.create({
			rating,
			comment,
			user,
			product,
		});
		await this.reviewRepo.save(review);

		// به‌روزرسانی میانگین امتیاز محصول
		await this.updateProductAverageRating(productId);

		return review;
	}

	async update(id: number, user: User, dto: UpdateReviewDto) {
		const review = await this.reviewRepo.findOne({ where: { id }, relations: ['user', 'product'] });
		if (!review) throw new NotFoundException('نظر یافت نشد.');

		if (review.user.id !== user.id) throw new ForbiddenException('شما اجازه‌ی ویرایش این نظر را ندارید.');

		Object.assign(review, dto);
		await this.reviewRepo.save(review);

		await this.updateProductAverageRating(review.product.id);

		return review;
	}

	async remove(id: number, user: User) {
		const review = await this.reviewRepo.findOne({ where: { id }, relations: ['user', 'product'] });
		if (!review) throw new NotFoundException('نظر یافت نشد.');

		if (review.user.id !== user.id) throw new ForbiddenException('شما اجازه حذف این نظر را ندارید.');

		await this.reviewRepo.remove(review);
		await this.updateProductAverageRating(review.product.id);
		return { success: true };
	}

	async findByProduct(productId: number) {
		return this.reviewRepo.find({
			where: { product: { id: productId } },
			relations: ['user'],
			order: { createdAt: 'DESC' },
		});
	}

	private async updateProductAverageRating(productId: number) {
		const reviews = await this.reviewRepo.find({
			where: { product: { id: productId } },
		});
		const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

		await this.productRepo.update(productId, { averageRating: avg });
	}
}
