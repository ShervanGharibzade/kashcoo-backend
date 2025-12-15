import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';

const ALLOWED_ADDRESS_FIELDS: (keyof Address)[] = [
	'fullName',
	'province',
	'city',
	'street',
	'postalCode',
	'phone',
	'isDefault',
];

function sanitizePatch(data: Partial<Address>): Partial<Address> {
	const clean: Partial<Address> = {};

	for (const key of ALLOWED_ADDRESS_FIELDS) {
		const value = data[key];

		if (value === undefined || value === null) continue;
		if (typeof value === 'string' && value.trim() === '') continue;

		(clean as Partial<Record<keyof Address, unknown>>)[key] = value;
	}

	return clean;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		@InjectRepository(Address)
		private readonly addressRepo: Repository<Address>,
	) {}

	// ------------------- USER METHODS -------------------

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

	async findByEmail(email: string, options?: any): Promise<User | null> {
		return this.userRepo.findOne({ where: { email }, ...options });
	}

	async findByPhone(phoneNumber: string): Promise<User | null> {
		return this.userRepo.findOne({
			where: { phoneNumber },
			relations: ['token'],
		});
	}

	async findById(id: number): Promise<User> {
		const user = await this.userRepo.findOne({
			where: { id },
			relations: ['token'],
		});

		if (!user) throw new NotFoundException(`User with ID ${id} not found`);
		return user;
	}

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

	async remove(id: number): Promise<void> {
		const result = await this.userRepo.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
	}

	async findAll(): Promise<User[]> {
		return this.userRepo.find();
	}

	// ------------------- ADDRESS METHODS -------------------

	async createAddress(user: User, addressData: Partial<Address>): Promise<Address> {
		const cleanData = sanitizePatch(addressData);

		try {
			if (cleanData.isDefault === true) {
				await this.addressRepo.update({ user: { id: user.id }, isDefault: true }, { isDefault: false });
			}

			const address = this.addressRepo.create({
				...cleanData,
				user,
			});

			return await this.addressRepo.save(address);
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException('Failed to create address.');
		}
	}

	async findAllAddresses(userId: number): Promise<Address[]> {
		return this.addressRepo.find({
			where: { user: { id: userId } },
			order: {
				isDefault: 'DESC',
				createdAt: 'DESC',
			},
		});
	}

	async findAddressById(user: User, id: number): Promise<Address> {
		const address = await this.addressRepo.findOne({
			where: { id, user: { id: user.id } },
		});

		if (!address) {
			throw new NotFoundException(`Address with ID ${id} not found`);
		}

		return address;
	}

	async updateAddress(user: User, id: number, data: Partial<Address>): Promise<Address> {
		const address = await this.findAddressById(user, id);

		const cleanData = sanitizePatch(data);

		if (cleanData.isDefault === true) {
			await this.addressRepo.update({ user: { id: user.id }, isDefault: true }, { isDefault: false });
		}

		Object.assign(address, cleanData);

		try {
			return await this.addressRepo.save(address);
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException(`Failed to update address with ID ${id}`);
		}
	}

	async removeAddress(user: User, id: number) {
		const result = await this.addressRepo.delete({
			id,
			user: { id: user.id },
		});

		if (result.affected === 0) {
			throw new NotFoundException(`Address with ID ${id} not found`);
		}

		return { message: 'Address removed successfully' };
	}
}
