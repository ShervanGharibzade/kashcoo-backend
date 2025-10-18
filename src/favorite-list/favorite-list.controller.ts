import { Controller, UseGuards, Post, Param, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { FavoriteListService } from './favorite-list.service';
import { Request } from 'express';

@Controller('favorites')
export class FavoriteListController {
	constructor(private readonly service: FavoriteListService) {}

	@UseGuards(JwtAuthGuard)
	@Post('toggle/:productId')
	async toggleFavorite(@Req() req: Request, @Param('productId') productId: number) {
		return this.service.toggleFavorite(req.user as any, +productId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('my')
	async getMyFavorites(@Req() req: Request) {
		return this.service.getUserFavorites(req.user as any);
	}

	@Get('count/:productId')
	async countFavorites(@Param('productId') productId: number) {
		const count = await this.service.countFavoritesForProduct(+productId);
		return { productId: +productId, favorites: count };
	}
}
