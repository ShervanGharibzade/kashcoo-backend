import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { Product } from 'src/entities/product.entity';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	findAll(@Query() query: any): Promise<Product[]> {
		return this.productsService.findAll(query);
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.productsService.findOne(id);
	}

	// افزودن محصول (فقط ادمین)
	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto);
	}

	@Get('categories')
	getAllCategories() {
		return this.productsService.getAllCategories();
	}

	// ویرایش محصول
	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
		return this.productsService.update(id, dto);
	}

	// حذف محصول
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.productsService.remove(id);
	}

	@Get('compare')
	async compareProducts(@Query('ids') ids: string) {
		const idList = ids.split(',').map((id) => +id);
		return this.productsService.findByIds(idList);
	}
}
