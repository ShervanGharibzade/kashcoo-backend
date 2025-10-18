import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	price: number;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@Max(100)
	discountPercent: number;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	stock: number;

	@IsOptional()
	@IsString()
	brand?: string; // حالا رشته‌ای
}
