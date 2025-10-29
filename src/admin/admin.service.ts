import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminRole } from './admin.entity';
import { Product } from 'src/entities/product.entity';
import { Image } from 'src/entities/image.entity';

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
		@InjectRepository(Admin) private readonly productRepository: Repository<Product>,
		@InjectRepository(Admin) private readonly imageRepository: Repository<Image>,
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
		const product = await this.productRepository.findOne({
			where: { id: productId },
			relations: ['images'],
		});
		if (!product) throw new NotFoundException('محصول پیدا نشد');

		const image = this.imageRepository.create({
			product,
			url: `/uploads/products/${file.filename}`,
			isMain: product.images.length === 0,
		});

		return this.imageRepository.save(image);
	}

	async setMainImage(productId: number, imageId: number) {
		const product = await this.productRepository.findOne({
			where: { id: productId },
			relations: ['images'],
		});
		if (!product) throw new NotFoundException('محصول پیدا نشد');

		product.images.forEach((img) => (img.isMain = img.id === imageId));
		await this.imageRepository.save(product.images);
		return { success: true };
	}

	async deleteImage(imageId: number) {
		const image = await this.imageRepository.findOne({ where: { id: imageId } });
		if (!image) throw new NotFoundException('عکس پیدا نشد');
		return this.imageRepository.remove(image);
	}
}
