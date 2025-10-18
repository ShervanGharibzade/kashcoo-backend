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

	async create(dto: CreateProductDto): Promise<Product> {
		// ایجاد مستقیم از DTO (بدون brandRepo)
		const product = this.productRepo.create(dto);
		return this.productRepo.save(product);
	}

	async findAll(query?: any): Promise<Product[]> {
		const { search, category, priceMin, priceMax, sort } = query || {};

		// ساخت شرط فیلتر پویا
		const where: any = {};

		// 🔹 جست‌وجو در نام و توضیحات
		if (search) {
			where.name = ILike(`%${search}%`);
		}

		// 🔹 اگر دسته‌بندی دارید
		if (category) {
			where.category = ILike(`%${category}%`);
		}

		// 🔹 محدوده قیمت
		if (priceMin && priceMax) {
			where.price = Between(Number(priceMin), Number(priceMax));
		} else if (priceMin) {
			where.price = MoreThanOrEqual(Number(priceMin));
		} else if (priceMax) {
			where.price = LessThanOrEqual(Number(priceMax));
		}

		// چگونه مرتب‌سازی انجام شود
		let order: any = {};
		switch (sort) {
			case 'priceAsc':
				order = { price: 'ASC' };
				break;
			case 'priceDesc':
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
				break;
		}

		// اجرای Query نهایی
		return await this.productRepo.find({
			where,
			order,
		});
	}

	async findByIds(ids: number[]) {
		return this.productRepo.find({
			where: { id: In(ids) },
		});
	}

	async findOne(id: number): Promise<Product> {
		const product = await this.productRepo.findOne({ where: { id } });
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}

	async update(id: number, dto: UpdateProductDto): Promise<Product> {
		const product = await this.findOne(id);
		Object.assign(product, dto);
		return this.productRepo.save(product);
	}

	async remove(id: number): Promise<void> {
		const result = await this.productRepo.delete(id);
		if (result.affected === 0) throw new NotFoundException('Product not found');
	}
}
