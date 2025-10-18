// src/brands/dto/create-brand.dto.ts
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateBrandDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
	name: string;

	@IsOptional()
	@IsString()
	description?: string;
}
