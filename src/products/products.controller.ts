import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	Query,
	UseGuards,
	BadRequestException,
} from '@nestjs/common';
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

	// مسیرهای خاص حتماً قبل از :id قرار بگیرند
	@Get('categories')
	getAllCategories() {
		return this.productsService.getAllCategories();
	}

	@Get('compare')
	async compareProducts(@Query('ids') ids: string) {
		const idList = ids.split(',').map((id) => +id);
		return this.productsService.findByIds(idList);
	}

	// مسیر داینامیک در انتها
	@Get(':id')
	findOne(@Param('id') id: string) {
		const numericId = parseInt(id, 10);
		if (isNaN(numericId)) {
			throw new BadRequestException('شناسه محصول معتبر نیست');
		}
		return this.productsService.findOne(numericId);
	}

	// افزودن محصول (فقط ادمین)
	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto);
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
}
