import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Request } from 'express';

@Controller('reviews')
export class ReviewsController {
	constructor(private service: ReviewsService) {}

	@Get('product/:id')
	async getByProduct(@Param('id') productId: number) {
		return this.service.findByProduct(productId);
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Req() req: Request, @Body() dto: CreateReviewDto) {
		// req.user از JwtAuthGuard تزریق می‌شه
		return this.service.create(req.user as any, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async update(@Req() req: Request, @Param('id') id: number, @Body() dto: UpdateReviewDto) {
		return this.service.update(+id, req.user as any, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Req() req: Request, @Param('id') id: number) {
		return this.service.remove(+id, req.user as any);
	}
}
