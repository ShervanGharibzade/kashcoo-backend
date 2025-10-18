// src/brands/brands.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
	constructor(private readonly brandsService: BrandsService) {}

	@Post()
	// 💡 نیاز به Guard برای نقش 'Admin' دارد
	create(@Body() createBrandDto: CreateBrandDto) {
		return this.brandsService.create(createBrandDto);
	}

	@Get()
	findAll() {
		return this.brandsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.brandsService.findOne(id);
	}

	@Patch(':id')
	// 💡 نیاز به Guard برای نقش 'Admin' دارد
	update(@Param('id', ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto) {
		return this.brandsService.update(id, updateBrandDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	// 💡 نیاز به Guard برای نقش 'Admin' دارد
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.brandsService.remove(id);
	}
}
