import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		@InjectRepository(Address)
		private readonly addressRepo: Repository<Address>,
	) {}

	// ------------------- USER METHODS -------------------

	// 1. CREATE USER
	async create(userData: Partial<User>): Promise<User> {
		try {
			const user = this.userRepo.create(userData);
			return await this.userRepo.save(user);
		} catch (error) {
			if (error.code === '23505') {
				throw new InternalServerErrorException('A user with this email or phone number already exists.');
			}
			throw new InternalServerErrorException('Failed to create user.');
		}
	}

	// 2. FIND USER BY EMAIL
	async findByEmail(email: string, options?: any): Promise<User | null> {
		return this.userRepo.findOne({ where: { email }, ...options });
	}

	// 3. FIND USER BY PHONE
	async findByPhone(phoneNumber: string): Promise<User | null> {
		return this.userRepo.findOne({ where: { phoneNumber }, relations: ['token'] });
	}

	// 4. FIND USER BY ID
	async findById(id: number): Promise<User> {
		const user = await this.userRepo.findOne({ where: { id }, relations: ['token'] });
		if (!user) throw new NotFoundException(`User with ID ${id} not found`);
		return user;
	}

	// 5. UPDATE USER
	async update(id: number, data: Partial<User>): Promise<User> {
		const user = await this.userRepo.findOneBy({ id });
		if (!user) throw new NotFoundException(`User with ID ${id} not found`);

		try {
			Object.assign(user, data);
			return await this.userRepo.save(user);
		} catch (error) {
			if (error.code === '23505') {
				throw new InternalServerErrorException('A user with this email or phone number already exists.');
			}
			throw new InternalServerErrorException(`Failed to update user with ID ${id}.`);
		}
	}

	// 6. REMOVE USER
	async remove(id: number): Promise<void> {
		const result = await this.userRepo.delete(id);
		if (result.affected === 0) throw new NotFoundException(`User with ID ${id} not found`);
	}

	// 7. LIST ALL USERS
	async findAll(): Promise<User[]> {
		return this.userRepo.find();
	}

	// ------------------- ADDRESS METHODS -------------------

	// CREATE ADDRESS
	async createAddress(user: User, addressData: Partial<Address>): Promise<Address> {
		try {
			if (addressData.isDefault) {
				// reset previous default address
				await this.addressRepo.update({ user: { id: user.id }, isDefault: true }, { isDefault: false });
			}

			const address = this.addressRepo.create({ ...addressData, user });
			return await this.addressRepo.save(address);
		} catch (error) {
			console.error(error); // log actual DB error
			throw new InternalServerErrorException('Failed to create address.');
		}
	}

	// LIST ALL ADDRESSES FOR A USER
	async findAllAddresses(user: number): Promise<Address[]> {
		return this.addressRepo.find({
			where: { user: { id: user } },
			order: { isDefault: 'DESC', createdAt: 'DESC' },
		});
	}

	// FIND ADDRESS BY ID
	async findAddressById(user: User, id: number): Promise<Address> {
		const address = await this.addressRepo.findOne({ where: { id, user } });
		if (!address) throw new NotFoundException(`Address with ID ${id} not found`);
		return address;
	}

	// UPDATE ADDRESS
	async updateAddress(user: User, id: number, data: Partial<Address>): Promise<Address> {
		const address = await this.findAddressById(user, id);
		if (data.isDefault) {
			await this.addressRepo.update({ user, isDefault: true }, { isDefault: false });
		}
		Object.assign(address, data);
		try {
			return await this.addressRepo.save(address);
		} catch (error) {
			throw new InternalServerErrorException(`Failed to update address with ID ${id}`);
		}
	}

	// REMOVE ADDRESS
	async removeAddress(user: User, id: number): Promise<void> {
		const address = await this.findAddressById(user, id);
		try {
			await this.addressRepo.remove(address);
		} catch (error) {
			throw new InternalServerErrorException(`Failed to remove address with ID ${id}`);
		}
	}
}
