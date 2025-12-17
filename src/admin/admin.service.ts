import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminRole } from './admin.entity';
import { Product } from 'src/entities/product.entity';
import { Image } from 'src/entities/image.entity';

@Injectable()
export class AdminService {
	constructor(
		// اصلی برای مدیریت ادمین‌ها
		@InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
		// ریپازیتوری صحیح برای محصولات
		@InjectRepository(Product) private readonly productRepository: Repository<Product>,
		// ریپازیتوری صحیح برای تصاویر
		@InjectRepository(Image) private readonly imageRepository: Repository<Image>,
	) {}

	async findAllAdmins() {
		return this.adminRepo.find();
	}

	async deleteAdmin(adminId: number, operatorId: number) {
		if (adminId === operatorId) {
			throw new ForbiddenException('You cannot delete yourself');
		}
		const operator = await this.adminRepo.findOne({ where: { id: operatorId } });
		if (!operator || operator.role !== AdminRole.SUPER_ADMIN) {
			throw new ForbiddenException('Only SUPER_ADMIN can delete admins');
		}

		const admin = await this.adminRepo.findOne({ where: { id: adminId } });
		if (!admin) throw new NotFoundException('Admin not found');

		await this.adminRepo.delete(adminId);
		return { success: true };
	}

	async toggleAdminActivation(adminId: number, operatorId: number, isActive: boolean) {
		if (adminId === operatorId && !isActive) {
			throw new ForbiddenException('You cannot deactivate your own account');
		}
		const operator = await this.adminRepo.findOne({ where: { id: operatorId } });
		if (!operator || operator.role !== AdminRole.SUPER_ADMIN) {
			throw new ForbiddenException('Only SUPER_ADMIN can toggle activation');
		}

		const admin = await this.adminRepo.findOne({ where: { id: adminId } });
		if (!admin) throw new NotFoundException('Admin not found');

		admin.isActive = isActive;
		return this.adminRepo.save(admin);
	}

	async uploadProductImage(productId: number, file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException('فایل ارسال نشده است');
		}

		const qbAll = await this.productRepository.find();

		// ✅ دور زدن STI
		const product = await this.productRepository
			.createQueryBuilder('product')
			.where('product.id = :id', { id: productId })
			.getOne();

		if (!product) {
			throw new NotFoundException('محصول پیدا نشد');
		}

		// ✅ بدون reliance روی eager / join
		const imagesCount = await this.imageRepository.count({
			where: {
				product: { id: productId },
			},
		});

		const image = this.imageRepository.create({
			product,
			url: `uploads/products/${file.filename}`,
			isMain: imagesCount === 0,
		});

		return this.imageRepository.save(image);
	}

	async setMainImage(productId: number, imageId: number) {
		// اول مطمئن می‌شویم خود عکس برای همین محصول وجود دارد
		const image = await this.imageRepository.findOne({
			where: {
				id: imageId,
				product: { id: productId },
			},
			relations: ['product'],
		});

		if (!image) {
			throw new NotFoundException('عکس برای این محصول پیدا نشد');
		}

		// همه عکس‌های این محصول را از حالت main خارج می‌کنیم
		await this.imageRepository
			.createQueryBuilder()
			.update()
			.set({ isMain: false })
			.where('productId = :productId', { productId })
			.execute();

		// و این عکس را main می‌کنیم
		image.isMain = true;
		await this.imageRepository.save(image);

		return { success: true };
	}

	async deleteImage(imageId: number) {
		const image = await this.imageRepository.findOne({ where: { id: imageId } });
		if (!image) throw new NotFoundException('عکس پیدا نشد');
		return this.imageRepository.remove(image);
	}
}
