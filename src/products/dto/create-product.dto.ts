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

	@IsOptional()
	@IsString()
	category?: string;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@Max(100)
	discountPercent: number;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	stock: number;

	// شناسه برند مرتبط (کلید خارجی به Brand)
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	brandId?: number;
}
