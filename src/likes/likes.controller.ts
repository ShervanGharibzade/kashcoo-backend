import { Controller, UseGuards, Post, Param, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { LikesService } from './likes.service';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
	constructor(private service: LikesService) {}

	@UseGuards(JwtAuthGuard)
	@Post('toggle/:productId')
	async toggleLike(@Req() req: Request, @Param('productId') productId: number) {
		return this.service.toggleLike(req.user as any, +productId);
	}

	@Get('count/:productId')
	async count(@Param('productId') productId: number) {
		const count = await this.service.countProductLikes(+productId);
		return { productId: +productId, count };
	}

	@UseGuards(JwtAuthGuard)
	@Get('my')
	async myLikes(@Req() req: Request) {
		return this.service.getUserLikes(req.user as any);
	}
}
