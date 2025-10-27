import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
	) {}

	// 🧩 محصولات
	async findAllProducts(): Promise<Product[]> {
		return this.productRepo.find({ relations: ['images', 'reviews'] });
	}

	async findProductById(id: number): Promise<Product> {
		const product = await this.productRepo.findOne({
			where: { id },
			relations: ['images', 'reviews'],
		});
		if (!product) throw new NotFoundException('محصول پیدا نشد');
		return product;
	}

	async createProduct(dto: CreateProductDto): Promise<Product> {
		const newProduct = this.productRepo.create({
			...dto,
			createdAt: new Date(),
		});
		return this.productRepo.save(newProduct);
	}

	async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
		const product = await this.findProductById(id);
		Object.assign(product, dto);
		return this.productRepo.save(product);
	}

	async deleteProduct(id: number): Promise<{ message: string }> {
		const result = await this.productRepo.delete(id);
		if (result.affected === 0) throw new NotFoundException('محصول پیدا نشد');
		return { message: 'محصول حذف شد ✅' };
	}

	// 👥 کاربران
	async getAllUsers(): Promise<User[]> {
		return this.userRepo.find();
	}
}
