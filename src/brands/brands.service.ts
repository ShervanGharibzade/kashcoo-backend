// src/brands/brands.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
	constructor(
		@InjectRepository(Brand)
		private readonly brandRepository: Repository<Brand>,
	) {}

	async create(createBrandDto: CreateBrandDto): Promise<Brand> {
		const brand = this.brandRepository.create(createBrandDto);
		return this.brandRepository.save(brand);
	}

	findAll(): Promise<Brand[]> {
		return this.brandRepository.find();
	}

	async findOne(id: number): Promise<Brand> {
		const brand = await this.brandRepository.findOneBy({ id });
		if (!brand) {
			throw new NotFoundException(`Brand with ID ${id} not found.`);
		}
		return brand;
	}

	async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
		const brand = await this.findOne(id); // پیدا کردن برند و چک کردن وجود آن
		this.brandRepository.merge(brand, updateBrandDto);
		return this.brandRepository.save(brand);
	}

	async remove(id: number): Promise<void> {
		const result = await this.brandRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Brand with ID ${id} not found.`);
		}
	}
}
