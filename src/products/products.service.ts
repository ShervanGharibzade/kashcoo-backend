import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
	) {}

	// 🟩 ایجاد محصول
	async create(dto: CreateProductDto): Promise<Product> {
		const product = this.productRepo.create(dto);
		return this.productRepo.save(product);
	}

	async getAllCategories(): Promise<string[]> {
		// 👇 فقط ستون category رو می‌گیریم
		const result = await this.productRepo
			.createQueryBuilder('product')
			.select('DISTINCT product.category', 'category')
			.where('product.category IS NOT NULL')
			.orderBy('product.category', 'ASC')
			.getRawMany();

		// 👇 خروجی: [{ category: 'کوله‌پشتی' }, { category: 'کیف لپ‌تاپ' }, ...]
		return result.map((row) => row.category);
	}

	// 🟩 دریافت همه محصولات با فیلترینگ و مرتب‌سازی پویا
	async findAll(query?: any): Promise<Product[]> {
		const { search, category, priceMin, priceMax, sort } = query || {};

		const where: any = {};

		// 🔹 جست‌وجو در نام و توضیحات
		if (search) {
			where.name = ILike(`%${search}%`);
		}

		// 🔹 فیلتر دسته‌بندی (category)
		if (category) {
			where.category = ILike(`%${category}%`);
		}

		// 🔹 محدودۀ قیمت
		const min = Number(priceMin);
		const max = Number(priceMax);

		if (!isNaN(min) && !isNaN(max)) {
			where.price = Between(min, max);
		} else if (!isNaN(min)) {
			where.price = MoreThanOrEqual(min);
		} else if (!isNaN(max)) {
			where.price = LessThanOrEqual(max);
		}

		// 🔹 مرتب‌سازی
		let order: any = {};
		switch (sort) {
			case 'priceAsc':
				order = { price: 'ASC' };
				break;
			case 'priceDesc':
			case 'priceHigh':
				order = { price: 'DESC' };
				break;
			case 'newest':
				order = { createdAt: 'DESC' };
				break;
			case 'oldest':
				order = { createdAt: 'ASC' };
				break;
			default:
				order = { id: 'DESC' };
		}

		// 🟢 اجرای Query و افزودن relations لازم
		return this.productRepo.find({
			where,
			order,
			relations: ['images', 'reviews'], // برای صفحه تکی و گالری
		});
	}

	// 🟩 جست‌وجو بر اساس لیست IDها (برای مقایسه یا علاقه‌مندی‌ها)
	async findByIds(ids: number[]) {
		return this.productRepo.find({
			where: { id: In(ids) },
			relations: ['images'],
		});
	}

	// 🟩 دریافت تکی محصول
	async findOne(id: number): Promise<Product> {
		const product = await this.productRepo.findOne({
			where: { id },
			relations: ['images', 'reviews'],
		});
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}

	// 🟩 بروزرسانی محصول
	async update(id: number, dto: UpdateProductDto): Promise<Product> {
		const product = await this.findOne(id);
		Object.assign(product, dto);
		return this.productRepo.save(product);
	}

	// 🟩 حذف محصول
	async remove(id: number): Promise<void> {
		const result = await this.productRepo.delete(id);
		if (result.affected === 0) throw new NotFoundException('Product not found');
	}
}
