import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { ProductsService } from 'src/products/products.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
	constructor(private readonly productsService: ProductsService) {}

	@Get('products')
	getAllProducts() {
		return this.productsService.findAll();
	}

	@Delete('products/:id')
	removeProduct(@Param('id', ParseIntPipe) id: number) {
		return this.productsService.remove(id);
	}
}
