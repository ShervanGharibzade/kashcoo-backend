// users/users.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
	) {}

	// 1. CREATE
	async create(userData: Partial<User>): Promise<User> {
		try {
			const user = this.userRepo.create(userData);
			return await this.userRepo.save(user);
		} catch (error) {
			// برای هندل کردن خطاهای منحصر به فرد (Unique constraint)
			if (error.code === '23505') {
				throw new InternalServerErrorException('A user with this email or phone number already exists.');
			}
			throw new InternalServerErrorException('Failed to create user.');
		}
	}

	// 2. FIND BY EMAIL
	async findByEmail(email: string, options?: any) {
		return this.userRepo.findOne({
			where: { email },
			...options,
		});
	}

	async findAll() {
		return this.userRepo.find();
	}

	// 3. FIND BY PHONE
	async findByPhone(phoneNumber: string): Promise<User | null> {
		// استفاده از findOneBy برای سادگی
		return this.userRepo.findOne({
			where: { phoneNumber },
			relations: ['token'],
		});
	}

	// 4. FIND BY ID (به روزرسانی شده برای بازگشت خطا در صورت عدم وجود)
	async findById(id: number): Promise<User> {
		// استفاده از findOneBy برای جلوگیری از ارور 'id'
		const user = await this.userRepo.findOne({
			where: { id },
			relations: ['token'],
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
		return user;
	}

	// 5. UPDATE
	async update(id: number, data: Partial<User>): Promise<User> {
		// ابتدا وجود کاربر را چک می‌کنیم تا NotFoundException مناسب صادر شود
		const user = await this.userRepo.findOneBy({ id });
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		try {
			// استفاده از Object.assign برای به‌روزرسانی محلی و سپس ذخیره
			Object.assign(user, data);
			return this.userRepo.save(user);
		} catch (error) {
			if (error.code === '23505') {
				throw new InternalServerErrorException('A user with this email or phone number already exists.');
			}
			throw new InternalServerErrorException(`Failed to update user with ID ${id}.`);
		}
	}

	// 6. REMOVE
	async remove(id: number): Promise<void> {
		const result = await this.userRepo.delete(id);

		if (result.affected === 0) {
			// اگر متد delete انجام شود ولی سطری تحت تأثیر قرار نگیرد، یعنی کاربر وجود نداشته
			throw new NotFoundException(`User with ID ${id} not found`);
		}
	}
}
